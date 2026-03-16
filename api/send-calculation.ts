import Busboy from "busboy";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { createElement } from "react";
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

type SummaryValue = number | string | boolean | null | undefined;

type CalculationEmailProps = {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  message: string;
  personalDataConsent: string;
  inputSummary: Record<string, SummaryValue>;
  result: Record<string, SummaryValue>;
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const normalizeSpaces = (value: string) =>
  value.replace(/[\u00A0\u202F]/g, " ");

const formatNumber = (
  value: number | string,
  options: { maximumFractionDigits?: number; useGrouping?: boolean } = {},
) => {
  const numericValue =
    typeof value === "number" ? value : Number(String(value).replace(",", "."));

  if (Number.isNaN(numericValue)) return String(value);

  const { maximumFractionDigits = 2, useGrouping = false } = options;

  return normalizeSpaces(
    new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits,
      useGrouping,
    }).format(numericValue),
  );
};

const formatMoney = (value: number) =>
  formatNumber(value, { maximumFractionDigits: 2, useGrouping: true });

const page = {
  backgroundColor: "#f6f7fb",
  color: "#0f172a",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: "0",
  padding: "24px 0",
};

const card = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  margin: "0 auto",
  maxWidth: "640px",
  overflow: "hidden",
};

const shell = {
  padding: "32px",
};

const eyebrow = {
  color: "#475569",
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0.08em",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
};

const title = {
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "-0.02em",
  lineHeight: "1.2",
  margin: "0 0 10px",
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: "700",
  letterSpacing: "-0.01em",
  margin: "0 0 16px",
};

const block = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  marginBottom: "16px",
  padding: "18px 20px",
};

const row = {
  margin: "0 0 12px",
};

const rowLabel = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "1.4",
  margin: "0 0 4px",
};

const rowValue = {
  color: "#0f172a",
  fontSize: "15px",
  fontWeight: "500",
  lineHeight: "1.5",
  margin: "0",
};

const totalCard = {
  backgroundColor: "#0f172a",
  borderRadius: "18px",
  marginTop: "12px",
  padding: "20px 22px",
};

const totalLabel = {
  color: "#cbd5e1",
  fontSize: "12px",
  margin: "0 0 6px",
  textTransform: "uppercase" as const,
};

const totalValue = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "-0.02em",
  lineHeight: "1.1",
  margin: "0",
};

const divider = {
  borderColor: "#e2e8f0",
  margin: "28px 0",
};

const footer = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0",
};

const getValue = (value: SummaryValue, fallback = "—") => {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
};

const ResultRow = ({ label, value }: { label: string; value: string }) =>
  createElement(
    Section,
    { style: row },
    createElement(Text, { style: rowLabel }, label),
    createElement(Text, { style: rowValue }, value),
  );

