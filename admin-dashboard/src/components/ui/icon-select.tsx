import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import type { LucideIcon } from "lucide-react";

export type IconOption = { value: string; label: string };

type IconSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: IconOption[];
  getIcon: (value: string | null) => LucideIcon | null;
  placeholder?: string;
  className?: string;
};

export function IconSelect({
  value,
  onChange,
  options,
  getIcon,
  placeholder = "—",
  className,
}: IconSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SelectedIcon = value ? getIcon(value) : null;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-10 w-full rounded-lg border border-border px-2 py-2 flex items-center justify-center gap-1 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
      >
        {SelectedIcon ? (
          <SelectedIcon className="w-5 h-5 shrink-0 text-primary" />
        ) : (
          <span className="w-5 h-5 shrink-0 text-text-muted flex items-center justify-center text-xs">{placeholder}</span>
        )}
        <ChevronDown className={cn("w-4 h-4 shrink-0 text-text-muted transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 left-0 min-w-[280px] max-w-[360px] overflow-auto rounded-lg border border-border bg-white shadow-lg p-3">
          <div className="grid grid-cols-8 gap-1.5">
            {options.map((o) => {
              const Icon = o.value ? getIcon(o.value) : null;
              return (
                <button
                  key={o.value || "none"}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  title={o.value || placeholder}
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-colors",
                    value === o.value && "bg-primary/15 ring-2 ring-primary/50"
                  )}
                >
                  {Icon ? (
                    <Icon className="w-4 h-4 text-primary" />
                  ) : (
                    <span className="w-4 h-4 rounded bg-border" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
