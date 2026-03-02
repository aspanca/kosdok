import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServices } from "../lib/hooks/use-services";
import { getServiceIcon } from "../lib/icons";
import { 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  ArrowLeft, 
  Monitor,
  Car,
  Accessibility,
  Shield,
  Baby,
  Siren,
  CreditCard,
  Wifi,
  Check
} from "lucide-react";
import { SocialShare } from "../components/social-share/social-share";
import { Reviews } from "../components/reviews/reviews";
import { AppointmentBooking } from "../components/appointment-booking/appointment-booking";
import { StatusBadge } from "../components/status-badge/status-badge";

import SpitaliAmerikanImg from "./assets/spitali-amerikan.png";
import VitaImg from "./assets/vita.png";
import RezonancaImg from "./assets/rezonanca.png";

const clinicImages = [
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80",
  "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80",
];

const similarClinics = [
  {
    id: 1,
    name: "Spitali Amerikan",
    city: "Prishtina",
    logo: SpitaliAmerikanImg,
    isOpen: false,
  },
  {
    id: 2,
    name: "Vita Hospital",
    city: "Prishtina",
    logo: VitaImg,
    isOpen: true,
  },
  {
    id: 3,
    name: "Q.D.T. Rezonanca",
    city: "Prishtina",
    logo: RezonancaImg,
    isOpen: true,
  },
];

type TabType = "overview" | "services" | "staff" | "schedule";

