import { useState } from "react";
import { SocialShare } from "../components/social-share/social-share";

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="max-w-[1920px] mx-auto px-3 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Form */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Na kontaktoni
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Emri dhe mbiemri"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
              />
              <textarea
                placeholder="Mesazhi"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm resize-none"
              />
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded hover:bg-primary/90 transition-colors font-medium"
              >
                Dergo
              </button>
            </form>

            {/* Contact Info */}
            <div className="flex items-center gap-4 mt-8 text-sm text-gray-500">
              <span>kosdokinfo@gmail.com</span>
              <span className="text-gray-300">|</span>
              <span>+383 45 123 456</span>
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="flex justify-center items-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 450 380"
              className="w-full max-w-md"
            >
              {/* Floating square top-left */}
              <rect x="95" y="55" width="14" height="14" rx="2" fill="none" stroke="#cbd5e0" strokeWidth="2" transform="rotate(-15 102 62)" />
              
              {/* Floating square bottom-right */}
              <rect x="390" y="270" width="12" height="12" rx="2" fill="none" stroke="#cbd5e0" strokeWidth="2" transform="rotate(10 396 276)" />
              
              {/* Plant stem - curved S shape */}
              <path d="M65 360 Q55 320 70 280 Q85 240 60 200 Q45 170 65 130" stroke="#2d3748" strokeWidth="2.5" fill="none" />
              
              {/* Plant leaves - alternating blue and dark */}
              <ellipse cx="48" cy="145" rx="18" ry="9" fill="#2d3748" transform="rotate(-50 48 145)" />
              <ellipse cx="82" cy="165" rx="16" ry="8" fill="#4299e1" transform="rotate(40 82 165)" />
              <ellipse cx="50" cy="200" rx="17" ry="8" fill="#4299e1" transform="rotate(-45 50 200)" />
              <ellipse cx="85" cy="225" rx="15" ry="7" fill="#2d3748" transform="rotate(50 85 225)" />
              <ellipse cx="55" cy="265" rx="18" ry="8" fill="#2d3748" transform="rotate(-40 55 265)" />
              <ellipse cx="88" cy="290" rx="14" ry="7" fill="#4299e1" transform="rotate(45 88 290)" />
              
              {/* Plant pot */}
              <rect x="50" y="355" width="35" height="25" rx="3" fill="#e2e8f0" stroke="#cbd5e0" strokeWidth="1" />
              
              {/* Small circles near plant */}
              <circle cx="35" y="320" r="8" fill="#2d3748" />
              <circle cx="50" y="335" r="5" fill="#2d3748" />
              
              {/* Dark envelope (back) */}
              <g transform="translate(100, 310)">
                <rect x="0" y="0" width="75" height="50" rx="4" fill="#2d3748" />
                <path d="M0 8 L37.5 35 L75 8" fill="#1a202c" />
              </g>
              
              {/* Blue envelope (front) */}
              <g transform="translate(135, 325)">
                <rect x="0" y="0" width="60" height="40" rx="3" fill="#4299e1" />
                <path d="M0 6 L30 28 L60 6" fill="#3182ce" />
                <rect x="40" y="15" width="14" height="8" rx="2" fill="#2d3748" />
              </g>
              
              {/* Person - Head */}
              <ellipse cx="250" cy="85" rx="32" ry="35" fill="#fecaca" />
              
              {/* Person - Hair */}
              <path d="M222 70 Q225 45 250 40 Q275 45 280 65 Q285 50 278 42 Q250 25 225 48 Q218 58 222 70" fill="#1a202c" />
              <path d="M275 55 Q285 50 282 70" fill="#1a202c" />
              
              {/* Person - Neck */}
              <rect x="240" y="115" width="20" height="15" fill="#fecaca" />
              
              {/* Person - Body/Sweater */}
              <path d="M210 130 Q205 150 200 220 L200 290 L300 290 L300 220 Q295 150 290 130 Q270 120 250 120 Q230 120 210 130" fill="#d4d4dc" />
              
              {/* Person - Left arm (hanging down) */}
              <path d="M210 135 Q185 160 175 220 Q170 260 175 300" stroke="#d4d4dc" strokeWidth="28" strokeLinecap="round" fill="none" />
              <ellipse cx="175" cy="305" rx="14" ry="12" fill="#fecaca" />
              
              {/* Person - Right arm (holding box) */}
              <path d="M290 140 Q320 165 345 210 Q355 240 360 260" stroke="#d4d4dc" strokeWidth="26" strokeLinecap="round" fill="none" />
              
              {/* Box being held */}
              <g transform="translate(320, 170)">
                {/* Box back */}
                <path d="M0 40 L0 95 L90 95 L90 40 L75 25 L15 25 Z" fill="#2d3748" />
                {/* Blue label on box */}
                <rect x="8" y="55" width="18" height="12" rx="2" fill="#4299e1" />
                
                {/* Document sticking out */}
                <g transform="rotate(8 45 30)">
                  <rect x="15" y="-15" width="55" height="75" rx="3" fill="white" />
                  <line x1="25" y1="5" x2="60" y2="5" stroke="#e5e7eb" strokeWidth="3" />
                  <line x1="25" y1="18" x2="55" y2="18" stroke="#e5e7eb" strokeWidth="3" />
                  <line x1="25" y1="31" x2="60" y2="31" stroke="#e5e7eb" strokeWidth="3" />
                  <line x1="25" y1="44" x2="50" y2="44" stroke="#e5e7eb" strokeWidth="3" />
                  {/* Blue circle on document */}
                  <circle cx="55" cy="50" r="8" fill="#4299e1" opacity="0.3" />
                </g>
                
                {/* Location pin */}
                <g transform="translate(60, -35)">
                  <path d="M18 0 C32 0 40 12 40 26 C40 42 18 60 18 60 C18 60 -4 42 -4 26 C-4 12 4 0 18 0" fill="#4299e1" />
                  <ellipse cx="18" cy="22" rx="10" ry="10" fill="white" />
                </g>
              </g>
              
              {/* Hand on box */}
              <ellipse cx="365" cy="268" rx="12" ry="10" fill="#fecaca" />
              
              {/* Person - Pants */}
              <path d="M205 290 L195 375 L230 375 L250 310 L270 375 L305 375 L295 290 Z" fill="#1a202c" />
              
              {/* Person - Shoes */}
              <ellipse cx="212" cy="378" rx="22" ry="8" fill="#1a202c" />
              <ellipse cx="288" cy="378" rx="22" ry="8" fill="#1a202c" />
            </svg>
          </div>
        </div>

        {/* Social Icons */}
        <SocialShare
          platforms={["facebook", "twitter", "linkedin", "google"]}
          size="lg"
          className="justify-end mt-8"
        />
      </div>
    </div>
  );
};
