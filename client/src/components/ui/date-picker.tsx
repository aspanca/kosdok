import * as React from "react";
import { DayPicker } from "react-day-picker";
import { format, parse } from "date-fns";
import { sq } from "date-fns/locale";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  fromYear?: number;
  toYear?: number;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  disabled,
  className,
  inputClassName,
  fromYear = 1920,
  toYear = new Date().getFullYear(),
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value ?? "");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedDate = value
    ? parse(value, "yyyy-MM-dd", new Date(), { locale: sq })
    : undefined;

  React.useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const str = format(date, "yyyy-MM-dd");
    setInputValue(str);
    onChange?.(str);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputValue(v);
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      onChange?.(v);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly
        className={cn(
          "flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          inputClassName
        )}
      />
      {open && (
        <div className="absolute z-50 mt-1 rounded-md border border-neutral-200 bg-white p-3 shadow-lg">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            locale={sq}
            defaultMonth={selectedDate ?? new Date()}
            fromYear={fromYear}
            toYear={toYear}
            startMonth={new Date(fromYear, 0)}
            endMonth={new Date(toYear, 11)}
            captionLayout="dropdown"
            className="rdp"
          />
        </div>
      )}
    </div>
  );
}
