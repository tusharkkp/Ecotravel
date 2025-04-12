import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <FaLeaf className="text-primary-400 text-2xl" />
              <span className="text-xl font-display font-bold text-white">EcoTravel</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Helping travelers reduce their carbon footprint without compromising on experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Main Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/calculator" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  Carbon Calculator
                </Link>
              </li>
              <li>
                <Link to="/certifications" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  Green Certifications
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  Rewards System
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  Community Reviews
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Account Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/trips" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  My Trips
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col-reverse md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © {currentYear} EcoTravel. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 text-sm">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 text-sm">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 