import { Link } from "@tanstack/react-router";
import { SocialShare } from "../components/social-share/social-share";

const similarEvents = [
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
];

export const BloodEvent = () => {
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

      {/* Decorative blood drops - bottom right */}
      <div className="absolute bottom-32 right-8 md:bottom-40 md:right-12 z-10">
        <div className="relative">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f94144] rounded-full"></div>
          <div className="absolute -bottom-2 -left-3 md:-bottom-3 md:-left-4 w-5 h-5 md:w-7 md:h-7 bg-[#f94144] rounded-full"></div>
          <div className="absolute -bottom-4 left-2 md:-bottom-5 md:left-3 w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-[#f94144] rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {/* Event Image */}
          <div className="h-48 md:h-64 bg-gray-50 flex items-center justify-center p-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/1200px-Flag_of_the_Red_Cross.svg.png"
              alt="Red Cross"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
            <div className="flex items-center gap-6">
              {/* Status */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#7ed321] rounded-full"></div>
                <span className="text-sm text-[#5e6478]">Duke u zhvilluar</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="text-sm text-primary">Prishtine</span>
              </div>
            </div>

            {/* Share */}
            <SocialShare
              platforms={["facebook", "twitter", "linkedin", "google"]}
              size="md"
              showLabel
              labelText="Shperndaje"
            />
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold text-[#494e60] mb-6">
              Eventi per dhurimin e gjakut ne qender te Prishtines ka filluar.
            </h1>

            {/* Description */}
            <div className="prose prose-sm max-w-none text-[#5e6478]">
              <p className="mb-4 text-sm leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>

              <h3 className="text-base font-semibold text-[#494e60] mt-6 mb-3">
                Why do we use it?
              </h3>
              <p className="mb-4 text-sm leading-relaxed">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters, as opposed to using 'Content
                here, content here', making it look like readable English. Many
                desktop publishing packages and web page editors now use Lorem
                Ipsum as their default model text, and a search for 'lorem
                ipsum' will uncover many web sites still in their infancy.
                Various versions have evolved over the years, sometimes by
                accident, sometimes on purpose (injected humour and the like).
              </p>
              <p className="mb-4 text-sm leading-relaxed">
                Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum.
              </p>

              <h3 className="text-base font-semibold text-[#494e60] mt-6 mb-3">
                Why do we use it?
              </h3>
              <p className="mb-4 text-sm leading-relaxed">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters, as opposed to using 'Content
                here, content here', making it look like readable English. Many
                desktop publishing packages and web page editors now use Lorem
                Ipsum as their default model text, and a search for 'lorem
                ipsum' will uncover many web sites still in their infancy.
                Various versions have evolved over the years, sometimes by
                accident, sometimes on purpose (injected humour and the like).
              </p>
            </div>
          </div>
        </div>

        {/* Similar Events Section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#494e60] mb-6">
            Evente te ngjajshme
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarEvents.map((event) => (
              <Link
                key={event.id}
                to="/donate-blood/$eventId"
                params={{ eventId: String(event.id) }}
                className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
              >
                {/* Image */}
                <div className="h-32 bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-[#9fa4b4] mb-1">{event.city}</p>
                  <h3 className="text-base font-semibold text-[#494e60] mb-2 leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-xs text-[#757b8c] mb-2 line-clamp-2">
                    {event.description}
                  </p>
                  <p className="text-xs text-[#9fa4b4]">{event.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
