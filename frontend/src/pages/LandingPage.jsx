import React, { useState , useRef, useEffect} from "react"; 
// Using Lucide icons for social media
import { Linkedin, Instagram, Twitter } from "lucide-react"; 

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay  } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";



// --- MINIMAL MOCK DEFINITIONS FOR RUNNABILITY ---
const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);
const useAuth = () => ({ user: null }); // Mock user to test both login/dashboard states
// Keeping Navbar as a minimal function so the <Navbar /> tag compiles
const Navbar = () => <nav className="h-1 bg-white shadow-md"></nav>; 
// --------------------------------------------------


// --- STATIC DATA --- 
const companyLogos = [ 
  "/logos/tech-solution.png",  
  "/logos/sunsys.jpg",
  "/logos/medilink.png",  
  "/logos/tcs.png",  
  "/logos/infosys.png",  
  "/logos/google.png", 
  "/logos/creo-vibe.png",  
  "/logos/wipro.png", 
  "/logos/hackerrank.png", 
  "/logos/microsoft.png",
  "/logos/ibm.png",
  "/logos/amazon.png",
  "/logos/facebook.png",
]; 

const campusAmbassadors = [
    // Placeholder photos for Campus Ambassadors (Circular, slightly smaller)
   // "logos/1.jpg",
"logos/2.jpg",
"logos/3.jpg",


   // "https://placehold.co/120x120/E8D1FF/333333?text=Amb+B",
   // "https://placehold.co/120x120/D1FFF4/333333?text=Amb+C",
   // "https://placehold.co/120x120/FFE3D1/333333?text=Amb+D",
    //"https://placehold.co/120x120/D1E8FF/333333?text=Amb+E",
    //"https://placehold.co/120x120/FDD1FF/333333?text=Amb+F",
    //"https://placehold.co/120x120/E8D1FF/333333?text=Amb+G",
];

const collegeLogos = [
    "/logos/a.png", 
    "/logos/b.png",
    "/logos/c.png",
    "/logos/d.png",
    "/logos/e.png",
    "/logos/f.jpg",
    "/logos/g.jpg",
    "/logos/h.png",
    "/logos/i.png",
    "/logos/j.png",
    "/logos/k.jpg",
    "/logos/l.png",
    "/logos/m.jpg",
    "/logos/n.png",
    "/logos/o.jpg",
    "/logos/p.png",
    "/logos/q.png",
    "/logos/r.png",
    "/logos/s.png",
    "/logos/t.png",
    "/logos/u.jpg",
    "/logos/v.png",
    "/logos/w.jpg",
];
// ------------------------ 

// Define the static keyframe for scrolling to ensure it's always available.
const staticKeyframe = `
    @keyframes scroll-x-infinite {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
`;

