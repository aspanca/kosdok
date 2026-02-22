import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/auth-context";
import { Button } from "../components/ui/button";

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    entityName: "Dr. Alban Gashi",
    entityType: "doctor",
    specialty: "Dermatolog",
    rating: 5,
    date: "15 Janar 2026",
    comment: "Shërbim i shkëlqyer! Mjeku ishte shumë profesional dhe i kujdesshëm. E rekomandoj fuqimisht për të gjithë.",
    image: "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg",
    helpful: 12,
  },
  {
    id: "2",
    entityName: "Spitali Amerikan",
    entityType: "hospital",
    specialty: "Spital",
    rating: 4,
    date: "10 Janar 2026",
    comment: "Eksperiencë shumë e mirë. Koha e pritjes ishte e shkurtër dhe stafi ishte miqësor. Do të kthehem përsëri.",
    image: "/assets/spitali-amerikan.png",
    helpful: 8,
  },
  {
    id: "3",
    entityName: "Dr. Leonora Berisha",
    entityType: "doctor",
    specialty: "Kardiolog",
    rating: 5,
    date: "5 Dhjetor 2025",
    comment: "Trajtim i jashtëzakonshëm! Jam shumë i kënaqur me rezultatet. Faleminderit për kujdesin e shkëlqyer.",
    image: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
    helpful: 15,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill={rating >= star ? "#FFB800" : "#E0E0E0"}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export const MyReviewsPage = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4">
        <div className="bg-white border border-[#dedede] p-8 max-w-md w-full text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-[#9fa4b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h1 className="text-[22px] font-[600] text-[#494e60] mb-2">Kërkohet kyçja</h1>
          <p className="text-[14px] text-[#9fa4b4] mb-6">Duhet të jeni të kyçur për të parë vlerësimet tuaja.</p>
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
    { to: "/appointments", label: "Takimet e mia", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", active: false },
    { to: "/my-reviews", label: "Vlerësimet e mia", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", active: true },
  ];

  // Stats
  const totalReviews = mockReviews.length;
  const avgRating = mockReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
  const totalHelpful = mockReviews.reduce((acc, r) => acc + r.helpful, 0);

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
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-[#dedede] p-5 text-center">
                <div className="text-[28px] font-[600] text-[#494e60]">{totalReviews}</div>
                <div className="text-[13px] text-[#9fa4b4]">Vlerësime</div>
              </div>
              <div className="bg-white border border-[#dedede] p-5 text-center">
                <div className="text-[28px] font-[600] text-[#FFB800]">{avgRating.toFixed(1)}</div>
                <div className="text-[13px] text-[#9fa4b4]">Mesatarja</div>
              </div>
              <div className="bg-white border border-[#dedede] p-5 text-center">
                <div className="text-[28px] font-[600] text-[#7ED321]">{totalHelpful}</div>
                <div className="text-[13px] text-[#9fa4b4]">Të dobishme</div>
              </div>
            </div>

            <div className="bg-white border border-[#dedede]">
              {/* Section Header */}
              <div className="px-6 py-5 border-b border-[#dedede] flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-[600] text-[#494e60]">Vlerësimet e mia</h2>
                  <p className="text-[13px] text-[#9fa4b4] mt-1">Të gjitha vlerësimet që keni lënë</p>
                </div>
              </div>

              {/* Reviews List */}
              <div className="divide-y divide-[#dedede]">
                {mockReviews.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-[#dedede]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p className="text-[15px] text-[#9fa4b4]">Nuk keni lënë asnjë vlerësim ende</p>
                    <Link to="/" className="inline-flex items-center justify-center mt-4 h-10 px-6 bg-primary hover:bg-primary/90 text-white text-[13px] font-[600]">
                      Gjej mjek
                    </Link>
                  </div>
                ) : (
                  mockReviews.map((review) => (
                    <div key={review.id} className="p-5 hover:bg-[#fafafa] transition-colors">
                      <div className="flex gap-4">
                        {/* Entity Image */}
                        <div className="w-16 h-16 flex-shrink-0 bg-[#f8f8f8] overflow-hidden">
                          <img
                            src={review.image}
                            alt={review.entityName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/64";
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="text-[15px] font-[600] text-[#494e60]">{review.entityName}</h3>
                              <p className="text-[13px] text-[#9fa4b4]">{review.specialty}</p>
                            </div>
                            <div className="text-right">
                              <StarRating rating={review.rating} />
                              <p className="text-[12px] text-[#9fa4b4] mt-1">{review.date}</p>
                            </div>
                          </div>

                          <p className="text-[14px] text-[#5e6478] leading-relaxed mb-3">
                            {review.comment}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[13px] text-[#9fa4b4]">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              {review.helpful} e gjetën të dobishme
                            </span>

                            <div className="flex gap-2">
                              <Button className="h-8 px-3 bg-white border border-[#dedede] text-[#494e60] text-[12px] font-[600] hover:bg-[#f8f8f8]">
                                Ndrysho
                              </Button>
                              <Button className="h-8 px-3 bg-white border border-red-200 text-red-600 text-[12px] font-[600] hover:bg-red-50">
                                Fshij
                              </Button>
                            </div>
                          </div>
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