const CalculationEmail = ({
  clientName,
  clientPhone,
  clientEmail,
  message,
  personalDataConsent,
  inputSummary,
  result,
}: CalculationEmailProps) => {
  const unit = getValue(inputSummary.unit, "м");
  const patternedCuttingEnabled = Boolean(inputSummary.patternedCuttingEnabled);
  const patternedPerimeter = getValue(inputSummary.patternedPerimeter, "");
  const totalPrice = formatMoney(Number(result.totalPrice ?? 0));

  return createElement(
    Html,
    { lang: "ru" },
    createElement(Head),
    createElement(
      Preview,
      null,
      `Новая заявка на расчет${clientName !== "—" ? `: ${clientName}` : ""}`,
    ),
    createElement(
      Body,
      { style: page },
      createElement(
        Container,
        { style: card },
        createElement(
          Section,
          { style: shell },
          createElement(Text, { style: eyebrow }, "Radiotochka Calculator"),
          createElement(
            Heading,
            { as: "h1", style: title },
            "Расчет стоимости",
          ),
          createElement(Hr, { style: divider }),
          createElement(
            Section,
            { style: block },
            createElement(
              Heading,
              { as: "h2", style: sectionTitle },
              "Контактные данные",
            ),
            createElement(ResultRow, { label: "Имя", value: clientName }),
            createElement(ResultRow, {
              label: "Телефон",
              value: clientPhone,
            }),
            createElement(ResultRow, { label: "Email", value: clientEmail }),
            createElement(ResultRow, {
              label: "Согласие на обработку персональных данных",
              value: personalDataConsent,
            }),
            message
              ? createElement(ResultRow, {
                  label: "Комментарий",
                  value: message,
                })
              : null,
          ),
          createElement(
            Section,
            { style: block },
            createElement(
              Heading,
              { as: "h2", style: sectionTitle },
              "Параметры заказа",
            ),
            createElement(ResultRow, {
              label: "Материал",
              value: getValue(inputSummary.material),
            }),
            createElement(ResultRow, {
              label: "Печать",
              value: getValue(inputSummary.print),
            }),
            createElement(ResultRow, {
              label: "Резка",
              value: getValue(inputSummary.cutting),
            }),
            createElement(ResultRow, {
              label: "Узорная резка",
              value: patternedCuttingEnabled ? "Да" : "Нет",
            }),
            patternedCuttingEnabled
              ? createElement(ResultRow, {
                  label: "Периметр узорной резки",
                  value: patternedPerimeter
                    ? `${formatNumber(patternedPerimeter)} ${unit}`
                    : "—",
                })
              : null,
            createElement(ResultRow, {
              label: "Количество",
              value: getValue(inputSummary.amount),
            }),
            createElement(ResultRow, {
              label: "Ширина",
              value: inputSummary.width
                ? `${formatNumber(getValue(inputSummary.width))} ${unit}`
                : "—",
            }),
            createElement(ResultRow, {
              label: "Длина",
              value: inputSummary.height
                ? `${formatNumber(getValue(inputSummary.height))} ${unit}`
                : "—",
            }),
          ),
          createElement(
            Section,
            { style: block },
            createElement(
              Heading,
              { as: "h2", style: sectionTitle },
              "Стоимость",
            ),
            createElement(ResultRow, {
              label: "Площадь",
              value: `${formatNumber(Number(result.totalArea ?? 0))} м²`,
            }),
            createElement(ResultRow, {
              label: "Периметр",
              value: `${formatNumber(Number(result.totalPerimeter ?? 0))} м`,
            }),
            createElement(ResultRow, {
              label: "Материал",
              value: `${formatMoney(Number(result.materialCost ?? 0))} ₽`,
            }),
            createElement(ResultRow, {
              label: "Печать",
              value: `${formatMoney(Number(result.printCost ?? 0))} ₽`,
            }),
            createElement(ResultRow, {
              label: "Резка",
              value: `${formatMoney(Number(result.cuttingCost ?? 0))} ₽`,
            }),
            createElement(
              Section,
              { style: totalCard },
              createElement(Text, { style: totalLabel }, "Итоговая стоимость"),
              createElement(Text, { style: totalValue }, `${totalPrice} ₽`),
            ),
          ),
          createElement(
            Text,
            { style: footer },
            "Письмо сформировано автоматически на сайте калькулятора.",
          ),
        ),
      ),
    ),
  );
};

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
    const clientPhone = fields.clientPhone || "—";
    const clientEmail = fields.clientEmail || "—";
    const message = fields.message || "";
    const personalDataConsent =
      fields.personalDataConsent === "accepted" ? "Подтверждено" : "Нет";

    const inputSummary = calculation.inputSummary || {};
    const result = calculation.result || {};

    const subjectParts = ["Расчет стоимости"];
    if (clientName && clientName !== "—") subjectParts.push(clientName);

    await resend.emails.send({
      from: toAsciiEmail(fromEmailRaw),
      to: toEmail,
      subject: subjectParts.join(" — "),
      react: CalculationEmail({
        clientName,
        clientPhone,
        clientEmail,
        message,
        personalDataConsent,
        inputSummary,
        result,
      }),
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
