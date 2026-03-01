import { Link } from "@tanstack/react-router";
import { ReactComponent as BloodSvg } from "./assets/blood-drop.svg";
import { ReactComponent as DoctorSvg } from "./assets/doctor.svg";
import { ReactComponent as HospitalSvg } from "./assets/hospital.svg";
import { ReactComponent as ClinicsSvg } from "./assets/clinics.svg";
import { ReactComponent as LabSvg } from "./assets/lab.svg";
import { ReactComponent as MedicationSvg } from "./assets/medication.svg";

export const HomepageCategories = () => {
  const categories = [
    { icon: <HospitalSvg className="w-12 h-12 sm:w-14 sm:h-14" />, title: "Spitalet", to: "/hospital" },
    { icon: <ClinicsSvg className="w-12 h-12 sm:w-14 sm:h-14" />, title: "Klinikat", to: "/results" },
    { icon: <DoctorSvg className="w-12 h-12 sm:w-14 sm:h-14" />, title: "Doktoret", to: "/doctor" },
    { icon: <LabSvg className="w-12 h-12 sm:w-14 sm:h-14" />, title: "Laboratorët", to: "/results" },
    { icon: <MedicationSvg className="w-12 h-12 sm:w-14 sm:h-14" />, title: "Barnatoret", to: "/results" },
    { icon: <BloodSvg className="w-12 h-12 sm:w-14 sm:h-14" />, title: "Dhuro Gjak", to: "/donate-blood" },
  ];

  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#242936] mb-6">
        Ose Kerko sipas kategorive
      </h2>
      
      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-4 md:overflow-visible md:pb-0 scrollbar-hide">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={category.to}
            className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-auto snap-start"
          >
            <div className="group bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center cursor-pointer">
              <div className="text-gray-400 group-hover:text-primary transition-colors duration-300">
                {category.icon}
              </div>
              <p className="mt-4 text-sm sm:text-base md:text-lg font-semibold text-center text-gray-600 group-hover:text-primary transition-colors duration-300">
                {category.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
