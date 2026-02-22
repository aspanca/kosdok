import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SocialShare } from "../components/social-share/social-share";

// Placeholder images - in real app these would come from an API
const blogPosts = [
  {
    id: 1,
    title: "Tetë mënyra efektive për të ndaluar dhimbjen e dhëmbit në kushte shtëpie",
    date: "20 March 2017",
    views: "09k1",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Si ta largoni dhimbjen e kokës në 5 minuta pa përdorur ilaçe",
    date: "20 March 2017",
    views: "09k1",
    image: "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Si t'i dallojmë 10 llojet e dhimbjeve të barkut dhe çfarë të bëjmë për t'i qetësuar",
    date: "20 March 2017",
    views: "09k1",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    title: "Përse Dhemb Zemra Dhe Kur Duhet Të Shqetësoheni",
    date: "20 March 2017",
    views: "09k1",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&h=250&fit=crop",
  },
  {
    id: 5,
    title: "Përse Dhemb Zemra Dhe Kur Duhet Të Shqetësoheni",
    date: "20 March 2017",
    views: "09k1",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=250&fit=crop",
  },
];

export const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-[#e8f4fc] py-10">
        <div className="max-w-[1920px] mx-auto px-3 text-center">
          <div className="flex justify-center mb-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4h16v16H4V4z"
                stroke="#f59e0b"
                strokeWidth="2"
                fill="none"
              />
              <path d="M7 8h10M7 12h10M7 16h6" stroke="#3b82f6" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Blogu - Lajme</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-3 py-10">
        <div className="max-w-xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Kërko këtu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-200 rounded focus:outline-none focus:border-primary"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Blog Posts */}
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to="/blog/$postId"
                params={{ postId: String(post.id) }}
                className="block group"
              >
                <article className="border-b border-gray-200 pb-6">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>
                      {post.date} {post.views}
                    </span>
                    <SocialShare
                      platforms={["facebook", "twitter", "linkedin", "google"]}
                      size="xs"
                      showLabel
                      labelText="Shpërndaje"
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-primary group-hover:underline">
                    {post.title}
                  </h2>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-10">
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary">
              &lt;
            </button>
            {[1, 2, 3, 4, 5, 6].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
