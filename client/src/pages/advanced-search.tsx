import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Monitor, Car, Accessibility, Shield, Baby, Siren, Check, LucideIcon, ChevronDown, ChevronUp, SlidersHorizontal, X, MapPin, Star, Clock } from "lucide-react";

// Mock results data
const mockResults = [
  { id: 1, name: "Dr. Arben Krasniqi", specialty: "Kardiolog", location: "Prishtinë", rating: 4.9, reviews: 127, experience: "15+ vite", available: true, image: null },
  { id: 2, name: "Klinika Rezonanca", specialty: "Diagnostikë", location: "Prishtinë", rating: 4.8, reviews: 89, experience: null, available: true, image: null },
  { id: 3, name: "Dr. Fjolla Berisha", specialty: "Dermatolog", location: "Prizren", rating: 4.7, reviews: 64, experience: "8 vite", available: false, image: null },
  { id: 4, name: "Spitali Amerikan", specialty: "Spital i përgjithshëm", location: "Prishtinë", rating: 4.6, reviews: 234, experience: null, available: true, image: null },
  { id: 5, name: "Dr. Besnik Gashi", specialty: "Ortoped", location: "Gjakovë", rating: 4.5, reviews: 45, experience: "12 vite", available: true, image: null },
  { id: 6, name: "Dr. Lindita Morina", specialty: "Pediatre", location: "Ferizaj", rating: 4.8, reviews: 112, experience: "10 vite", available: true, image: null },
];

