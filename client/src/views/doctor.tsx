"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { SocialShare } from "../components/social-share/social-share";
import { Reviews } from "../components/reviews/reviews";
import { AppointmentBooking } from "../components/appointment-booking/appointment-booking";
import { StatusBadge } from "../components/status-badge/status-badge";
import { getDoctorById, searchProviders } from "../lib/api/providers";

const FALLBACK_AVATAR =
  "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg";

export const Doctor = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const id = Number(doctorId);

  const { data: doctor, isLoading, isError } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorById(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  const { data: similar = [] } = useQuery({
    queryKey: ["similar-doctors", doctor?.specialty, id],
    queryFn: () => searchProviders({ type: "doctor", q: doctor?.specialty ?? undefined }),
    enabled: !!doctor,
    select: (providers) => providers.filter((p) => p.id !== id).slice(0, 3),
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#9fa4b4]">
        Duke ngarkuar...
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-[#494e60]">Doktori nuk u gjet.</p>
        <Link href="/results" className="text-primary hover:underline text-sm">
          Kthehu te lista
        </Link>
      </div>
    );
  }

  const fullName = `${doctor.first_name} ${doctor.last_name}`;
  const avatar = doctor.avatar || FALLBACK_AVATAR;
  const mapQuery = encodeURIComponent([doctor.address, doctor.city, "Kosova"].filter(Boolean).join(", "));

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
                  <StatusBadge isOpen={true} />
                </div>

                {/* Doctor Name */}
                <h1 className="text-[26px] font-bold tracking-wide text-[#494e60] mb-1">
                  {fullName}
                </h1>
                <p className="text-base text-[#5e6478] mb-4">
                  {[doctor.city, "Kosova"].filter(Boolean).join(", ")}
                </p>

                {/* Profession */}
                {doctor.specialty && (
                  <div className="mb-4">
                    <p className="text-sm text-[#9fa4b4] mb-1">Profesioni:</p>
                    <p className="text-base font-semibold text-primary">
                      {doctor.specialty}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-3">
                  {doctor.phone && (
                    <div>
                      <p className="text-sm text-[#9fa4b4] mb-1">Telefoni:</p>
                      <p className="text-base font-semibold text-[#494e60]">
                        {doctor.phone}
                      </p>
                    </div>
                  )}

                  {doctor.email && (
                    <div>
                      <p className="text-sm text-[#9fa4b4] mb-1">Email:</p>
                      <a
                        href={`mailto:${doctor.email}`}
                        className="text-primary hover:underline"
                      >
                        {doctor.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Media */}
                <div className="mt-5">
                  <p className="text-sm text-[#9fa4b4] mb-3">Na ndiqni ne:</p>
                  <SocialShare
                    platforms={["facebook", "twitter", "linkedin", "google"]}
                    size="lg"
                  />
                </div>
              </div>

              {/* Right - Doctor Photo */}
              <div className="md:w-1/2">
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#4793ff] to-[#6AA8FF] aspect-square flex items-end justify-center">
                  <img
                    src={avatar}
                    alt={fullName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              {/* About */}
              {doctor.bio && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#494e60] mb-3">
                    Rreth Dr. {fullName}
                  </h2>
                  <p className="text-sm leading-relaxed text-[#5e6478]">{doctor.bio}</p>
                </div>
              )}

              {/* Specialty */}
              {doctor.specialty && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#494e60] mb-2">
                    Specialiteti
                  </h2>
                  <p className="text-sm text-[#5e6478]">{doctor.specialty}</p>
                </div>
              )}

              {/* Address */}
              {doctor.address && (
                <div>
                  <h2 className="text-lg font-bold text-[#494e60] mb-2">Adresa</h2>
                  <p className="text-sm text-[#5e6478]">
                    {[doctor.address, doctor.city].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Appointment & Reviews - Side by Side on larger screens */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppointmentBooking
              entityType="doctor"
              entityId={doctor.id}
              entityName={`Dr. ${fullName}`}
              entityImage={avatar}
              specialty={doctor.specialty ?? undefined}
            />
            <Reviews entityType="doctor" entityId={doctor.id} entityName={`Dr. ${fullName}`} />
          </div>

          {/* Similar Doctors Section */}
          {similar.length > 0 && (
            <div className="mt-8">
              <h3 className="text-[26px] font-[550] leading-[1.15] tracking-[0.72px] text-[#242936] mb-4">
                Të ngjashme
              </h3>
              <div className="flex flex-wrap gap-6">
                {similar.map((d) => (
                  <Link
                    key={d.id}
                    href={`/doctor/${d.id}`}
                    className="group cursor-pointer flex flex-col items-center text-center"
                  >
                    {/* Photo Container - Rounded */}
                    <div className="relative w-24 h-24 mb-3">
                      <div className="w-full h-full rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 ring-4 ring-white">
                        <img
                          src={d.image || FALLBACK_AVATAR}
                          alt={d.name}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <p className="text-xs text-[#9fa4b4] mb-1">{d.city || "Kosovë"}</p>
                    <h4 className="text-sm font-semibold text-[#494e60] group-hover:text-primary transition-colors">
                      {d.name}
                    </h4>
                    <p className="text-xs text-[#898e9f]">{d.specialty}</p>
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
            title="Doctor Location"
            className="min-h-[400px] lg:min-h-full"
          />
        </div>
      </div>
    </div>
  );
};
