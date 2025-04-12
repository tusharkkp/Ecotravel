import React from 'react';
import { FaLeaf, FaHeart, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <FaLeaf className="text-emerald-600" />
              </div>
              <span className="text-xl font-bold">EcoTravel</span>
            </div>
            <p className="text-sm text-emerald-100 mb-4">
              Making travel sustainable, one journey at a time. Reducing your carbon footprint while exploring the world.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/calculator" className="text-emerald-100 hover:text-white transition-colors">
                  Carbon Calculator
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="text-emerald-100 hover:text-white transition-colors">
                  Compare Options
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="text-emerald-100 hover:text-white transition-colors">
                  Contribute
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-emerald-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/certifications" className="text-emerald-100 hover:text-white transition-colors">
                  Certifications
                </Link>
              </li>
              <li>
                <a href="#" className="text-emerald-100 hover:text-white transition-colors">
                  Sustainability Blog
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-emerald-100 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-emerald-100 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-emerald-100 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-emerald-100 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
            <p className="text-sm text-emerald-100">
              Sign up for our newsletter to receive sustainable travel tips.
            </p>
          </div>
        </div>
        
        <div className="border-t border-emerald-500 mt-8 pt-6 text-center text-sm text-emerald-100">
          <p>© {new Date().getFullYear()} EcoTravel. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center">
            Made with <FaHeart className="text-red-400 mx-1" /> for a greener planet
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 