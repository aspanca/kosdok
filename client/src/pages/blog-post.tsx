import { Link, useParams } from "@tanstack/react-router";
import { SocialShare } from "../components/social-share/social-share";

// Sample data
const relatedArticles = [
  {
    id: 2,
    title: "Si ta largoni dhimbjen e kokës në 5 minuta pa përdorur ilaçe",
  },
  {
    id: 3,
    title: "Si t'i dallojmë 10 llojet e dhimbjeve të barkut dhe çfarë të bëjmë për t'i qetësuar",
  },
  {
    id: 4,
    title: "Përse Dhemb Zemra Dhe Kur Duhet Të Shqetësoheni",
  },
];

const recommendedClinics = [
  {
    id: 1,
    name: "Dental Clinic BioDENT",
    location: "Prishtina",
    status: "Hapur",
    logo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Trias Dent",
    location: "Prishtina",
    status: "Hapur",
    logo: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&h=200&fit=crop",
  },
];

export const BlogPostPage = () => {
  const { postId } = useParams({ from: "/blog/$postId" });
  void postId; // Used for future dynamic content

  return (
    <div className="max-w-[1920px] mx-auto px-3 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Featured Image */}
        <img
          src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop"
          alt="Blog post"
          className="w-full h-64 md:h-80 object-cover rounded-lg mb-6"
        />

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>20 March 2017 09k1</span>
          <SocialShare
              platforms={["facebook", "twitter", "linkedin", "google"]}
              size="sm"
              showLabel
              labelText="Shpërndaje"
            />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">
          Tetë mënyra efektive për të ndaluar dhimbjen e dhëmbit në kushte shtëpie
        </h1>

        {/* Content */}
        <div className="prose prose-gray max-w-none text-gray-600 text-sm leading-relaxed space-y-6">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>

          <div>
            <h3 className="text-base font-semibold text-gray-700 italic mb-2">
              Why do we use it?
            </h3>
            <p>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for 'lorem ipsum' will
              uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on
              purpose (injected humour and the like).
            </p>
            <p className="mt-3">
              Letraset sheets containing Lorem Ipsum passages, and more recently
              with desktop publishing software like Aldus PageMaker including
              versions of Lorem Ipsum.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-700 italic mb-2">
              Why do we use it?
            </h3>
            <p>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for 'lorem ipsum' will
              uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on
              purpose (injected humour and the like).
            </p>
          </div>
        </div>

        {/* Recommended Clinics */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Klinikat stomatologjike te rekomanduara
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {recommendedClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-green-600">{clinic.status}</span>
                </div>
                <div className="flex justify-center mb-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-primary"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{clinic.location}</p>
                <p className="text-sm font-semibold text-gray-800">
                  {clinic.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Te ngjajshme</h2>
          <div className="space-y-3">
            {relatedArticles.map((article) => (
              <Link
                key={article.id}
                to="/blog/$postId"
                params={{ postId: String(article.id) }}
                className="flex items-start gap-3 group"
              >
                <div className="w-1 h-full min-h-[20px] bg-primary rounded-full"></div>
                <p className="text-primary text-sm group-hover:underline">
                  {article.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
