import Busboy from "busboy";
import { Resend } from "resend";
import punycode from "punycode/punycode.js";

type ParsedForm = {
  fields: Record<string, string>;
  files: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const parseForm = (req: any): Promise<ParsedForm> =>
  new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};
    const files: ParsedForm["files"] = [];
    let fileLimitHit = false;

    const busboy = Busboy({
      headers: req.headers,
      limits: { files: MAX_FILES, fileSize: MAX_FILE_SIZE },
    });

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("file", (_name, file, info) => {
      const { filename, mimeType } = info;
      const chunks: Buffer[] = [];

      file.on("limit", () => {
        fileLimitHit = true;
      });

      file.on("data", (data: Buffer) => {
        chunks.push(data);
      });

      file.on("end", () => {
        if (!filename) return;
        files.push({
          filename,
          content: Buffer.concat(chunks as Uint8Array[]).toString("base64"),
          contentType: mimeType || "application/octet-stream",
        });
      });
    });

    busboy.on("error", (error) => reject(error));

    busboy.on("finish", () => {
      if (fileLimitHit) {
        reject(new Error("Превышен лимит размера файла."));
        return;
      }

      resolve({ fields, files });
    });

    req.pipe(busboy);
  });

const sendJson = (
  res: any,
  status: number,
  payload: Record<string, unknown>,
) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const toAsciiEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (/^[\x00-\x7F]+$/.test(domain)) return email;

  const asciiDomain = domain
    .split(".")
    .map((label) =>
      /[^\x00-\x7F]/.test(label) ? `xn--${punycode.encode(label)}` : label,
    )
    .join(".");

  return `${local}@${asciiDomain}`;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmailRaw = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.RESEND_TO_EMAIL || "copy@9v.ru";

  if (!resendKey || !fromEmailRaw) {
    sendJson(res, 500, { error: "Email service is not configured." });
    return;
  }

  try {
    const { fields, files } = await parseForm(req);
    const resend = new Resend(resendKey);

    const calculationRaw = fields.calculation || "{}";
    let calculation: any = {};
    try {
      calculation = JSON.parse(calculationRaw);
    } catch {
      calculation = {};
    }

    const clientName = fields.clientName || "—";
    const clientCompany = fields.clientCompany || "—";
    const clientEmail = fields.clientEmail || "—";
    const message = fields.message || "";

    const inputSummary = calculation.inputSummary || {};
    const result = calculation.result || {};

    const subjectParts = ["Расчет стоимости"];
    if (clientName && clientName !== "—") subjectParts.push(clientName);
    if (clientCompany && clientCompany !== "—")
      subjectParts.push(clientCompany);

    const html = `
      <h2>Расчет стоимости</h2>
      <p><strong>Имя:</strong> ${clientName}</p>
      <p><strong>Компания:</strong> ${clientCompany}</p>
      <p><strong>Email:</strong> ${clientEmail}</p>
      ${message ? `<p><strong>Комментарий:</strong> ${message}</p>` : ""}
      <hr />
      <h3>Параметры</h3>
      <ul>
        <li><strong>Материал:</strong> ${inputSummary.material || "—"}</li>
        <li><strong>Печать:</strong> ${inputSummary.print || "—"}</li>
        <li><strong>Резка:</strong> ${inputSummary.cutting || "—"}</li>
        <li><strong>Количество:</strong> ${inputSummary.amount ?? "—"}</li>
        <li><strong>Ширина:</strong> ${inputSummary.width ?? "—"} ${
          inputSummary.unit || "м"
        }</li>
        <li><strong>Высота:</strong> ${inputSummary.height ?? "—"} ${
          inputSummary.unit || "м"
        }</li>
      </ul>
      <h3>Результат</h3>
      <ul>
        <li><strong>Площадь:</strong> ${Number(result.totalArea ?? 0).toFixed(
          2,
        )} м²</li>
        <li><strong>Периметр:</strong> ${Number(
          result.totalPerimeter ?? 0,
        ).toFixed(2)} м</li>
        <li><strong>Материал:</strong> ${Number(
          result.materialCost ?? 0,
        ).toFixed(2)} ₽</li>
        <li><strong>Печать:</strong> ${Number(result.printCost ?? 0).toFixed(
          2,
        )} ₽</li>
        <li><strong>Резка:</strong> ${Number(result.cuttingCost ?? 0).toFixed(
          2,
        )} ₽</li>
        <li><strong>Итого:</strong> ${Number(result.totalPrice ?? 0).toFixed(
          2,
        )} ₽</li>
      </ul>
    `;

    await resend.emails.send({
      from: toAsciiEmail(fromEmailRaw),
      to: toEmail,
      subject: subjectParts.join(" — "),
      html,
      replyTo: clientEmail !== "—" ? clientEmail : undefined,
      attachments: files,
    });

    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, {
      error:
        error instanceof Error ? error.message : "Не удалось отправить письмо.",
    });
  }
}
