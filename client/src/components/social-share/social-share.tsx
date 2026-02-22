import React from "react";

type Platform = "facebook" | "twitter" | "linkedin" | "google";

type Size = "xs" | "sm" | "md" | "lg";

type SocialShareProps = {
  /** Which platforms to display */
  platforms?: Platform[];
  /** Size variant */
  size?: Size;
  /** URL to share (optional - will use current page URL if not provided) */
  url?: string;
  /** Additional classes for the container */
  className?: string;
  /** Whether to show the "Shperndaje" label */
  showLabel?: boolean;
  /** Custom label text */
  labelText?: string;
};

const sizeClasses: Record<Size, { container: string; icon: string }> = {
  xs: { container: "w-5 h-5", icon: "w-3 h-3" },
  sm: { container: "w-6 h-6", icon: "w-3 h-3" },
  md: { container: "w-7 h-7", icon: "w-3.5 h-3.5" },
  lg: { container: "w-8 h-8", icon: "w-4 h-4" },
};

const platformConfig: Record<
  Platform,
  { bg: string; icon: React.ReactNode; getShareUrl: (url: string) => string }
> = {
  facebook: {
    bg: "bg-[#3b5998]",
    icon: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
    getShareUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  twitter: {
    bg: "bg-[#1da1f2]",
    icon: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    ),
    getShareUrl: (url) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
  linkedin: {
    bg: "bg-[#0077b5]",
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
    getShareUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  google: {
    bg: "bg-[#db4437]",
    icon: (
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    ),
    getShareUrl: (url) =>
      `mailto:?body=${encodeURIComponent(url)}`,
  },
};

export const SocialShare: React.FC<SocialShareProps> = ({
  platforms = ["facebook", "twitter", "linkedin"],
  size = "lg",
  url,
  className = "",
  showLabel = false,
  labelText = "Shperndaje",
}) => {
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const { container, icon } = sizeClasses[size];

  const handleShare = (e: React.MouseEvent, platform: Platform) => {
    e.preventDefault();
    e.stopPropagation();
    const shareLink = platformConfig[platform].getShareUrl(shareUrl);
    window.open(shareLink, "_blank", "width=600,height=400");
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-[#9fa4b4] mr-1">{labelText}</span>
      )}
      {platforms.map((platform) => {
        const config = platformConfig[platform];
        return (
          <a
            key={platform}
            href="#"
            onClick={(e) => handleShare(e, platform)}
            className={`${container} rounded-full ${config.bg} flex items-center justify-center hover:opacity-80 transition-opacity`}
            aria-label={`Share on ${platform}`}
          >
            <svg className={icon} fill="white" viewBox="0 0 24 24">
              {config.icon}
            </svg>
          </a>
        );
      })}
    </div>
  );
};
