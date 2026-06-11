"use client";

import Link from "next/link";
import type { ProviderSummary } from "../../lib/api/providers";

type HomePageItemsProps = {
  title: string;
  link: {
    label: string;
    type?: "clinic" | "doctor";
  };
  items: ProviderSummary[];
};

const DOCTOR_FALLBACK_IMG =
  "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg";

export const HomePageItems = (props: HomePageItemsProps) => {
  const { title, link, items } = props;

  if (items.length === 0) return null;

  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold text-[#242936]">
          {title}
        </h2>
        <Link
          href={
            link.type !== undefined
              ? { pathname: "/results", query: { type: link.type } }
              : "/results"
          }
          className="text-sm sm:text-base text-primary hover:text-primary/80 font-medium transition-colors"
        >
          {link.label} →
        </Link>
      </div>

      {/* Items Grid - Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={
              item.type === "doctor"
                ? `/doctor/${String(item.id)}`
                : `/hospital/${String(item.id)}`
            }
            className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-auto snap-start"
          >
            <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer">
              {/* Card Content */}
              <div className="relative h-[180px] sm:h-[200px] md:h-[220px] flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white">
                {/* Image */}
                {item.image || item.type === "doctor" ? (
                  <img
                    src={item.image || DOCTOR_FALLBACK_IMG}
                    alt={item.name}
                    className={`transition-transform duration-300 group-hover:scale-105 ${
                      item.type === "doctor"
                        ? "w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg ring-4 ring-white"
                        : "max-w-full max-h-full object-contain"
                    }`}
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[#f0f3f9] flex items-center justify-center text-[36px] font-bold text-[#b9c2d4]">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs sm:text-sm text-gray-400 mb-1">
                  📍 {item.city || "Kosovë"}
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 group-hover:text-primary transition-colors line-clamp-1">
                  {item.type === "doctor" ? `Dr. ${item.name}` : item.name}
                </h3>
                {item.type === "doctor" && item.specialty && (
                  <p className="text-sm text-primary/70 mt-1">
                    {item.specialty}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