export const AdvancedSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [availability, setAvailability] = useState("");
  const [experience, setExperience] = useState("");
  const [rating, setRating] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchBarCollapsed, setIsSearchBarCollapsed] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Count active filters
  const activeFilterCount = [category, location, gender, availability, experience, rating, language].filter(Boolean).length + selectedAmenities.length;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    setIsSearchBarCollapsed(true);
    setFiltersExpanded(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setLocation("");
    setGender("");
    setAvailability("");
    setExperience("");
    setRating("");
    setLanguage("");
    setSelectedAmenities([]);
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const amenities: { id: string; label: string; icon: LucideIcon }[] = [
    { id: "online", label: "Konsultim online", icon: Monitor },
    { id: "parking", label: "Parking", icon: Car },
    { id: "wheelchair", label: "Akses për invalidë", icon: Accessibility },
    { id: "insurance", label: "Pranon sigurim", icon: Shield },
    { id: "children", label: "Miqësor për fëmijë", icon: Baby },
    { id: "emergency", label: "Shërbim urgjence", icon: Siren },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Header - Hidden when search bar is collapsed/sticky */}
      {!isSearchBarCollapsed && (
        <div className="bg-white border-b border-[#dedede]">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
            <div className="flex items-center gap-4 mb-2">
              <Link
                to="/"
                className="text-[#9fa4b4] hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-[26px] font-bold tracking-[0.72px] text-[#494e60]">
                  Kërkim i Avancuar
                </h1>
                <p className="text-[14px] font-normal tracking-[0.39px] text-[#9fa4b4] mt-1">
                  Përdorni filtrat për të gjetur mjekun e duhur
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Search Bar (when collapsed with results) */}
      {isSearchBarCollapsed && hasSearched && (
        <div className="sticky top-16 z-40 bg-white border-b border-[#dedede] shadow-sm">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              {/* Compact Search Input */}
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9fa4b4]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kërko..."
                  className="pl-9 h-10 text-[14px] border-[#dedede] text-[#494e60] rounded-lg"
                />
              </div>
              
              {/* Expand Filters Button */}
              <button
                type="button"
                onClick={() => setIsSearchBarCollapsed(false)}
                className="flex items-center gap-2 px-3 py-2 h-10 bg-[#f8f9fa] rounded-lg border border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline text-[14px] font-semibold">Filtrat</span>
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Search Button */}
              <Button
                type="button"
                onClick={handleSearch}
                className="h-10 px-4 text-[14px] font-bold bg-primary hover:bg-[#2563eb] rounded-lg"
              >
                <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">Kërko</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`max-w-[1920px] mx-auto px-4 sm:px-6 py-4 sm:py-8 ${hasSearched ? "pb-24 md:pb-8" : "pb-24 md:pb-8"}`}>
        {/* Full Search Form (shown when not collapsed) */}
        {!isSearchBarCollapsed && (
        <form onSubmit={handleSearch}>
          <div className="bg-white border border-[#dedede] shadow-sm rounded-xl overflow-hidden">
            {/* Search Input - Always Visible */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9fa4b4]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Emri i mjekut, klinikës, specialitetit..."
                  className="pl-12 h-12 sm:h-14 text-[15px] sm:text-base border-[#dedede] text-[#494e60] rounded-lg"
                />
              </div>

              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="md:hidden w-full mt-3 flex items-center justify-between px-4 py-3 bg-[#f8f9fa] rounded-lg border border-[#e5e7eb] text-[#374151]"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="text-[15px] font-semibold">Filtrat e avancuara</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-white text-[12px] font-bold px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {filtersExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {/* Filter Grid - Collapsible on Mobile */}
            <div className={`border-t border-[#e5e7eb] transition-all duration-300 ease-in-out overflow-hidden ${
              isMobile && !filtersExpanded ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
            }`}>
              <div className="p-4 sm:p-6 md:p-8 pt-4 sm:pt-6 md:pt-6">
                {/* Active filters summary - Mobile */}
                {isMobile && activeFilterCount > 0 && (
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#e5e7eb]">
                    <span className="text-[14px] text-[#6b7280]">
                      {activeFilterCount} filtër aktiv
                    </span>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-[14px] font-semibold text-red-500 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Pastro
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* Category */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Kategoria
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 border-[#dedede]">
                    <SelectValue placeholder="Zgjidhni kategorinë" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Spital</SelectItem>
                    <SelectItem value="clinic">Klinikë</SelectItem>
                    <SelectItem value="doctor">Doktor</SelectItem>
                    <SelectItem value="lab">Laborator</SelectItem>
                    <SelectItem value="pharmacy">Barnatore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Specialiteti
                </label>
                <Select>
                  <SelectTrigger className="h-12 border-[#dedede]">
                    <SelectValue placeholder="Zgjidhni specialitetin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Kardiologji</SelectItem>
                    <SelectItem value="orthopedics">Ortopedi</SelectItem>
                    <SelectItem value="neurology">Neurologji</SelectItem>
                    <SelectItem value="dermatology">Dermatologji</SelectItem>
                    <SelectItem value="pediatrics">Pediatri</SelectItem>
                    <SelectItem value="radiology">Radiologji</SelectItem>
                    <SelectItem value="urology">Urologji</SelectItem>
                    <SelectItem value="gastroenterology">Gastroenterologji</SelectItem>
                    <SelectItem value="ophthalmology">Oftalmologji</SelectItem>
                    <SelectItem value="gynecology">Gjinekologji</SelectItem>
                    <SelectItem value="psychiatry">Psikiatri</SelectItem>
                    <SelectItem value="dentistry">Stomatologji</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Lokacioni
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-12 border-[#dedede]">
                    <SelectValue placeholder="Zgjidhni qytetin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prishtina">Prishtinë</SelectItem>
                    <SelectItem value="prizren">Prizren</SelectItem>
                    <SelectItem value="gjakova">Gjakovë</SelectItem>
                    <SelectItem value="peja">Pejë</SelectItem>
                    <SelectItem value="mitrovica">Mitrovicë</SelectItem>
                    <SelectItem value="ferizaj">Ferizaj</SelectItem>
                    <SelectItem value="gjilan">Gjilan</SelectItem>
                    <SelectItem value="podujeva">Podujevë</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Gjinia e mjekut
                </label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-12 border-[#dedede]">
                    <SelectValue placeholder="Zgjidhni gjininë" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Të gjitha</SelectItem>
                    <SelectItem value="male">Mashkull</SelectItem>
                    <SelectItem value="female">Femër</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Disponueshmëria
                </label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger className="h-12 border-[#dedede]">
                    <SelectValue placeholder="Kur dëshironi?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Hapur tani</SelectItem>
                    <SelectItem value="today">Sot</SelectItem>
                    <SelectItem value="tomorrow">Nesër</SelectItem>
                    <SelectItem value="week">Këtë javë</SelectItem>
                    <SelectItem value="weekend">Fundjavë</SelectItem>
                    <SelectItem value="anytime">Çdo kohë</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Përvoja
                </label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger className="h-12 border-[#dedede]">
                    <SelectValue placeholder="Vite përvojë" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Të gjitha</SelectItem>
                    <SelectItem value="1-3">1-3 vite</SelectItem>
                    <SelectItem value="3-5">3-5 vite</SelectItem>
                    <SelectItem value="5-10">5-10 vite</SelectItem>
                    <SelectItem value="10-15">10-15 vite</SelectItem>
                    <SelectItem value="15+">15+ vite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Vlerësimi minimal
                </label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger className="h-12 border-[#dedede]">
                    <SelectValue placeholder="Zgjidhni vlerësimin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Të gjitha</SelectItem>
                    <SelectItem value="4.5">⭐ 4.5+</SelectItem>
                    <SelectItem value="4">⭐ 4.0+</SelectItem>
                    <SelectItem value="3.5">⭐ 3.5+</SelectItem>
                    <SelectItem value="3">⭐ 3.0+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Gjuha
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-12 border-[#dedede]">
                    <SelectValue placeholder="Zgjidhni gjuhën" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="albanian">Shqip</SelectItem>
                    <SelectItem value="english">Anglisht</SelectItem>
                    <SelectItem value="german">Gjermanisht</SelectItem>
                    <SelectItem value="turkish">Turqisht</SelectItem>
                    <SelectItem value="serbian">Serbisht</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

                {/* Amenities Section */}
                <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-[#374151] mb-3">
                    Lehtësitë dhe Shërbimet
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => {
                      const isSelected = selectedAmenities.includes(amenity.id);
                      const IconComponent = amenity.icon;
                      return (
                        <button
                          key={amenity.id}
                          type="button"
                          onClick={() => toggleAmenity(amenity.id)}
                          className={`inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border text-[13px] sm:text-[14px] font-semibold transition-all duration-200 ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          <IconComponent className={`w-4 h-4 ${isSelected ? "text-primary" : "text-[#9ca3af]"}`} />
                          {amenity.label}
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex mt-6 pt-6 border-t border-[#e5e7eb] items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[14px] font-semibold text-[#6b7280] hover:text-[#374151] transition-colors"
                >
                  Pastro të gjitha filtrat
                </button>
                <div className="flex items-center gap-3">
                  {hasSearched ? (
                    <button
                      type="button"
                      onClick={() => setIsSearchBarCollapsed(true)}
                      className="px-6 py-3 text-center text-[15px] font-bold text-[#6b7280] hover:text-[#374151] border-2 border-[#d1d5db] rounded-lg hover:bg-[#f3f4f6] transition-all"
                    >
                      Mbyll filtrat
                    </button>
                  ) : (
                    <Link
                      to="/"
                      className="px-6 py-3 text-center text-[15px] font-bold text-[#6b7280] hover:text-[#374151] border-2 border-[#d1d5db] rounded-lg hover:bg-[#f3f4f6] transition-all"
                    >
                      Anulo
                    </Link>
                  )}
                  <Button
                    type="submit"
                    className="h-12 px-8 text-[15px] font-bold bg-primary hover:bg-[#2563eb] rounded-lg shadow-lg shadow-primary/25"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Kërko
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div className={`${isSearchBarCollapsed ? "" : "mt-6"}`}>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#374151]">
                  {mockResults.length} rezultate
                </h2>
                <p className="text-[13px] sm:text-[14px] text-[#6b7280]">
                  {searchQuery ? `Për "${searchQuery}"` : "Të gjitha rezultatet"}
                  {activeFilterCount > 0 && ` · ${activeFilterCount} filtër aktiv`}
                </p>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockResults.map((result) => (
                <Link
                  key={result.id}
                  to="/hospital"
                  className="bg-white border border-[#e5e7eb] rounded-xl p-4 hover:shadow-lg hover:border-primary/30 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center text-primary text-[18px] font-bold shrink-0">
                      {result.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Name & Availability */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[15px] font-bold text-[#374151] group-hover:text-primary transition-colors truncate">
                          {result.name}
                        </h3>
                        {result.available && (
                          <span className="shrink-0 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Hapur
                          </span>
                        )}
                      </div>
                      
                      {/* Specialty */}
                      <p className="text-[13px] text-[#6b7280] mt-0.5">{result.specialty}</p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-2 text-[12px] text-[#9ca3af]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {result.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          {result.rating}
                          <span className="text-[#c4c4c4]">({result.reviews})</span>
                        </span>
                        {result.experience && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {result.experience}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Sticky Search Button */}
        {!isSearchBarCollapsed && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#e5e7eb] shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-50">
          <div className="flex gap-3">
            {hasSearched ? (
              <button
                type="button"
                onClick={() => setIsSearchBarCollapsed(true)}
                className="flex-1 h-12 flex items-center justify-center text-[15px] font-bold text-[#6b7280] border-2 border-[#d1d5db] rounded-lg"
              >
                Mbyll
              </button>
            ) : (
              <Link
                to="/"
                className="flex-1 h-12 flex items-center justify-center text-[15px] font-bold text-[#6b7280] border-2 border-[#d1d5db] rounded-lg"
              >
                Anulo
              </Link>
            )}
            <Button
              type="button"
              onClick={handleSearch}
              className="flex-[2] h-12 text-[15px] font-bold bg-primary hover:bg-[#2563eb] rounded-lg shadow-lg shadow-primary/25"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Kërko
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-white/20 text-white text-[12px] font-bold px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        )}

        {/* Quick Tips - Hidden on mobile and when there are results */}
        {!hasSearched && (
        <div className="hidden md:block mt-8 bg-white border border-[#dedede] rounded-xl p-6 md:p-8">
          <h3 className="text-[18px] font-bold tracking-[0.5px] text-[#494e60] mb-4">
            💡 Këshilla për kërkim më të mirë
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-[14px] font-bold text-primary">
                1
              </div>
              <p className="text-[14px] text-[#6b7280]">
                Përdorni filtrin "Hapur tani" për të gjetur mjekë që punojnë aktualisht
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-[14px] font-bold text-primary">
                2
              </div>
              <p className="text-[14px] text-[#6b7280]">
                Filtri i përvojës ju ndihmon të gjeni specialistë me më shumë eksperiencë
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-[14px] font-bold text-primary">
                3
              </div>
              <p className="text-[14px] text-[#6b7280]">
                Kontrolloni opsionin "Konsultim online" për vizita nga shtëpia
              </p>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
