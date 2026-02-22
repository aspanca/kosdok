import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { TrustBadge } from "../components/trust-badge/trust-badge";
import { StatusBadge } from "../components/status-badge/status-badge";

const resultsData = [
  {
    id: 1,
    isDoctor: true,
    occupation: "Kardiolog",
    city: "Prishtinë",
    name: "Dr. Anita Dent",
    description:
      "Specialiste e kardiologjisë me mbi 15 vite përvojë në diagnostikimin dhe trajtimin e sëmundjeve të zemrës.",
    phone: "+383 49 439 331",
    email: "anitadent@gmail.com",
    status: "Open",
    experience: "15+ vite",
    rating: 4.8,
    imageUrl:
      "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
  },
  {
    id: 2,
    isDoctor: false,
    city: "Mitrovicë",
    name: "Smile Dental Clinic",
    description:
      "Klinikë moderne stomatologjike me pajisje të fundit dhe staf profesional për të gjitha shërbimet dentare.",
    phone: "+383 49 123 456",
    email: "smiledental@gmail.com",
    status: "Closed",
    rating: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    isDoctor: true,
    occupation: "Dermatolog",
    city: "Prizren",
    name: "Dr. Eliza Shehu",
    description:
      "Dermatologe e certifikuar me ekspertizë në trajtimin e sëmundjeve të lëkurës dhe procedura kozmetike.",
    phone: "+383 49 789 123",
    email: "eliza.shehu@gmail.com",
    status: "Open",
    experience: "10 vite",
    rating: 4.9,
    imageUrl:
      "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg",
  },
  {
    id: 4,
    isDoctor: false,
    city: "Gjilan",
    name: "Healthy Life Hospital",
    description:
      "Spital multidisiplinar me departamente të specializuara dhe teknologji të avancuar mjekësore.",
    phone: "+383 49 654 321",
    email: "healthylife@gmail.com",
    status: "Open",
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    isDoctor: true,
    occupation: "Neurolog",
    city: "Prishtinë",
    name: "Dr. Arben Krasniqi",
    description:
      "Specialist i neurologjisë me fokus në trajtimin e sëmundjeve neurologjike dhe çrregullimeve të sistemit nervor.",
    phone: "+383 49 555 777",
    email: "arben.neuro@gmail.com",
    status: "Open",
    experience: "12 vite",
    rating: 4.7,
    imageUrl:
      "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg",
  },
  {
    id: 6,
    isDoctor: false,
    city: "Pejë",
    name: "Vita Pharmacy",
    description:
      "Barnatore me gamë të gjerë produktesh farmaceutike, vitaminash dhe produktesh kozmetike.",
    phone: "+383 49 888 999",
    email: "vita.pharm@gmail.com",
    status: "Open",
    rating: 4.4,
    imageUrl:
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=200&h=200&fit=crop",
  },
];

export const Results = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

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
              <Select>
                <SelectTrigger className="w-[calc(50%-4px)] sm:w-36 h-12 border-[#dedede]">
                  <SelectValue placeholder="Lokacioni" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Të gjitha</SelectItem>
                  <SelectItem value="prishtina">Prishtinë</SelectItem>
                  <SelectItem value="prizren">Prizren</SelectItem>
                  <SelectItem value="peja">Pejë</SelectItem>
                  <SelectItem value="gjilan">Gjilan</SelectItem>
                  <SelectItem value="mitrovica">Mitrovicë</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[calc(50%-4px)] sm:w-40 h-12 border-[#dedede]">
                  <SelectValue placeholder="Rendit sipas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Më relevante</SelectItem>
                  <SelectItem value="rating">Vlerësimi</SelectItem>
                  <SelectItem value="experience">Përvoja</SelectItem>
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
          <span className="font-semibold text-[#494e60]">{resultsData.length}</span> rezultate
          u gjetën
        </p>
        <TrustBadge variant="compact" />
      </div>

      {/* Results Grid */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {resultsData.map((item) => (
            <Link
              key={item.id}
              to={item.isDoctor ? "/doctor" : "/hospital"}
              className="group bg-white border border-[#dedede] shadow-sm overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-40 h-48 sm:h-auto flex-shrink-0 bg-white flex items-center justify-center p-4">
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <StatusBadge isOpen={item.status === "Open"} />
                  </div>

                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={`transition-transform duration-300 group-hover:scale-105 ${
                      item.isDoctor
                        ? "w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-lg"
                        : "max-w-[80%] max-h-[80%] object-contain"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-5 border-t sm:border-t-0 sm:border-l border-[#dedede]">
                  {/* Location & Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] font-normal tracking-[0.39px] text-[#9fa4b4]">
                      {item.city}
                    </span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-[#f5a623]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-[14px] font-semibold tracking-[0.39px] text-[#494e60]">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-[20px] font-[600] tracking-[0.56px] text-[#494e60] group-hover:text-primary transition-colors mb-1">
                    {item.name}
                  </h3>

                  {/* Occupation/Type */}
                  {item.isDoctor && item.occupation && (
                    <p className="text-[14px] font-[600] tracking-[0.39px] text-primary mb-2">
                      {item.occupation} • {item.experience}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-[14px] font-normal leading-[1.57] tracking-[0.39px] text-[#757b8c] line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  {/* Contact */}
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
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-white border border-[#dedede] text-[16px] font-[600] tracking-[0.44px] text-[#757b8c] hover:border-primary hover:text-primary transition-colors">
            Shiko më shumë rezultate
          </button>
        </div>
      </div>
    </div>
  );
};
