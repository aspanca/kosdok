import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SocialShare } from "../components/social-share/social-share";
import { Reviews } from "../components/reviews/reviews";
import { AppointmentBooking } from "../components/appointment-booking/appointment-booking";
import { StatusBadge } from "../components/status-badge/status-badge";

const similarDoctors = [
  {
    id: 1,
    name: "Albana Spaifiu",
    specialty: "Dermatolog",
    img: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
  },
  {
    id: 2,
    name: "Edita Mehana",
    specialty: "Dermatolog",
    img: "https://img.freepik.com/free-photo/medium-shot-doctor-with-crossed-arms_23-2148868679.jpg",
  },
  {
    id: 3,
    name: "Driton Bunjinca",
    specialty: "Dermatolog",
    img: "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg",
  },
];

export const Doctor = () => {
  return (
    <div className="max-w-[1920px] mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 p-4 lg:p-6">
          {/* Back Link */}
          <Link
            to="/"
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
                  Alban Gashi
                </h1>
                <p className="text-base text-[#5e6478] mb-4">
                  Prishtinë, Kosova
                </p>

                {/* Profession */}
                <div className="mb-4">
                  <p className="text-sm text-[#9fa4b4] mb-1">Profesioni:</p>
                  <p className="text-base font-semibold text-primary">
                    Dermatolog
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#9fa4b4] mb-1">Telefoni:</p>
                    <p className="text-base font-semibold text-[#494e60]">
                      +383 49 123 456
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#9fa4b4] mb-1">Email:</p>
                    <a
                      href="mailto:albangashi@gmail.com"
                      className="text-primary hover:underline"
                    >
                      albangashi@gmail.com
                    </a>
                  </div>
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
                    src="https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg"
                    alt="Dr. Alban Gashi"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              {/* About */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#494e60] mb-3">
                  Rreth Dr. Alban Gashit
                </h2>
                <p className="text-sm leading-relaxed text-[#5e6478] mb-3">
                  Dr. Alban Gashi është një dermatolog i njohur me përvojë të
                  gjerë në diagnostikimin dhe trajtimin e sëmundjeve të lëkurës.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="text-sm leading-relaxed text-[#5e6478]">
                  Me mbi 15 vjet përvojë në fushën e dermatologjisë, Dr. Gashi
                  ka trajtuar me sukses mijëra pacientë dhe vazhdon të ofrojë
                  kujdes mjekësor të klasit botëror.
                </p>
              </div>

              {/* Specialty */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#494e60] mb-2">
                  Specialiteti
                </h2>
                <p className="text-sm text-[#5e6478]">Dermatolog</p>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#494e60] mb-2">
                  Edukimi
                </h2>
                <p className="text-sm text-[#5e6478] mb-1">
                  Medical School - Ljubljana Mirtin University, New Zealand,
                  Doctor of Medicine
                </p>
                <p className="text-sm text-[#5e6478]">
                  Sylber University, Barcelona, B. Dermatology
                </p>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#494e60] mb-2">Gjinia</h2>
                <p className="text-sm text-[#5e6478]">Mashkull</p>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-lg font-bold text-[#494e60] mb-4">
                  Eksperienca
                </h2>
                <div className="space-y-4">
                  {/* Current Position */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                    </div>
                    <div className="pb-4">
                      <h3 className="text-sm font-semibold text-[#494e60]">
                        Dermatolog
                      </h3>
                      <p className="text-sm text-primary">Spitali Amerikan</p>
                      <p className="text-xs text-[#9fa4b4] mt-1">
                        Jan 2019 - Present
                      </p>
                    </div>
                  </div>

                  {/* Previous Position */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#494e60]">
                        Praktikant Dermatolog
                      </h3>
                      <p className="text-sm text-[#5e6478]">
                        Qendra e Pacientëve Mjekësore Familjare
                      </p>
                      <p className="text-xs text-[#9fa4b4] mt-1">
                        Mars 2017 - Mars 2019
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment & Reviews - Side by Side on larger screens */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppointmentBooking
              entityType="doctor"
              entityName="Dr. Alban Gashi"
              entityImage="https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg"
              specialty="Dermatolog"
            />
            <Reviews entityType="doctor" entityName="Dr. Alban Gashi" />
          </div>

          {/* Similar Doctors Section */}
          <div className="mt-8">
            <h3 className="text-[26px] font-[550] leading-[1.15] tracking-[0.72px] text-[#242936] mb-4">
              Të ngjashme
            </h3>
            <div className="flex flex-wrap gap-6">
              {similarDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group cursor-pointer flex flex-col items-center text-center"
                >
                  {/* Photo Container - Rounded */}
                  <div className="relative w-24 h-24 mb-3">
                    <div className="w-full h-full rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 ring-4 ring-white">
                      <img
                        src={doctor.img}
                        alt={doctor.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <p className="text-xs text-[#9fa4b4] mb-1">Prishtina</p>
                  <h4 className="text-sm font-semibold text-[#494e60] group-hover:text-primary transition-colors">
                    {doctor.name}
                  </h4>
                  <p className="text-xs text-[#898e9f]">{doctor.specialty}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Map */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-auto lg:min-h-screen">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.5447754789397!2d21.15694307677631!3d42.66329621292626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549ee605110927%3A0x9365bfdf385eb95a!2sAmerican%20Hospital!5e0!3m2!1sen!2s!4v1707234567890!5m2!1sen!2s"
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
