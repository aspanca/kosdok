import { format, parseISO, isValid } from "date-fns";
import { sq } from "date-fns/locale";
import type { Locale } from "date-fns";

/**
 * Format a date string (YYYY-MM-DD or ISO) for display using the current locale.
 * Returns a readable, localized date string.
 */
export function formatDate(
  dateValue: string | Date | undefined | null,
  options?: { locale?: Locale; pattern?: string }
): string {
  if (dateValue == null || dateValue === "") return "—";

  const date =
    typeof dateValue === "string"
      ? dateValue.length === 10
        ? parseISO(dateValue + "T12:00:00")
        : parseISO(dateValue)
      : dateValue;

  if (!isValid(date)) return "—";

  const pattern = options?.pattern ?? "d MMMM yyyy";
  const locale = options?.locale ?? sq;

  return format(date, pattern, { locale });
}

/**
 * Format a date for use in HTML date input (YYYY-MM-DD).
 */
export function formatDateForInput(value: string | undefined | null): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value + (value.length === 10 ? "T12:00:00" : ""));
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
