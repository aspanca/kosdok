import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/auth-context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export const ProfilePage = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "+383 49 123 456",
    dateOfBirth: "15/03/1990",
    gender: "Mashkull",
    address: "Rruga Agim Ramadani, Nr. 42",
    city: "Prishtinë",
  });

  // Redirect if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4">
        <div className="bg-white border border-[#dedede] p-8 max-w-md w-full text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-[#9fa4b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h1 className="text-[22px] font-[600] text-[#494e60] mb-2">Kërkohet kyçja</h1>
          <p className="text-[14px] text-[#9fa4b4] mb-6">Duhet të jeni të kyçur për të parë profilin tuaj.</p>
          <Link to="/signin" className="inline-flex items-center justify-center h-12 px-8 bg-primary hover:bg-primary/90 text-white text-[14px] font-[600]">
            Kyçu
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const sidebarLinks = [
    { to: "/profile", label: "Profili im", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", active: true },
    { to: "/appointments", label: "Takimet e mia", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", active: false },
    { to: "/my-reviews", label: "Vlerësimet e mia", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", active: false },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-[600] tracking-[0.72px] text-[#494e60]">Llogaria ime</h1>
          <p className="text-[14px] text-[#9fa4b4] mt-1">Menaxhoni të dhënat dhe preferencat tuaja</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-[#dedede] overflow-hidden">
              {/* User Info */}
              <div className="p-5 border-b border-[#dedede]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-[#6AA8FF] flex items-center justify-center text-white text-[18px] font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-[600] text-[#494e60]">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-[13px] text-[#9fa4b4]">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 text-[14px] font-[500] transition-colors ${
                      link.active
                        ? "bg-primary/5 text-primary"
                        : "text-[#494e60] hover:bg-[#f8f8f8]"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                    </svg>
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-[500] text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Dil nga llogaria
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white border border-[#dedede]">
              {/* Section Header */}
              <div className="px-6 py-5 border-b border-[#dedede] flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-[600] text-[#494e60]">Informacionet personale</h2>
                  <p className="text-[13px] text-[#9fa4b4] mt-1">Përditësoni të dhënat tuaja personale</p>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`h-10 px-5 text-[13px] font-[600] ${
                    isEditing
                      ? "bg-[#f8f8f8] border border-[#dedede] text-[#494e60] hover:bg-[#f0f0f0]"
                      : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                >
                  {isEditing ? "Anulo" : "Ndrysho"}
                </Button>
              </div>

              {/* Form */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-[600] text-[#494e60] mb-2">Emri</label>
                    {isEditing ? (
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="h-11 border-[#dedede]"
                      />
                    ) : (
                      <p className="text-[15px] text-[#494e60] py-2">{formData.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-[600] text-[#494e60] mb-2">Mbiemri</label>
                    {isEditing ? (
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="h-11 border-[#dedede]"
                      />
                    ) : (
                      <p className="text-[15px] text-[#494e60] py-2">{formData.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-[600] text-[#494e60] mb-2">Email</label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-11 border-[#dedede]"
                      />
                    ) : (
                      <p className="text-[15px] text-[#494e60] py-2">{formData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-[600] text-[#494e60] mb-2">Telefoni</label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-11 border-[#dedede]"
                      />
                    ) : (
                      <p className="text-[15px] text-[#494e60] py-2">{formData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-[600] text-[#494e60] mb-2">Datëlindja</label>
                    {isEditing ? (
                      <Input
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="h-11 border-[#dedede]"
                      />
                    ) : (
                      <p className="text-[15px] text-[#494e60] py-2">{formData.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-[600] text-[#494e60] mb-2">Gjinia</label>
                    {isEditing ? (
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full h-11 px-3 border border-[#dedede] text-[14px] text-[#494e60] focus:outline-none focus:border-primary"
                      >
                        <option value="Mashkull">Mashkull</option>
                        <option value="Femër">Femër</option>
                      </select>
                    ) : (
                      <p className="text-[15px] text-[#494e60] py-2">{formData.gender}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-[600] text-[#494e60] mb-2">Adresa</label>
                    {isEditing ? (
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="h-11 border-[#dedede]"
                      />
                    ) : (
                      <p className="text-[15px] text-[#494e60] py-2">{formData.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-[600] text-[#494e60] mb-2">Qyteti</label>
                    {isEditing ? (
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="h-11 border-[#dedede]"
                      />
                    ) : (
                      <p className="text-[15px] text-[#494e60] py-2">{formData.city}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 pt-6 border-t border-[#dedede] flex gap-3">
                    <Button className="h-11 px-6 bg-primary hover:bg-primary/90 text-white text-[14px] font-[600]">
                      Ruaj ndryshimet
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      className="h-11 px-6 bg-white border border-[#dedede] text-[#494e60] text-[14px] font-[600] hover:bg-[#f8f8f8]"
                    >
                      Anulo
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white border border-[#dedede] mt-6">
              <div className="px-6 py-5 border-b border-[#dedede]">
                <h2 className="text-[18px] font-[600] text-[#494e60]">Siguria</h2>
                <p className="text-[13px] text-[#9fa4b4] mt-1">Ndryshoni fjalëkalimin tuaj</p>
              </div>
              <div className="p-6">
                <Button className="h-11 px-6 bg-[#f8f8f8] border border-[#dedede] text-[#494e60] text-[14px] font-[600] hover:bg-[#f0f0f0]">
                  Ndrysho fjalëkalimin
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
