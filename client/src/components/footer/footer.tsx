import { Link } from "@tanstack/react-router";
import { ReactComponent as LogoSvg } from "./assets/logo.svg";
import { SocialShare } from "../social-share/social-share";

export const Footer = () => {
  return (
    <footer className="bg-[#f8f8f8]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo & Description - Full width on mobile */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link to="/">
              <LogoSvg className="h-8 w-auto" />
            </Link>
            <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed max-w-md">
              Platforma më e madhe për gjetjen e mjekëve, klinikave dhe
              spitaleve në Kosovë. Gjeni shërbimin mjekësor që ju nevojitet.
            </p>
            <div className="mt-6">
              <SocialShare
                platforms={["facebook", "twitter", "linkedin"]}
                size="lg"
              />
            </div>
          </div>

          {/* Vizito */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-4">
              Vizito
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/hospital"
                  className="text-sm sm:text-base text-gray-500 hover:text-primary transition-colors"
                >
                  Spitalet
                </Link>
              </li>
              <li>
                <Link
                  to="/results"
                  className="text-sm sm:text-base text-gray-500 hover:text-primary transition-colors"
                >
                  Klinikat
                </Link>
              </li>
              <li>
                <Link
                  to="/doctor"
                  className="text-sm sm:text-base text-gray-500 hover:text-primary transition-colors"
                >
                  Doktoret
                </Link>
              </li>
              <li>
                <Link
                  to="/results"
                  className="text-sm sm:text-base text-gray-500 hover:text-primary transition-colors"
                >
                  Barnatoret
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-sm sm:text-base text-gray-500 hover:text-primary transition-colors"
                >
                  Kerko Biznese
                </Link>
              </li>
              <li>
                <Link
                  to="/donate-blood"
                  className="text-sm sm:text-base text-gray-500 hover:text-primary transition-colors"
                >
                  Dhuro Gjak
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm sm:text-base text-gray-500 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm sm:text-base text-gray-500 hover:text-primary transition-colors"
                >
                  Kontakti
                </Link>
              </li>
            </ul>
          </div>

          {/* Na ndjekni - Hidden on smallest mobile, shown on sm+ */}
          <div className="hidden sm:block">
            <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-4">
              Na ndjekni
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-gray-500 hover:text-primary transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-gray-500 hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-gray-500 hover:text-primary transition-colors"
                >
                  Linkedin
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500">
            <p className="text-center sm:text-left">
              © 2024 Kosdok. Fuqizuar nga Avante Group SH.P.K
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/privacy-policy"
                className="hover:text-primary transition-colors"
              >
                Termet dhe kushtet
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/privacy-policy"
                className="hover:text-primary transition-colors"
              >
                Politika e Privatesise
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
