import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/auth-context";
import { Button } from "../components/ui/button";

// Mock appointments data
const mockAppointments = [
  {
    id: "1",
    doctorName: "Dr. Alban Gashi",
    specialty: "Dermatolog",
    clinic: "Spitali Amerikan",
    date: "12 Shkurt 2026",
    time: "10:00",
    status: "upcoming",
    image: "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg",
  },
  {
    id: "2",
    doctorName: "Dr. Leonora Berisha",
    specialty: "Kardiolog",
    clinic: "Vita Hospital",
    date: "18 Shkurt 2026",
    time: "14:30",
    status: "upcoming",
    image: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
  },
  {
    id: "3",
    doctorName: "Dr. Arben Krasniqi",
    specialty: "Ortoped",
    clinic: "Q.D.T. Rezonanca",
    date: "5 Janar 2026",
    time: "09:00",
    status: "completed",
    image: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg",
  },
  {
    id: "4",
    doctorName: "Dr. Fitore Gashi",
    specialty: "Pediatër",
    clinic: "Spitali Amerikan",
    date: "20 Dhjetor 2025",
    time: "11:30",
    status: "completed",
    image: "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg",
  },
  {
    id: "5",
    doctorName: "Dr. Besnik Hoxha",
    specialty: "Neurolog",
    clinic: "Vita Hospital",
    date: "8 Janar 2026",
    time: "15:00",
    status: "cancelled",
    image: "https://img.freepik.com/free-photo/front-view-male-doctor-medical-suit_23-2148453467.jpg",
  },
];

export const AppointmentsPage = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  // Redirect if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4">
        <div className="bg-white border border-[#dedede] p-8 max-w-md w-full text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-[#9fa4b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h1 className="text-[22px] font-[600] text-[#494e60] mb-2">Kërkohet kyçja</h1>
          <p className="text-[14px] text-[#9fa4b4] mb-6">Duhet të jeni të kyçur për të parë takimet tuaja.</p>
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
    { to: "/profile", label: "Profili im", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", active: false },
    { to: "/appointments", label: "Takimet e mia", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", active: true },
    { to: "/my-reviews", label: "Vlerësimet e mia", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", active: false },
  ];

  const filteredAppointments = mockAppointments.filter((apt) => apt.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <span className="px-3 py-1 bg-primary/10 text-primary text-[12px] font-[600]">Në pritje</span>;
      case "completed":
        return <span className="px-3 py-1 bg-[#7ED321]/10 text-[#7ED321] text-[12px] font-[600]">Përfunduar</span>;
      case "cancelled":
        return <span className="px-3 py-1 bg-red-100 text-red-600 text-[12px] font-[600]">Anuluar</span>;
      default:
        return null;
    }
  };

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
              {/* Section Header with Tabs */}
              <div className="px-6 py-5 border-b border-[#dedede]">
                <h2 className="text-[18px] font-[600] text-[#494e60] mb-4">Takimet e mia</h2>
                <div className="flex gap-1 bg-[#f8f8f8] p-1">
                  {[
                    { key: "upcoming", label: "Në pritje", count: mockAppointments.filter((a) => a.status === "upcoming").length },
                    { key: "completed", label: "Përfunduar", count: mockAppointments.filter((a) => a.status === "completed").length },
                    { key: "cancelled", label: "Anuluar", count: mockAppointments.filter((a) => a.status === "cancelled").length },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`flex-1 py-2.5 px-4 text-[13px] font-[600] transition-colors ${
                        activeTab === tab.key
                          ? "bg-white text-[#494e60] shadow-sm"
                          : "text-[#9fa4b4] hover:text-[#494e60]"
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointments List */}
              <div className="divide-y divide-[#dedede]">
                {filteredAppointments.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-[#dedede]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[15px] text-[#9fa4b4]">Nuk keni takime {activeTab === "upcoming" ? "në pritje" : activeTab === "completed" ? "të përfunduara" : "të anuluara"}</p>
                    {activeTab === "upcoming" && (
                      <Link to="/" className="inline-flex items-center justify-center mt-4 h-10 px-6 bg-primary hover:bg-primary/90 text-white text-[13px] font-[600]">
                        Gjej mjek
                      </Link>
                    )}
                  </div>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-5 hover:bg-[#fafafa] transition-colors">
                      <div className="flex gap-4">
                        {/* Doctor Image */}
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                          <img
                            src={appointment.image}
                            alt={appointment.doctorName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="text-[15px] font-[600] text-[#494e60]">{appointment.doctorName}</h3>
                              <p className="text-[13px] text-[#9fa4b4]">{appointment.specialty} • {appointment.clinic}</p>
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>

                          <div className="flex items-center gap-4 text-[13px] text-[#494e60]">
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-[#9fa4b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {appointment.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-[#9fa4b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {appointment.time}
                            </span>
                          </div>

                          {/* Actions */}
                          {appointment.status === "upcoming" && (
                            <div className="flex gap-2 mt-3">
                              <Button className="h-9 px-4 bg-primary hover:bg-primary/90 text-white text-[12px] font-[600]">
                                Konfirmo
                              </Button>
                              <Button className="h-9 px-4 bg-white border border-[#dedede] text-[#494e60] text-[12px] font-[600] hover:bg-[#f8f8f8]">
                                Anulo
                              </Button>
                            </div>
                          )}
                          {appointment.status === "completed" && (
                            <div className="mt-3">
                              <Link to="/doctor" className="text-[13px] font-[600] text-primary hover:underline">
                                Lër vlerësim →
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
