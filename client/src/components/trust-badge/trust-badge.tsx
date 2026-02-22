interface TrustBadgeProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export const TrustBadge = ({ variant = "default", className = "" }: TrustBadgeProps) => {
  if (variant === "inline") {
    return (
      <div className={`inline-flex items-center gap-2 text-[12px] text-[#7ED321] font-[600] ${className}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Verifikuar nga Kosdok</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-[#7ED321]/10 border border-[#7ED321]/20 ${className}`}>
        <svg className="w-4 h-4 text-[#7ED321] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-[11px] font-[600] text-[#494e60] leading-tight">
          Monitorim dhe verifikim i vazhdueshëm
        </p>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2.5 bg-[#7ED321]/10 border border-[#7ED321]/20 ${className}`}>
      <div className="w-7 h-7 bg-[#7ED321] flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <p className="text-[12px] font-[600] text-[#494e60] leading-snug">
        Platforma e vetme në Kosovë që garanton monitorim dhe verifikim të vazhdueshëm për sigurinë e pacientëve.
      </p>
    </div>
  );
};
