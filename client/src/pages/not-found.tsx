import { Link } from "@tanstack/react-router";

export const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Road Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
          transform: 'scaleY(-1)',
        }}
      />
      
      {/* Dark gradient overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(to bottom, white 0%, white 40%, transparent 60%, rgba(30,30,40,0.4) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* 404 Display */}
        <div className="flex items-center justify-center mb-6">
          {/* 4 */}
          <span className="text-[180px] md:text-[220px] font-bold text-[#494e60] leading-none">
            4
          </span>
          
          {/* 0 as blue circle */}
          <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full border-[20px] md:border-[28px] border-primary mx-2 md:mx-4"></div>
          
          {/* 4 */}
          <span className="text-[180px] md:text-[220px] font-bold text-[#494e60] leading-none">
            4
          </span>
        </div>

        {/* Message */}
        <p className="text-lg text-[#5e6478] mb-6">
          Kjo faqe nuk egziston.
        </p>

        {/* Back Button */}
        <Link
          to="/"
          className="px-8 py-3 text-[16px] font-medium text-[#494e60] bg-white border border-gray-200 rounded hover:border-primary hover:text-primary transition-colors shadow-sm"
        >
          Kthehu ne kryefaqe
        </Link>
      </div>
    </div>
  );
};