export const Hospital = () => {
  const { data: services = [] } = useServices();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === clinicImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? clinicImages.length - 1 : prev - 1
    );
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: "overview", label: "Permbledhja" },
    { key: "services", label: "Sherbimet" },
    { key: "staff", label: "Stafi Mjeksor" },
    { key: "schedule", label: "Orari" },
  ];

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

                {/* Clinic Name */}
                <h1 className="text-[26px] font-bold tracking-wide text-[#494e60] mb-1">
                  Spitali Amerikan
                </h1>
                <p className="text-base text-[#5e6478] mb-6">
                  Prishtinë, Kosove
                </p>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#9fa4b4] mb-1">Telefoni:</p>
                    <p className="text-base font-semibold text-[#494e60]">
                      +383 49 123 456
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#9fa4b4] mb-1">Email:</p>
                    <a
                      href="mailto:spitaliamerikan@gmail.com"
                      className="text-primary hover:underline"
                    >
                      spitaliamerikan@gmail.com
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-[#9fa4b4] mb-1">Website:</p>
                    <a
                      href="https://www.spitaliamerikan.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      www.spitaliamerikan.com
                    </a>
                  </div>
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
                  <div className="absolute top-3 left-3 z-10 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center p-2 overflow-hidden">
                    <img
                      src={SpitaliAmerikanImg}
                      alt="Spitali Amerikan Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Main Image */}
                  <img
                    src={clinicImages[currentImageIndex]}
                    alt={`Clinic view ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows */}
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
                    Njihuni me Spitalin Amerikan
                  </h2>
                  <p className="text-sm leading-relaxed text-[#5e6478] mb-4">
                    Spitali Amerikan në Shqipëri u themelua në Dhjetor 2006 si
                    spitali i parë privat në vend.
                  </p>
                  <p className="text-sm leading-relaxed text-[#5e6478] mb-4">
                    Filloi aktivitetin e tij në Kardiologji dhe Kardiokirurgji
                    me rekrutimin e një stafi profesionistësh të huaj me
                    eksperiencë në këtë fushë dhe me qëllimin që t'ju shërbyer
                    pacientëve brenda dhe jashtë vendit. Brenda një viti
                    reduktoi në 85% fluksin e pacientëve kardiakë që linin
                    Shqipërinë për t'u kuruar jashtë.
                  </p>
                  <p className="text-sm leading-relaxed text-[#5e6478] mb-6">
                    Pas këtij suksesi Spitali Amerikan shpejt zgjeroi
                    aktivitetin duke u fokusuar në fillim në kirurgji të
                    përgjithshme, ortopedi, kirurgji e syrit e urologji deri sa
                    mberriti në kapacitetin e plotë që gëzon sot.
                  </p>

                  {/* Amenities Section */}
                  <div className="border-t border-border pt-5 mt-2">
                    <h3 className="text-[13px] font-[600] text-text-muted uppercase tracking-wider mb-3">
                      Lehtësirat
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: Monitor, label: "Konsultim online" },
                        { icon: Car, label: "Parking" },
                        { icon: Accessibility, label: "Akses për invalidë" },
                        { icon: Shield, label: "Pranon sigurim" },
                        { icon: Baby, label: "Miqësor për fëmijë" },
                        { icon: Siren, label: "Shërbim urgjence" },
                        { icon: CreditCard, label: "Kartë krediti" },
                        { icon: Wifi, label: "Wi-Fi" },
                      ].map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <span
                            key={item.label}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light bg-white text-[13px] font-medium text-text-secondary hover:border-primary/30 hover:bg-primary-lightest transition-colors"
                          >
                            <IconComponent className="w-4 h-4 text-primary" />
                            {item.label}
                            <Check className="w-3.5 h-3.5 text-status-success" />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "services" && (
                <div>
                  <h2 className="text-lg font-bold text-[#494e60] mb-6">
                    Shërbimet Mjekësore
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                    {services.map((service) => (
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
                </div>
              )}

              {activeTab === "staff" && (
                <div>
                  <h2 className="text-lg font-bold text-[#494e60] mb-6">
                    Stafi Mjeksor
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                    {[
                      { name: "Dr. Mentodije Alushaj - Rexha", specialty: "Alergolog", img: "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg" },
                      { name: "Dr. Ismet Jusufi", specialty: "Aneztesist-Reanimator", img: "https://img.freepik.com/free-photo/medium-shot-doctor-with-crossed-arms_23-2148868679.jpg" },
                      { name: "Dr. Antigona Hasani", specialty: "Alergolog", img: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg" },
                      { name: "Dr. Zekë Zeka Mr. Sci", specialty: "Alergolog", img: "https://img.freepik.com/free-photo/portrait-successful-mid-adult-doctor-with-crossed-arms_1262-12865.jpg" },
                      { name: "Dr. Feim Muçolli", specialty: "Aneztesist-Reanimator", img: "https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827776.jpg" },
                      { name: "Dr. Arben Krasniqi", specialty: "Kardiolog", img: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg" },
                      { name: "Dr. Besnik Hoxha", specialty: "Gastroenterolog", img: "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg" },
                      { name: "Dr. Fitore Berisha", specialty: "Endokrinolog", img: "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg" },
                      { name: "Dr. Driton Morina", specialty: "Hematolog", img: "https://img.freepik.com/free-photo/front-view-male-doctor-medical-suit_23-2148453467.jpg" },
                      { name: "Dr. Leonora Gashi", specialty: "Neurolog", img: "https://img.freepik.com/free-photo/female-doctor-lab-coat-with-stethoscope_23-2148827769.jpg" },
                    ].map((doctor, index) => (
                      <div
                        key={index}
                        className="group cursor-pointer flex flex-col items-center text-center"
                      >
                        {/* Photo Container - Rounded */}
                        <div className="relative w-28 h-28 mb-4">
                          <div className="w-full h-full rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 ring-4 ring-white">
                            <img
                              src={doctor.img}
                              alt={doctor.name}
                              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </div>
                        
                        {/* Info */}
                        <h3 className="text-[15px] font-semibold text-[#494e60] leading-tight mb-1 group-hover:text-primary transition-colors">
                          {doctor.name}
                        </h3>
                        <p className="text-[13px] text-[#898e9f]">
                          {doctor.specialty}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "schedule" && (
                <div>
                  <h2 className="text-lg font-bold text-[#494e60] mb-6">
                    Orari i punes
                  </h2>
                  <div className="space-y-3">
                    {[
                      { day: "Hene", hours: "08:00 - 17:00", dayIndex: 1 },
                      { day: "Marte", hours: "08:00 - 17:00", dayIndex: 2 },
                      { day: "Merkure", hours: "08:00 - 17:00", dayIndex: 3 },
                      { day: "Enjte", hours: "08:00 - 17:00", dayIndex: 4 },
                      { day: "Premte", hours: "08:00 - 17:00", dayIndex: 5 },
                      { day: "Shtune", hours: "08:00 - 17:00", dayIndex: 6 },
                      { day: "Diele", hours: "08:00 - 17:00", dayIndex: 0 },
                    ].map((schedule) => {
                      const isToday = new Date().getDay() === schedule.dayIndex;
                      return (
                        <div key={schedule.day} className="flex items-center gap-6">
                          <div
                            className={`w-28 py-2 px-4 rounded text-sm font-medium ${
                              isToday
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-[#494e60]"
                            }`}
                          >
                            {schedule.day}
                          </div>
                          <span
                            className={`text-sm ${
                              isToday ? "text-primary font-medium" : "text-[#494e60]"
                            }`}
                          >
                            {schedule.hours}
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
              entityName="Spitali Amerikan"
              entityImage={SpitaliAmerikanImg}
            />
            <Reviews entityType="hospital" entityName="Spitali Amerikan" />
          </div>

          {/* Similar Clinics Section */}
          <div className="mt-8">
            <h3 className="text-[26px] font-[550] leading-[1.15] tracking-[0.72px] text-[#242936] mb-4">
              Të ngjashme
            </h3>
            <div className="flex flex-wrap -mx-3">
              {similarClinics.map((clinic) => (
                <div key={clinic.id} className="p-3 w-full sm:w-1/2 lg:w-1/3">
                  <div className="border border-solid p-5 shadow-lg h-[250px] flex flex-col justify-center items-center relative cursor-pointer hover:shadow-xl transition-shadow">
                    {/* Status Badge */}
                    <div className="absolute top-1 left-1">
                      <StatusBadge isOpen={clinic.isOpen} />
                    </div>

                    {/* Logo */}
                    <img
                      src={clinic.logo}
                      alt={clinic.name}
                      className="max-w-[100%] max-h-[100%]"
                    />
                  </div>
                  <div className="py-3">
                    <h4 className="text-[14px] font-normal tracking-[0.39px] text-[#898e9f]">
                      {clinic.city}
                    </h4>
                    <h1 className="text-[20px] font-[600] tracking-[0.56px] text-[#818798]">
                      {clinic.name}
                    </h1>
                  </div>
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
            title="Hospital Location"
            className="min-h-[400px] lg:min-h-full"
          />
        </div>
      </div>

    </div>
  );
};
