import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ReactComponent as LogoSvg } from "./assets/logo.svg";
import { useAuth, getUserDisplayName, getUserInitials, getUserPicture } from "../../context/auth-context";

export const AppBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  const navLinks = [
    { to: "/", label: "Kerko biznese" },
    { to: "/blog", label: "Blog" },
    { to: "/donate-blood", label: "Dhuro Gjak" },
    { to: "/contact", label: "Kontakti" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <LogoSvg className="h-7 md:h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-[15px] font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-4 flex items-center gap-3">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary to-[#6AA8FF] flex items-center justify-center text-white text-sm font-bold">
                      {user && getUserPicture(user) ? (
                        <img src={getUserPicture(user)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user ? getUserInitials(user) : ""
                      )}
                    </div>
                    <span className="text-[15px] font-medium text-gray-700">
                      {user ? getUserDisplayName(user) : ""}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-700">
                          {user ? getUserDisplayName(user) : ""}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profili im
                        </div>
                      </Link>
                      <Link
                        to="/appointments"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Takimet e mia
                        </div>
                      </Link>
                      <Link
                        to="/my-reviews"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          Vlerësimet e mia
                        </div>
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Dil nga llogaria
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/signin"
                    search={{ mode: "login" }}
                    className="px-4 py-2.5 text-[15px] font-semibold text-primary hover:bg-primary/5 rounded-full transition-all duration-200"
                  >
                    Kyçu
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 text-[15px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                  >
                    Regjistrohu
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-center items-center">
              <span
                className={`w-6 h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-0.5" : "-translate-y-1.5"
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "opacity-0 scale-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-1.5"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 pb-6 pt-2 space-y-1 bg-white border-t border-gray-100">
          {navLinks.map((link, index) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 px-4 space-y-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-[#6AA8FF] flex items-center justify-center text-white text-sm font-bold">
                    {user && getUserPicture(user) ? (
                      <img src={getUserPicture(user)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user ? getUserInitials(user) : ""
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {user ? getUserDisplayName(user) : ""}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-3 px-4 text-left text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Profili im
                </Link>
                <Link
                  to="/appointments"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-3 px-4 text-left text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Takimet e mia
                </Link>
                <Link
                  to="/my-reviews"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-3 px-4 text-left text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Vlerësimet e mia
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full py-3 text-center text-base font-semibold text-red-600 border-2 border-red-200 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Dil nga llogaria
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  search={{ mode: "login" }}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-3 text-center text-base font-semibold text-primary border-2 border-primary hover:bg-primary/5 rounded-xl transition-colors"
                >
                  Kyçu
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-3 text-center text-base font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors shadow-lg shadow-primary/25"
                >
                  Regjistrohu
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
