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
import { formatMoney, formatNumber } from "../../shared/formatters.js";

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

const lead = {
  color: "#475569",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
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

const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <Section style={row}>
    <Text style={rowLabel}>{label}</Text>
    <Text style={rowValue}>{value}</Text>
  </Section>
);

export const CalculationEmail = ({
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

  return (
    <Html lang="ru">
      <Head />
      <Preview>{`Новая заявка на расчет${clientName !== "—" ? `: ${clientName}` : ""}`}</Preview>
      <Body style={page}>
        <Container style={card}>
          <Section style={shell}>
            <Text style={eyebrow}>Radiotochka Calculator</Text>
            <Heading as="h1" style={title}>
              Новый расчет стоимости
            </Heading>
            <Text style={lead}>
              Аккуратная сводка по заявке клиента с параметрами расчета и
              итоговой стоимостью.
            </Text>

            <Hr style={divider} />

            <Section style={block}>
              <Heading as="h2" style={sectionTitle}>
                Контактные данные
              </Heading>
              <ResultRow label="Имя" value={clientName} />
              <ResultRow label="Телефон" value={clientPhone} />
              <ResultRow label="Email" value={clientEmail} />
              <ResultRow
                label="Согласие на обработку персональных данных"
                value={personalDataConsent}
              />
              {message ? (
                <ResultRow label="Комментарий" value={message} />
              ) : null}
            </Section>

            <Section style={block}>
              <Heading as="h2" style={sectionTitle}>
                Параметры заказа
              </Heading>
              <ResultRow
                label="Материал"
                value={getValue(inputSummary.material)}
              />
              <ResultRow label="Печать" value={getValue(inputSummary.print)} />
              <ResultRow label="Резка" value={getValue(inputSummary.cutting)} />
              <ResultRow
                label="Узорная резка"
                value={patternedCuttingEnabled ? "Да" : "Нет"}
              />
              {patternedCuttingEnabled ? (
                <ResultRow
                  label="Периметр узорной резки"
                  value={
                    patternedPerimeter
                      ? `${formatNumber(patternedPerimeter)} ${unit}`
                      : "—"
                  }
                />
              ) : null}
              <ResultRow
                label="Количество"
                value={getValue(inputSummary.amount)}
              />
              <ResultRow
                label="Ширина"
                value={
                  inputSummary.width
                    ? `${formatNumber(getValue(inputSummary.width))} ${unit}`
                    : "—"
                }
              />
              <ResultRow
                label="Длина"
                value={
                  inputSummary.height
                    ? `${formatNumber(getValue(inputSummary.height))} ${unit}`
                    : "—"
                }
              />
            </Section>

            <Section style={block}>
              <Heading as="h2" style={sectionTitle}>
                Стоимость
              </Heading>
              <ResultRow
                label="Площадь"
                value={`${formatNumber(Number(result.totalArea ?? 0))} м²`}
              />
              <ResultRow
                label="Периметр"
                value={`${formatNumber(Number(result.totalPerimeter ?? 0))} м`}
              />
              <ResultRow
                label="Материал"
                value={`${formatMoney(Number(result.materialCost ?? 0))} ₽`}
              />
              <ResultRow
                label="Печать"
                value={`${formatMoney(Number(result.printCost ?? 0))} ₽`}
              />
              <ResultRow
                label="Резка"
                value={`${formatMoney(Number(result.cuttingCost ?? 0))} ₽`}
              />

              <Section style={totalCard}>
                <Text style={totalLabel}>Итоговая стоимость</Text>
                <Text style={totalValue}>{`${totalPrice} ₽`}</Text>
              </Section>
            </Section>

            <Text style={footer}>
              Письмо сформировано автоматически на сайте калькулятора.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CalculationEmail;