// --- NEW HORIZONTAL CAROUSEL COMPONENT ---// --- UNIVERSAL HORIZONTAL CAROUSEL (Perfect for All Sliders) ---
const HorizontalCarousel = ({ items, itemRenderer, speed = 40, className = "" }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContent = scrollRef.current;
    if (!container || !scrollContent) return;

    // Check if we need scroll-based or transform-based movement
    const contentWider = scrollContent.scrollWidth > container.clientWidth;

    if (contentWider) {
      // --- Continuous transform animation for company/college logos ---
      const totalWidth = scrollContent.scrollWidth;
      let position = 0;
      const step = 0.5; // Adjust for speed
      const animate = () => {
        position -= step;
        if (Math.abs(position) >= totalWidth / 2) position = 0;
        scrollContent.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animate);
      };
      const anim = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(anim);
    } else {
      // --- scrollLeft-based movement (for small number of items like ambassadors) ---
      let scrollPosition = 0;
      const scrollStep = 0.5;
      const animateScroll = () => {
        scrollPosition += scrollStep;
        if (scrollPosition >= scrollContent.scrollWidth - container.clientWidth) {
          scrollPosition = 0;
        }
        scrollContent.scrollLeft = scrollPosition;
        requestAnimationFrame(animateScroll);
      };
      const anim = requestAnimationFrame(animateScroll);
      return () => cancelAnimationFrame(anim);
    }
  }, [items]);

  // Duplicate for transform animation only (to enable infinite motion)
  const doubledItems = [...items, ...items]; //const doubledItems = [...items, ...items];

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className}`}>
      <div
        ref={scrollRef}
        className="flex items-center h-full will-change-transform transition-transform ease-linear"
        style={{ width: "max-content" }}
      >
        {doubledItems.map((item, index) => (
          <div key={index} className="flex-shrink-0 mx-4">
            {itemRenderer(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};





// --- MAIN PAGE ---
const LandingPage = () => { 
  const navigate = useNavigate(); 
  const { user } = useAuth(); 

  // Keeping these handlers minimal for code completeness
  const handleLoginClick = () => { navigate("/login"); }; 
  const handleRegisterClick = () => { navigate("/register"); }; 
  const handleExploreInternshipsClick = () => { navigate("/internships"); }; 
  const handleDashboardClick = () => { navigate("/dashboard"); }; 

  // Renderer for Company Logos (simple image)
  const renderCompanyLogo = (logo, index) => (
      <img
          src={logo}
          alt={`Company ${index}`}
          // Full color and vibrancy maintained
className="h-16 md:h-18 w-auto object-contain opacity-100 transition-opacity duration-300"

          // Added robust onError fallback to prevent broken images if local paths don't work
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/150x60/F87171/ffffff?text=LOGO+${index + 1}`;
          }}
      />
  );
  
  // Renderer for Campus Ambassadors (circular image with name)
  const renderAmbassador = (photo, index) => (
      <div className="flex flex-col items-center">
          <img
              src={photo}
              alt={`Ambassador ${index}`}
              className="w-32 h-32 md:w-42 md:h-58 object-cover border-1 border-teal-100 shadow-l rounded-xl"
          />
          
      </div>
  );
  
  // Renderer for College Logos (simple image, handles mixed aspect ratios via object-contain)
  const renderCollegeLogo = (logo, index) => (
      <img
          src={logo}
          alt={`College ${index}`}
          // Fixed height, auto width, and object-contain ensures all shapes (square/rect) fit perfectly
          className="h-23 md:h-26 w-auto object-contain opacity-100 transition-opacity duration-300"

          // Updated fallback text to match the file name (e.g., A, B, C...)
          onError={(e) => {
            e.target.onerror = null;
            const letter = String.fromCharCode(97 + index).toUpperCase(); // 'a' is 97
            e.target.src = `https://placehold.co/150x60/F87171/ffffff?text=College+${letter}`;
          }}
      />
  );


useEffect(() => {
  const track = document.getElementById("testimonial-track");
  if (!track) return;
  let index = 0;
  const slide = () => {
    index = (index + 1) % 2; // since we have 5 videos → (0→1→0)
    const offset = -index * 100; // 100% shift per slide
    track.style.transform = `translateX(${offset}%)`;
  };
  const interval = setInterval(slide, 4000); // every 4s
  return () => clearInterval(interval);
}, []);

