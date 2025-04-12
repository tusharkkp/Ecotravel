import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalculator, FaAward, FaLeaf, FaComments, FaTree, FaBiking, FaSolarPanel, FaWind } from 'react-icons/fa';
import EcoPlanet from '../components/3d/EcoPlanet';
import GlassmorphicCard from '../components/ui/GlassmorphicCard';
import OrganicShape from '../components/ui/OrganicShape';
import { useScrollAnimation } from '../utils/animation';

const Home = () => {
  const location = useLocation();
  const featuresRef = useRef(null);
  
  // Initialize scroll animations
  useScrollAnimation();

  // Handle any hash links on initial page load
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // remove the # character
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // Scroll to top on page load
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Scroll to section function for in-page navigation
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Enhanced with 3D element and natural shapes */}
      <section id="hero" className="relative bg-gradient-to-br from-primary-600 to-primary-700 pt-20 pb-32 overflow-hidden">
        {/* Background organic shapes */}
        <OrganicShape 
          variant="blob1" 
          color="white" 
          opacity={0.05} 
          size="xl" 
          className="top-0 right-0 translate-x-1/2 -translate-y-1/4" 
        />
        <OrganicShape 
          variant="blob2" 
          color="white" 
          opacity={0.05} 
          size="lg" 
          className="bottom-0 left-0 -translate-x-1/3 translate-y-1/2"
          rotate={180} 
        />
        
        {/* Animated leaves */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="leaf leaf-1"></div>
          <div className="leaf leaf-2"></div>
          <div className="leaf leaf-3"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 animate-on-scroll" data-delay="100">
              <div className="relative">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white font-display leading-tight">
                  Plan Your <span className="relative">
                    Eco-Friendly
                    <span className="absolute bottom-1 left-0 w-full h-2 bg-accent-400 opacity-40 -z-10 rounded-full"></span>
                  </span> Adventures
                </h1>
                <p className="text-xl mb-8 text-primary-50 max-w-xl">
                  Discover sustainable travel options, reduce your carbon footprint, 
                  and make a positive impact on the planet while exploring new destinations.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/calculator" className="btn transition-all duration-300 transform hover:-translate-y-1 bg-white text-primary-600 hover:bg-primary-50 focus:ring-white shadow-lg hover:shadow-xl">
                    Calculate Your Trip Impact
                  </Link>
                  <Link to="/certifications" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:-translate-y-1">
                    Find Eco-Certified Places
                  </Link>
                </div>
              </div>
            </div>
            
            {/* 3D EcoPlanet Component */}
            <div className="lg:w-1/2 animate-on-scroll" data-delay="300">
              <EcoPlanet className="z-10" />
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ transform: 'translateY(1px)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 220" className="w-full h-auto">
            <path 
              fill="#f8fafc" 
              fillOpacity="1" 
              d="M0,32L60,58.7C120,85,240,139,360,176C480,213,600,235,720,224C840,213,960,171,1080,160C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
            </path>
          </svg>
        </div>
      </section>

      {/* Features Section - Enhanced with eco-cards */}
      <section id="features" className="py-20 relative">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-leaf-pattern opacity-5 pointer-events-none"></div>
        
        {/* Organic shape decorations */}
        <OrganicShape 
          variant="blob3" 
          color="primary" 
          opacity={0.05} 
          size="lg" 
          className="top-1/4 right-0 translate-x-1/2" 
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-on-scroll" ref={featuresRef}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-700">Making Sustainable Travel <span className="text-secondary-600">Easier</span></h2>
            <div className="w-24 h-1 bg-accent-400 mx-auto my-4 rounded-full"></div>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Our platform offers tools and resources to help you make environmentally 
              conscious travel decisions without compromising on experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Carbon Calculator */}
            <div id="calculator" className="animate-on-scroll" data-delay="100">
              <GlassmorphicCard className="h-full p-8 rounded-2xl flex flex-col items-center text-center">
                <div className="bg-primary-100 p-5 rounded-full mb-5 transform transition-transform hover:scale-110 hover:rotate-3">
                  <FaCalculator className="text-primary-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary-700">Carbon Calculator</h3>
                <p className="text-gray-600 mb-5">
                  Estimate the carbon emissions for your trips and receive 
                  recommendations to reduce your environmental impact.
                </p>
                <Link 
                  to="/calculator" 
                  className="text-primary-500 font-medium hover:text-primary-600 mt-auto flex items-center"
                >
                  <span>Calculate Now</span>
                  <svg className="w-5 h-5 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </GlassmorphicCard>
            </div>

            {/* Green Certifications */}
            <div id="certifications" className="animate-on-scroll" data-delay="200">
              <GlassmorphicCard className="h-full p-8 rounded-2xl flex flex-col items-center text-center">
                <div className="bg-primary-100 p-5 rounded-full mb-5 transform transition-transform hover:scale-110 hover:rotate-3">
                  <FaLeaf className="text-primary-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary-700">Green Certifications</h3>
                <p className="text-gray-600 mb-5">
                  Find eco-certified accommodations, transportation providers, 
                  and activities that meet sustainability standards.
                </p>
                <Link 
                  to="/certifications" 
                  className="text-primary-500 font-medium hover:text-primary-600 mt-auto flex items-center"
                >
                  <span>View Certifications</span>
                  <svg className="w-5 h-5 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </GlassmorphicCard>
            </div>

            {/* Rewards System */}
            <div id="rewards" className="animate-on-scroll" data-delay="300">
              <GlassmorphicCard className="h-full p-8 rounded-2xl flex flex-col items-center text-center">
                <div className="bg-primary-100 p-5 rounded-full mb-5 transform transition-transform hover:scale-110 hover:rotate-3">
                  <FaAward className="text-primary-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary-700">Rewards System</h3>
                <p className="text-gray-600 mb-5">
                  Earn eco-points for sustainable travel choices and redeem them 
                  for discounts, perks, and exclusive rewards.
                </p>
                <Link 
                  to="/rewards" 
                  className="text-primary-500 font-medium hover:text-primary-600 mt-auto flex items-center"
                >
                  <span>View Rewards</span>
                  <svg className="w-5 h-5 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </GlassmorphicCard>
            </div>

            {/* Community Reviews */}
            <div id="reviews" className="animate-on-scroll" data-delay="400">
              <GlassmorphicCard className="h-full p-8 rounded-2xl flex flex-col items-center text-center">
                <div className="bg-primary-100 p-5 rounded-full mb-5 transform transition-transform hover:scale-110 hover:rotate-3">
                  <FaComments className="text-primary-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary-700">Community Reviews</h3>
                <p className="text-gray-600 mb-5">
                  Access user-generated tips, reviews, and insights from fellow eco-conscious 
                  travelers to inform your plans.
                </p>
                <Link 
                  to="/reviews" 
                  className="text-primary-500 font-medium hover:text-primary-600 mt-auto flex items-center"
                >
                  <span>Read Reviews</span>
                  <svg className="w-5 h-5 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </GlassmorphicCard>
            </div>
          </div>
        </div>
      </section>

      {/* Eco Benefits Section - New Addition */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-wave-pattern opacity-20 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700">Sustainable Travel <span className="text-primary-600">Benefits</span></h2>
            <div className="w-24 h-1 bg-accent-400 mx-auto my-4 rounded-full"></div>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              When you choose eco-friendly travel options, you're contributing to a healthier planet
              and supporting local communities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="animate-on-scroll" data-delay="100">
              <div className="bg-white rounded-2xl p-6 shadow-eco text-center border border-primary-100 hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-eco-lg">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <FaTree className="text-2xl text-primary-600" />
                </div>
                <h3 className="font-bold text-lg text-primary-700 mb-2">Carbon Reduction</h3>
                <p className="text-gray-600">Minimize your carbon footprint while still enjoying amazing travel experiences.</p>
              </div>
            </div>
            
            <div className="animate-on-scroll" data-delay="200">
              <div className="bg-white rounded-2xl p-6 shadow-eco text-center border border-primary-100 hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-eco-lg">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <FaSolarPanel className="text-2xl text-primary-600" />
                </div>
                <h3 className="font-bold text-lg text-primary-700 mb-2">Support Green Businesses</h3>
                <p className="text-gray-600">Help eco-friendly businesses thrive and encourage more sustainable practices.</p>
              </div>
            </div>
            
            <div className="animate-on-scroll" data-delay="300">
              <div className="bg-white rounded-2xl p-6 shadow-eco text-center border border-primary-100 hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-eco-lg">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <FaBiking className="text-2xl text-primary-600" />
                </div>
                <h3 className="font-bold text-lg text-primary-700 mb-2">Healthier Experiences</h3>
                <p className="text-gray-600">Eco-travel often involves more physical activity and connection with nature.</p>
              </div>
            </div>
            
            <div className="animate-on-scroll" data-delay="400">
              <div className="bg-white rounded-2xl p-6 shadow-eco text-center border border-primary-100 hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-eco-lg">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <FaWind className="text-2xl text-primary-600" />
                </div>
                <h3 className="font-bold text-lg text-primary-700 mb-2">Meaningful Connections</h3>
                <p className="text-gray-600">Connect with like-minded travelers and local communities who share your values.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced with glassmorphism */}
      <section id="cta" className="relative py-16 bg-gradient-to-r from-primary-600 to-secondary-600 overflow-hidden">
        {/* Background organic shapes */}
        <OrganicShape 
          variant="blob2" 
          color="white" 
          opacity={0.07} 
          size="xl" 
          className="top-0 right-0 translate-x-1/2 -translate-y-1/2" 
        />
        <OrganicShape 
          variant="blob1" 
          color="white" 
          opacity={0.07} 
          size="lg" 
          className="bottom-0 left-0 -translate-x-1/3 translate-y-1/3"
          rotate={180} 
        />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-display">Ready to Travel More Sustainably?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-secondary-50">
              Join our community of eco-conscious travelers and start planning your next green adventure.
            </p>
            <Link to="/calculator" className="btn bg-white text-secondary-600 hover:bg-secondary-50 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 