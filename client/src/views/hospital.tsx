"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useServices } from "../lib/hooks/use-services";
import { getServiceIcon, getFacilityIcon } from "../lib/icons";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  ArrowLeft,
  Check,
} from "lucide-react";
import { SocialShare } from "../components/social-share/social-share";
import { Reviews } from "../components/reviews/reviews";
import { AppointmentBooking } from "../components/appointment-booking/appointment-booking";
import { StatusBadge } from "../components/status-badge/status-badge";
import { getClinicById, searchProviders } from "../lib/api/providers";
import { getFacilities } from "../lib/api/clinic";
import type { ScheduleDay } from "../lib/api/clinic";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
];

const WEEK_DAYS: { key: string; label: string; dayIndex: number }[] = [
  { key: "monday", label: "Hëne", dayIndex: 1 },
  { key: "tuesday", label: "Martë", dayIndex: 2 },
  { key: "wednesday", label: "Mërkurë", dayIndex: 3 },
  { key: "thursday", label: "Enjte", dayIndex: 4 },
  { key: "friday", label: "Premte", dayIndex: 5 },
  { key: "saturday", label: "Shtunë", dayIndex: 6 },
  { key: "sunday", label: "Diele", dayIndex: 0 },
];

function isOpenNow(schedule: Record<string, ScheduleDay>): boolean {
  const now = new Date();
  const today = WEEK_DAYS.find((d) => d.dayIndex === now.getDay());
  const day = today ? schedule[today.key] : undefined;
  if (!day || day.closed || !day.open || !day.close) return false;
  const minutes = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = day.open.split(":").map(Number);
  const [ch, cm] = day.close.split(":").map(Number);
  return minutes >= oh * 60 + om && minutes < ch * 60 + cm;
}

type TabType = "overview" | "services" | "schedule";