const ReelCard = ({ index, item }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl overflow-hidden shadow-lg bg-black group transition-all duration-300 hover:shadow-xl">
      {/* View on Instagram Button
      <a
        href={item.video}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full hover:bg-orange-600 z-10"
      >
        View on Instagram
      </a>

      {/* Video */}
      <video
        src={item.src}
        className="w-full h-[500px] object-cover cursor-pointer"
        muted
        loop
        playsInline
        onClick={(e) => {
          e.stopPropagation();
          setIsPlaying(!isPlaying);
          if (!isPlaying) e.target.play();
          else e.target.pause();
        }}
      />

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <button
            onClick={() => setIsPlaying(true)}
            className="bg-orange-500 text-white rounded-full p-4 text-lg font-semibold hover:bg-orange-600"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};



  return ( 
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 font-inter relative overflow-x-hidden"> 
       
      <Navbar /> 

      {/* 1. HORIZONTAL SLIDER: Company Logos (Top Peak) */}
      <div className="py-4 border-b border-gray-200 bg-white backdrop-blur-sm">
          <HorizontalCarousel 
              items={companyLogos} 
              itemRenderer={renderCompanyLogo} 
              speed={2} // Faster scroll
              className="h-20" 
          />
      </div>

      {/* Hero Section (Main Content) - REDUCED PADDING */} 
<section className="relative pt-10 pb-4 md:pt-10 md:pb-4 flex items-center justify-center text-center px-4">

        <div className="max-w-4xl mx-auto animate-fade-in"> 
          <h1 className="text-5xl md:text-6xl font-poppins font-extrabold text-gray-800 leading-tight mb-6"> 
            <span className="inline-block">Your Gateway to</span> <br />{" "} 
            <span className="text-teal-600 inline-block"> 
              Dream Internships 
            </span> 
            <div className="h-6"></div> {/* Added spacer */}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto"> 
            Internsaathi connects ambitious students with top companies, 
            offering a seamless platform for internship discovery, application, 
            and talent acquisition. 
          </p> 
        </div> 
      </section>

      {/* 2. STATIC Campus Ambassador Images (Two Photos, Same Styling) 
<section className="py-7  bg-white/70 backdrop-blur-sm border-t border-b border-gray-200">
  <h3 className="text-xl font-poppins font-bold text-center text-gray-700 mb-4">
    Meet Our Campus Ambassadors
  </h3>
  <div className="flex justify-center items-center gap-8 h-50 md:h-58">
    {campusAmbassadors.slice(0, 2).map((photo, index) => (
      <div key={index} className="flex flex-col items-center">
        <img
          src={photo}
          alt={`Ambassador ${index + 1}`}
          className="w-40 h-39 md:w-50 md:h-66 object-cover border-1 border-teal-100 shadow-l rounded-xl"
        />
      </div>
    ))}
  </div>
</section>
*/}

{/* 3. TESTIMONIALS SECTION */}
<section className="py-10 bg-gradient-to-r from-orange-50 to-orange-100 border-t border-gray-200">
  <h3 className="text-2xl md:text-3xl font-poppins font-bold text-center text-gray-800 mb-8">
    Voices That Inspire
  </h3>

  <div className="max-w-6xl mx-auto px-6">
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      slidesPerGroup={1}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      speed={1000}
      autoplay={{ delay: 4500, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 1, slidesPerGroup: 1 },
        768: { slidesPerView: 2, slidesPerGroup: 2 },
        1024: { slidesPerView: 3, slidesPerGroup: 3 },
      }}
      onSwiper={(swiper) => (window.swiperInstance = swiper)}
    >
      {
      [
  {
    src: "https://www.youtube.com/embed/sHi2MgKtr7U?controls=1&modestbranding=1&rel=0",
    title: "IIM Student Experience",
    desc: "See how impactful internships turn learning into leadership and opportunity."
  },
  {
    src: "https://www.youtube.com/embed/5ssoQQ6ypJ4?controls=1&modestbranding=1&rel=0",
    title: "IIM Perspective",
    desc: "Discover how mentorship and real-world projects with us drive growth and confidence."
  },
  {
    src: "https://www.youtube.com/embed/R-Ha7OwBJkk?controls=1&modestbranding=1&rel=0",
    title: "Career Growth",
    desc: "When opportunity meets mentorship, transformation begins."
  },
  {
    src: "https://www.youtube.com/embed/fr4XTXQE0u0?controls=1&modestbranding=1&rel=0",
    title: "IIM Learner Insights",
    desc: "Listen to an IIM student share his learnings and real-world exposure through InternSaathi."
  },
  {
    src: "https://www.youtube.com/embed/uVxFhLa3YXo?controls=1&modestbranding=1&rel=0",
    title: "IMI Bhubaneswar",
    desc: "IMI student shares her enriching internship experience and growth journey."
  },
  {
    src: "https://www.youtube.com/embed/31Ip3STqkeo?controls=1&modestbranding=1&rel=0",
    title: "Journey Beyond Limits",
    desc: "Dream big. Start small. Learn and grow with the right support."
  },
  {
    src: "https://www.youtube.com/embed/SgAiarMEWAk?controls=1&modestbranding=1&rel=0",
    title: "IMI Placement Journey",
    desc: "Discover how InternSaathi guided IMI students towards successful PPO offers and career breakthroughs."
  },
  {
    src: "https://www.youtube.com/embed/m2tByyEwmxc?controls=1&modestbranding=1&rel=0",
    title: "IMI Internship Insights",
    desc: "Hear IMI students talk about real-world learning and the impact of mentorship during internships."
  },
  {
    src: "https://www.youtube.com/embed/IApq2vmmmwY?controls=1&modestbranding=1&rel=0",
    title: "Skill Growth and Transformation",
    desc: "Students share how professional exposure shaped their skills, confidence, and readiness for the corporate world."
  },

  // ⭐ NEW SHORTS ADDED BELOW ⭐
  {
    src: "https://www.youtube.com/embed/GG-K_Ny1W9U?controls=1&modestbranding=1&rel=0",
    title: "Sales & Communication Skills",
    desc: "This short explains why communication is the backbone of sales and how it drives success."
  },
  {
    src: "https://www.youtube.com/embed/TYQGkHe5bC0?controls=1&modestbranding=1&rel=0",
    title: "Finance Intern Insights",
    desc: "A finance intern shares key financial concepts and real-world learning gained during the internship."
  },
  {
    src: "https://www.youtube.com/embed/7E8-aDyx5Jg?controls=1&modestbranding=1&rel=0",
    title: "Finance Intern Experience",
    desc: "Finance intern talks about hands-on learning and professional growth."
  }
]
.map((video, i) => (
        <SwiperSlide key={i}>
          <div
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            onMouseEnter={() => window.swiperInstance?.autoplay.stop()}
            onMouseLeave={() => window.swiperInstance?.autoplay.start()}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <iframe
                className="w-full h-full"
                src={video.src}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 text-center">
              <h4 className="font-semibold text-gray-900 text-base mb-1">{video.title}</h4>
              <p className="text-sm text-gray-600 leading-snug">{video.desc}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>

{/* 4. INTERN SAATHI REELS SECTION */}
<section className="py-10 bg-white border-t border-gray-200">
  <h3 className="text-2xl md:text-3xl font-poppins font-bold text-center text-gray-800 mb-8">
    InternSaathi Highlights
  </h3>

  <div className="max-w-5xl mx-auto px-6">
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      loop={true}
      speed={800}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      breakpoints={{
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      onSwiper={(swiper) => (window.reelSwiper = swiper)}
    >
      {[
        "https://www.instagram.com/reel/DQtbDxBjKxw/",
        "https://www.instagram.com/reel/DQtYzpdjG3L/",
        "https://www.instagram.com/reel/DQtaurMDKHg/",
        "https://www.instagram.com/reel/DQvoFOrjCQz/",
        "https://www.instagram.com/reel/DQvnFdvDKPE/",
        "https://www.instagram.com/reel/DQvofmejAPY/",
        "https://www.instagram.com/reel/DQvmqfBDAnP/",
      ].map((url, i) => (
        <SwiperSlide key={i}>
          <div
            className="relative flex flex-col items-center bg-transparent rounded-2xl overflow-hidden transition-all duration-300"
            onMouseEnter={() => window.reelSwiper?.autoplay.stop()}
            onMouseLeave={() => window.reelSwiper?.autoplay.start()}
          >
            {/* Clean Reel Embed (no captions/comments) */}
            <iframe
              src={`${url}embed`}
              className="w-full h-[480px] rounded-2xl border-none"
              style={{
                maxHeight: "480px",
                overflow: "hidden",
              }}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>




{/* ABOUT US SECTION - Aesthetic and Engaging
<section className="relative py-14 bg-gradient-to-br from-teal-50 via-emerald-100 to-white text-center overflow-hidden">
  {/* Decorative gradient circles for depth 
  <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>
  <div className="absolute bottom-0 right-0 w-56 h-56 bg-teal-300 rounded-full blur-3xl opacity-30"></div>

  <div className="relative max-w-6xl mx-auto px-6">
   

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Card 1 
      <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-teal-500">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h3>
        <p className="text-gray-600 text-sm leading-snug">
          To bridge the gap between classroom learning and professional experience by connecting students to internships that matter.
        </p>
      </div>

      {/* Card 2 
      <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-emerald-500">
        <div className="text-4xl mb-3">🚀</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Vision</h3>
        <p className="text-gray-600 text-sm leading-snug">
          To create an inclusive ecosystem where every student can explore, learn, and grow through hands-on industry experience.
        </p>
      </div>

      {/* Card 3
      <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-cyan-500">
        <div className="text-4xl mb-3">🤝</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Approach</h3>
        <p className="text-gray-600 text-sm leading-snug">
          We collaborate with colleges and professionals to provide transparent, verified, and impactful internship opportunities.
        </p>
      </div>
    </div>

    {/* Small Closing Tagline 
    <p className="mt-10 text-sm text-gray-500 italic">
      “Shaping careers, one internship at a time.”
    </p>
  </div>
</section>





      {/* 3. HORIZONTAL SLIDER: College Logos (Bottom) */}
      <div className="py-4  bg-white backdrop-blur-sm">
          <h3 className="text-2xl font-poppins font-bold text-center text-gray-700 mb-4">
              Our Partner Colleges
          </h3>
          <HorizontalCarousel 
              items={collegeLogos} 
              itemRenderer={renderCollegeLogo} 
              speed={2} // Increased number of items means faster speed (2 seconds per logo) for a nice pace
              className="h-26"
          />
      </div>

      {/* Footer Section */} 
      <footer className="bg-white text-gray-800 py-4 text-center "> 
        <div className="max-w-7xl mx-auto px-4"> 
          
          {/* Powered by Section */} 
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-2"> 
            <span className="text-gray-600 text-sm">Powered by</span> 
            <a 
              href="https://www.sunsysglobal.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
            > 
              <img 
                    src="/logo2.jpg" 
                    alt="Sunsys Logo" 
                    className="h-12 w-16 inline-block" 
                    onError={(e) => { e.target.src = "https://placehold.co/60x48/10B981/ffffff?text=Sunsys"; }}
                /> 
            </a> 
            {/* Sunsys LinkedIn (size 18)  */} 
            <a 
              href="https://www.linkedin.com/company/sunsystechsol-pvt-ltd/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-blue-700 transition-colors duration-300" 
            > 
              <Linkedin size={18} /> 
            </a> 
          </div> 

          {/* Social Media Links*/} 
          <div className="mt-3"> 
            <p className="text-gray-600 font-medium text-sm mb-1">Follow us on</p> 
            <div className="flex justify-center items-center space-x-4"> 
              <a 
                href="https://www.linkedin.com/company/internsaathi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-blue-600 transition-colors duration-300" 
              > 
                <Linkedin size={20} /> 
              </a> 
              <a 
                href="https://www.instagram.com/intern.saathi?igsh=MTNzaXE0eHFtOXNyZw%3D%3D&utm_source=ig_contact_invite" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-pink-400 transition-colors duration-300" 
              > 
                <Instagram size={20} /> 
              </a> 
              <a 
                href="https://x.com/InternSaathi?t=p1eTe0LJEppzSsF_mxMmjg&s=09" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-sky-500 transition-colors duration-300" 
              > 
                <Twitter size={20} /> 
              </a> 
            </div> 
          </div> 
        </div> 
      </footer> 


    </div> 
  ); 
}; 

export default LandingPage;
