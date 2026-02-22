import { Link } from "@tanstack/react-router";

export const ContactDisclaimer = () => {
  return (
    <div className="w-full bg-primary">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white text-base sm:text-lg md:text-xl font-medium text-center sm:text-left">
          Behu pjese e <span className="font-bold">Kosdok</span> dhe rriti te
          ardhurat e biznesit...
        </p>
        <Link
          to="/contact"
          className="px-6 py-2.5 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-primary transition-all duration-200 font-medium whitespace-nowrap"
        >
          Na kontaktoni
        </Link>
      </div>
    </div>
  );
};
