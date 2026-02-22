import { Link } from "@tanstack/react-router";

const bloodEvents = [
  {
    id: 1,
    city: "Prishtina",
    title: "Dhuroni gjak, shpetoni jete!",
    description:
      "Filloi dhurimi i gjakut ne sheshin e prishtines nga organizata kryqi i kuq.",
    date: "11/05/2019",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/1200px-Flag_of_the_Red_Cross.svg.png",
  },
  {
    id: 2,
    city: "Vushtrri",
    title: "Transfuzioni i Gjakut",
    description:
      "Faqja zyrtare e Qendrës Kombëtare të Kosovës për Transfuzionin e Gjakut...",
    date: "11/05/2019",
    image:
      "https://img.freepik.com/free-vector/world-blood-donor-day-june-14th-poster-design_1017-23366.jpg",
  },
  {
    id: 3,
    city: "Gjakove",
    title: "Dhuroni gjak, shpetoni jete!",
    description:
      "Filloi dhurimi i gjakut ne sheshin e prishtines nga organizata kryqi i kuq.",
    date: "11/05/2019",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/1200px-Flag_of_the_Red_Cross.svg.png",
  },
  {
    id: 4,
    city: "Peje",
    title: "Dhuroni gjak, shpetoni jete!",
    description:
      "Filloi dhurimi i gjakut ne sheshin e prishtines nga organizata kryqi i kuq.",
    date: "11/05/2019",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/1200px-Flag_of_the_Red_Cross.svg.png",
  },
];

export const DonateBlood = () => {
  return (
    <div className="max-w-[1920px] mx-auto relative overflow-hidden">
      {/* Decorative blood drops - top left */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10">
        <div className="relative">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f94144] rounded-full"></div>
          <div className="absolute -bottom-2 -right-3 md:-bottom-3 md:-right-4 w-5 h-5 md:w-7 md:h-7 bg-[#f94144] rounded-full"></div>
          <div className="absolute -bottom-4 right-2 md:-bottom-5 md:right-3 w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-[#f94144] rounded-full"></div>
        </div>
      </div>

      {/* Decorative blood drops - bottom right (above CTA banner) */}
      <div className="absolute bottom-32 right-8 md:bottom-40 md:right-12 z-10">
        <div className="relative">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f94144] rounded-full"></div>
          <div className="absolute -bottom-2 -left-3 md:-bottom-3 md:-left-4 w-5 h-5 md:w-7 md:h-7 bg-[#f94144] rounded-full"></div>
          <div className="absolute -bottom-4 left-2 md:-bottom-5 md:left-3 w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-[#f94144] rounded-full"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">

        {/* Content */}
        <div className="text-center max-w-3xl mx-auto relative z-10">
          {/* Blood bag icon */}
          <div className="flex justify-center mb-6">
            <svg
              className="w-14 h-14 md:w-16 md:h-16"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Blood bag body */}
              <rect x="16" y="20" width="32" height="40" rx="4" fill="#8B1538" />
              {/* Blood bag top */}
              <rect x="20" y="8" width="24" height="14" rx="2" fill="#8B1538" />
              {/* Tube */}
              <rect x="30" y="4" width="4" height="6" fill="#8B1538" />
              {/* Cross */}
              <rect x="28" y="32" width="8" height="20" rx="1" fill="white" />
              <rect x="22" y="38" width="20" height="8" rx="1" fill="white" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-[32px] md:text-[42px] font-bold tracking-wide text-[#494e60] mb-4">
            Dhuro gjak, shpëto jet!
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-[#757b8c] leading-relaxed max-w-2xl mx-auto">
            is simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry's standard dummy text ever since the
            1500s, when an unknown printer took a galley of type and scrambled
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bloodEvents.map((event) => (
              <Link
                key={event.id}
                to="/donate-blood/$eventId"
                params={{ eventId: String(event.id) }}
                className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
              >
                {/* Image */}
                <div className="h-40 bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* City */}
                  <p className="text-sm text-[#9fa4b4] mb-2">{event.city}</p>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-[#494e60] mb-2 leading-tight">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#757b8c] mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Date */}
                  <p className="text-sm text-[#9fa4b4]">{event.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
