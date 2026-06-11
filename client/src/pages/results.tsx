import { useEffect, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { TrustBadge } from "../components/trust-badge/trust-badge";
import { searchProviders } from "../lib/api/providers";
import { useCities } from "../lib/hooks/use-cities";

const DOCTOR_FALLBACK_IMG =
  "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg";

export const Results = () => {
  const search = useSearch({ from: "/results" });
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(search.q ?? "");
  const [sortBy, setSortBy] = useState("relevance");
  const { data: cities = [] } = useCities();

  // Keep the URL in sync with the search input (debounced)
  useEffect(() => {
    const handle = setTimeout(() => {
      if ((search.q ?? "") !== searchQuery) {
        navigate({
          to: "/results",
          search: { ...search, q: searchQuery || undefined },
          replace: true,
        });
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [searchQuery, search, navigate]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["providers", search.q, search.city, search.type, search.serviceId],
    queryFn: () =>
      searchProviders({
        q: search.q,
        city: search.city,
        type: search.type,
        serviceId: search.serviceId,
      }),
  });

  const sorted = [...results].sort((a, b) => {
    if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    if (sortBy === "name") return a.name.localeCompare(b.name, "sq");
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Search Header */}
      <div className="bg-white border-b border-[#dedede] sticky top-16 z-40">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9fa4b4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kërko mjekë, klinika, spitale..."
                className="pl-12 h-12 border-[#dedede] text-[#494e60]"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 sm:gap-3">
              <Select
                value={search.city ?? "all"}
                onValueChange={(value) =>
                  navigate({
                    to: "/results",
                    search: { ...search, city: value === "all" ? undefined : value },
                    replace: true,
                  })
                }
              >
                <SelectTrigger className="w-[calc(50%-4px)] sm:w-36 h-12 border-[#dedede]">
                  <SelectValue placeholder="Lokacioni" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Të gjitha</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[calc(50%-4px)] sm:w-40 h-12 border-[#dedede]">
                  <SelectValue placeholder="Rendit sipas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Më relevante</SelectItem>
                  <SelectItem value="rating">Vlerësimi</SelectItem>
                  <SelectItem value="name">Emri A-Z</SelectItem>
                </SelectContent>
              </Select>

              <Link
                to="/advanced-search"
                className="hidden sm:flex items-center gap-2 px-4 h-12 border border-[#dedede] rounded-md text-[14px] font-normal tracking-[0.39px] text-[#757b8c] hover:border-primary hover:text-primary transition-colors"
              >
                <svg
                  className="w-4 h-4"
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
                Filtra
              </Link>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <Link
            to="/advanced-search"
            className="sm:hidden mt-3 flex items-center justify-center gap-2 w-full h-11 bg-primary text-white rounded-md text-[14px] font-[600]"
          >
            <svg
              className="w-4 h-4"
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
          </Link>
        </div>
      </div>

      {/* Results Info */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-[14px] font-normal tracking-[0.39px] text-[#9fa4b4]">
          <span className="font-semibold text-[#494e60]">{sorted.length}</span> rezultate
          u gjetën
        </p>
        <TrustBadge variant="compact" />
      </div>

      {/* Results Grid */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 pb-12">
        {isLoading ? (
          <div className="py-16 text-center text-[#9fa4b4]">Duke kërkuar...</div>
        ) : sorted.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#494e60] font-semibold mb-1">Nuk u gjetën rezultate</p>
            <p className="text-[14px] text-[#9fa4b4]">
              Provoni një kërkim tjetër ose ndryshoni filtrat.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {sorted.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                to={item.type === "doctor" ? "/doctor/$doctorId" : "/hospital/$clinicId"}
                params={
                  item.type === "doctor"
                    ? { doctorId: String(item.id) }
                    : { clinicId: String(item.id) }
                }
                className="group bg-white border border-[#dedede] shadow-sm overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative w-full sm:w-40 h-48 sm:h-auto flex-shrink-0 bg-white flex items-center justify-center p-4">
                    {item.image || item.type === "doctor" ? (
                      <img
                        src={item.image || DOCTOR_FALLBACK_IMG}
                        alt={item.name}
                        className={`transition-transform duration-300 group-hover:scale-105 ${
                          item.type === "doctor"
                            ? "w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-lg"
                            : "max-w-[80%] max-h-[80%] object-contain"
                        }`}
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#f0f3f9] flex items-center justify-center text-[32px] font-bold text-[#b9c2d4]">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-5 border-t sm:border-t-0 sm:border-l border-[#dedede]">
                    {/* Location & Rating */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-normal tracking-[0.39px] text-[#9fa4b4]">
                        {item.city || "Kosovë"}
                      </span>
                      {item.rating != null && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-[#f5a623]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-[14px] font-semibold tracking-[0.39px] text-[#494e60]">
                            {item.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-[20px] font-[600] tracking-[0.56px] text-[#494e60] group-hover:text-primary transition-colors mb-1">
                      {item.type === "doctor" ? `Dr. ${item.name}` : item.name}
                    </h3>

                    {/* Occupation/Type */}
                    {item.type === "doctor" && item.specialty && (
                      <p className="text-[14px] font-[600] tracking-[0.39px] text-primary mb-2">
                        {item.specialty}
                      </p>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-[14px] font-normal leading-[1.57] tracking-[0.39px] text-[#757b8c] line-clamp-2 mb-4">
                        {item.description}
                      </p>
                    )}

                    {/* Contact */}
                    {item.phone && (
                      <div className="flex flex-wrap gap-4 text-[14px] font-normal tracking-[0.39px] text-[#8c92a3]">
                        <span className="flex items-center gap-1.5">
                          <svg
                            className="w-4 h-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {item.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
