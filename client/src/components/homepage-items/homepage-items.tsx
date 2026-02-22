import { Link } from "@tanstack/react-router";
import { StatusBadge } from "../status-badge/status-badge";

type HomePageItemsProps = {
  title: string;
  link: {
    url: string;
    label: string;
  };
  items: {
    img: string;
    name: string;
    location: string;
    isDoctor?: boolean;
    occuppation?: string;
    schedule?: {
      open: boolean;
    };
  }[];
};

export const HomePageItems = (props: HomePageItemsProps) => {
  const { title, link, items } = props;

  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold text-[#242936]">
          {title}
        </h2>
        <Link
          to={link.url}
          className="text-sm sm:text-base text-primary hover:text-primary/80 font-medium transition-colors"
        >
          {link.label} →
        </Link>
      </div>

      {/* Items Grid - Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
        {items.map((item, index) => (
          <Link
            key={index}
            to="/hospital"
            className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-auto snap-start"
          >
            <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer">
              {/* Card Content */}
              <div className="relative h-[180px] sm:h-[200px] md:h-[220px] flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white">
                {/* Status Badge */}
                {item.schedule && (
                  <div className="absolute top-3 left-3">
                    <StatusBadge isOpen={item.schedule.open} />
                  </div>
                )}

                {/* Image */}
                <img
                  src={item.img}
                  alt={item.name}
                  className={`transition-transform duration-300 group-hover:scale-105 ${
                    item.isDoctor
                      ? "w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg ring-4 ring-white"
                      : "max-w-full max-h-full object-contain"
                  }`}
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs sm:text-sm text-gray-400 mb-1">
                  📍 {item.location}
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 group-hover:text-primary transition-colors line-clamp-1">
                  {item.name}
                </h3>
                {item.isDoctor && item.occuppation && (
                  <p className="text-sm text-primary/70 mt-1">
                    {item.occuppation}
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
