interface StatusBadgeProps {
  isOpen: boolean;
  variant?: "default" | "compact" | "dot";
  className?: string;
}

/**
 * StatusBadge - Reusable component for showing open/closed status
 * 
 * Variants:
 * - default: Colored square + text label
 * - compact: Just the colored dot/square
 * - dot: Small circular dot indicator
 */
export const StatusBadge = ({ 
  isOpen, 
  variant = "default",
  className = "" 
}: StatusBadgeProps) => {
  const colors = {
    open: "bg-status-success",
    closed: "bg-status-error",
  };

  const bgColor = isOpen ? colors.open : colors.closed;
  const label = isOpen ? "Hapur" : "Mbyllur";

  if (variant === "dot") {
    return (
      <span 
        className={`w-2.5 h-2.5 rounded-full ${bgColor} ${className}`}
        aria-label={label}
      />
    );
  }

  if (variant === "compact") {
    return (
      <span 
        className={`w-[24px] h-[24px] rounded-tl-lg rounded-br-lg ${bgColor} ${className}`}
        aria-label={label}
      />
    );
  }

  // Default variant with square + text
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className={`w-[24px] h-[24px] rounded-tl-lg rounded-br-lg ${bgColor}`} />
      <span className="text-sm text-text-muted">{label}</span>
    </div>
  );
};
