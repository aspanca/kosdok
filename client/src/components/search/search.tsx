import { Link } from "@tanstack/react-router";
import { SearchForm } from "../search-form/search-form";
import { TrustBadge } from "../trust-badge/trust-badge";
import HomepagePng from "./assets/homepage.png";

export const Search = () => {
  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-8 md:py-12 lg:py-16 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4 xl:gap-12">
        {/* Text & Form Section */}
        <section className="w-full lg:w-[55%] xl:w-1/2 text-center lg:text-left z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-[70px] font-bold leading-tight tracking-tight text-[#494e60]">
            Gjej mjekun{" "}
            <span className="text-primary">e nevojshem</span>
          </h1>
          <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-md mx-auto lg:mx-0">
            Platforma më e madhe për gjetjen e mjekëve, klinikave dhe spitaleve në Kosovë
          </p>

          {/* Trust Badge */}
          <div className="mt-5">
            <TrustBadge className="max-w-md" />
          </div>
          
          {/* Search Form */}
          <div className="mt-6 md:mt-8">
            <SearchForm />
          </div>

          {/* Advanced Search Link */}
          <div className="mt-4 flex items-center justify-center lg:justify-start gap-2">
            <Link
              to="/advanced-search"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors group"
            >
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Kërkim i avancuar
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Më shumë filtra
              </span>
            </Link>
          </div>
        </section>

        {/* Image Section */}
        <section className="w-full lg:w-[45%] xl:w-1/2 flex justify-center lg:justify-end relative">
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <img
              src={HomepagePng}
              alt="Kosdok - Doktoret"
              className="w-full h-auto object-contain"
            />
          </div>
        </section>
      </div>
    </div>
  );
};