export const Hospital = () => {
  const { clinicId } = useParams<{ clinicId: string }>();
  const id = Number(clinicId);

  const { data: clinic, isLoading, isError } = useQuery({
    queryKey: ["clinic-public", id],
    queryFn: () => getClinicById(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  const { data: services = [] } = useServices();
  const { data: facilities = [] } = useQuery({
    queryKey: ["facilities"],
    queryFn: getFacilities,
  });

  const { data: similar = [] } = useQuery({
    queryKey: ["similar-clinics", clinic?.city, id],
    queryFn: () => searchProviders({ type: "clinic", city: clinic?.city ?? undefined }),
    enabled: !!clinic,
    select: (providers) => providers.filter((p) => p.id !== id).slice(0, 3),
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#9fa4b4]">
        Duke ngarkuar...
      </div>
    );
  }

  if (isError || !clinic) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-[#494e60]">Klinika nuk u gjet.</p>
        <Link href="/results" className="text-primary hover:underline text-sm">
          Kthehu te lista
        </Link>
      </div>
    );
  }

  const clinicName = clinic.clinic_name || clinic.name;
  const clinicImages = clinic.pictures.length > 0 ? clinic.pictures : FALLBACK_IMAGES;
  const clinicServices = services.filter((s) => clinic.serviceIds.includes(s.id));
  const clinicFacilities = facilities.filter((f) => clinic.facilityIds.includes(f.id));
  const mapQuery = encodeURIComponent([clinic.address, clinic.city, "Kosova"].filter(Boolean).join(", "));

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === clinicImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? clinicImages.length - 1 : prev - 1));
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: "overview", label: "Permbledhja" },
    { key: "services", label: "Sherbimet" },
    { key: "schedule", label: "Orari" },
  ];

  return (
    <div className="max-w-[1920px] mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 p-4 lg:p-6">
          {/* Back Link */}
          <Link
            href="/results"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kthehu te lista
          </Link>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Info */}
              <div className="md:w-1/2">
                {/* Status Badge */}
                <div className="mb-4">
                  <StatusBadge isOpen={isOpenNow(clinic.schedule)} />
                </div>

                {/* Clinic Name */}
                <h1 className="text-[26px] font-bold tracking-wide text-[#494e60] mb-1">
                  {clinicName}
                </h1>
                <p className="text-base text-[#5e6478] mb-6">
                  {[clinic.city, "Kosovë"].filter(Boolean).join(", ")}
                </p>

                {/* Contact Info */}
                <div className="space-y-4">
                  {clinic.phone && (
                    <div>
                      <p className="text-sm text-[#9fa4b4] mb-1">Telefoni:</p>
                      <p className="text-base font-semibold text-[#494e60]">
                        {clinic.phone}
                      </p>
                    </div>
                  )}

                  {clinic.email && (
                    <div>
                      <p className="text-sm text-[#9fa4b4] mb-1">Email:</p>
                      <a
                        href={`mailto:${clinic.email}`}
                        className="text-primary hover:underline"
                      >
                        {clinic.email}
                      </a>
                    </div>
                  )}

                  {clinic.website && (
                    <div>
                      <p className="text-sm text-[#9fa4b4] mb-1">Website:</p>
                      <a
                        href={clinic.website.startsWith("http") ? clinic.website : `https://${clinic.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {clinic.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Media */}
                <div className="mt-6">
                  <p className="text-sm text-[#9fa4b4] mb-3">Na ndiqni ne:</p>
                  <SocialShare
                    platforms={["facebook", "twitter", "linkedin", "google"]}
                    size="lg"
                  />
                </div>
              </div>

              {/* Right - Image Carousel */}
              <div className="md:w-1/2">
                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[4/3]">
                  {/* Logo Badge */}
                  {clinic.logo && (
                    <div className="absolute top-3 left-3 z-10 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center p-2 overflow-hidden">
                      <img
                        src={clinic.logo}
                        alt={`${clinicName} Logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Main Image */}
                  <img
                    src={clinicImages[currentImageIndex]}
                    alt={`${clinicName} ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows */}
                  {clinicImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-3 left-3 bg-black/50 text-white text-sm px-2 py-1 rounded">
                        {currentImageIndex + 1}/{clinicImages.length}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="mt-8 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 overflow-x-auto scrollbar-hide">
                  <div className="flex gap-4 sm:gap-6 min-w-max">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`pb-2 text-[13px] sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                          activeTab === tab.key
                            ? "text-primary"
                            : "text-[#757b8c] hover:text-[#494e60]"
                        }`}
                      >
                        {tab.label}
                        {activeTab === tab.key && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="hidden sm:flex items-center gap-2 text-sm text-[#757b8c] hover:text-primary transition-colors flex-shrink-0">
                  <Share2 className="w-4 h-4" />
                  Shperndaje
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-lg font-bold text-[#494e60] mb-4">
                    Njihuni me {clinicName}
                  </h2>
                  {clinic.description ? (
                    <p className="text-sm leading-relaxed text-[#5e6478] mb-6 whitespace-pre-line">
                      {clinic.description}
                    </p>
                  ) : (
                    <p className="text-sm text-[#9fa4b4] mb-6">Nuk ka përshkrim.</p>
                  )}

                  {/* Amenities Section */}
                  {clinicFacilities.length > 0 && (
                    <div className="border-t border-border pt-5 mt-2">
                      <h3 className="text-[13px] font-[600] text-text-muted uppercase tracking-wider mb-3">
                        Lehtësirat
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {clinicFacilities.map((facility) => {
                          const IconComponent = getFacilityIcon(facility.icon);
                          return (
                            <span
                              key={facility.id}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light bg-white text-[13px] font-medium text-text-secondary hover:border-primary/30 hover:bg-primary-lightest transition-colors"
                            >
                              <IconComponent className="w-4 h-4 text-primary" />
                              {facility.name}
                              <Check className="w-3.5 h-3.5 text-status-success" />
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "services" && (
                <div>
                  <h2 className="text-lg font-bold text-[#494e60] mb-6">
                    Shërbimet Mjekësore
                  </h2>
                  {clinicServices.length === 0 ? (
                    <p className="text-sm text-[#9fa4b4]">Nuk ka shërbime të listuara.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                      {clinicServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex flex-col items-center text-center group"
                        >
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            {(() => {
                              const Icon = getServiceIcon(service.icon);
                              return <Icon className="w-7 h-7 text-primary" />;
                            })()}
                          </div>
                          <span className="text-sm text-[#494e60] leading-tight">
                            {service.name}
                          </span>
                          {service.category && (
                            <span className="text-xs text-[#9fa4b4] mt-0.5 block">
                              {service.category}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "schedule" && (
                <div>
                  <h2 className="text-lg font-bold text-[#494e60] mb-6">
                    Orari i punes
                  </h2>
                  <div className="space-y-3">
                    {WEEK_DAYS.map((weekDay) => {
                      const day = clinic.schedule[weekDay.key];
                      const isToday = new Date().getDay() === weekDay.dayIndex;
                      const hours =
                        !day || day.closed || !day.open || !day.close
                          ? "Mbyllur"
                          : `${day.open} - ${day.close}`;
                      return (
                        <div key={weekDay.key} className="flex items-center gap-6">
                          <div
                            className={`w-28 py-2 px-4 rounded text-sm font-medium ${
                              isToday
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-[#494e60]"
                            }`}
                          >
                            {weekDay.label}
                          </div>
                          <span
                            className={`text-sm ${
                              isToday ? "text-primary font-medium" : "text-[#494e60]"
                            }`}
                          >
                            {hours}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Appointment & Reviews - Side by Side on larger screens */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppointmentBooking
              entityType="hospital"
              entityId={clinic.id}
              entityName={clinicName}
              entityImage={clinic.logo ?? undefined}
            />
            <Reviews entityType="hospital" entityId={clinic.id} entityName={clinicName} />
          </div>

          {/* Similar Clinics Section */}
          {similar.length > 0 && (
            <div className="mt-8">
              <h3 className="text-[26px] font-[550] leading-[1.15] tracking-[0.72px] text-[#242936] mb-4">
                Të ngjashme
              </h3>
              <div className="flex flex-wrap -mx-3">
                {similar.map((c) => (
                  <Link
                    key={c.id}
                    href={`/hospital/${c.id}`}
                    className="p-3 w-full sm:w-1/2 lg:w-1/3 block"
                  >
                    <div className="border border-solid p-5 shadow-lg h-[250px] flex flex-col justify-center items-center relative cursor-pointer hover:shadow-xl transition-shadow">
                      {/* Logo */}
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="max-w-[100%] max-h-[100%]"
                        />
                      ) : (
                        <span className="text-[40px] font-bold text-[#dde3ee]">
                          {c.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="py-3">
                      <h4 className="text-[14px] font-normal tracking-[0.39px] text-[#898e9f]">
                        {c.city || "Kosovë"}
                      </h4>
                      <h1 className="text-[20px] font-[600] tracking-[0.56px] text-[#818798]">
                        {c.name}
                      </h1>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right - Map */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-auto lg:min-h-screen">
          <iframe
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Hospital Location"
            className="min-h-[400px] lg:min-h-full"
          />
        </div>
      </div>

    </div>
  );
};
