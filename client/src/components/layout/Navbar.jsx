import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLeaf, 
  FaCalculator, 
  FaInfoCircle, 
  FaMapMarkerAlt, 
  FaBars, 
  FaTimes,
  FaUser,
  FaCoins,
  FaHandHoldingHeart,
  FaExchangeAlt,
  FaCertificate,
  FaComments
} from 'react-icons/fa';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // NavLink active styles
  const activeLinkClass = "text-emerald-600 border-b-2 border-emerald-500";
  const inactiveLinkClass = "text-gray-700 hover:text-emerald-600";
  
  return (
    <header 
      className={`fixed w-full top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
            <FaLeaf className="text-white" />
          </div>
          <span className="text-xl font-bold text-emerald-700">EcoTravel</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink 
            to="/comparison" 
            className={({ isActive }) => 
              `pb-1 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <div className="flex items-center">
              <FaExchangeAlt className="mr-1" />
              Compare & Book
            </div>
          </NavLink>
          
          <NavLink 
            to="/calculator" 
            className={({ isActive }) => 
              `pb-1 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <div className="flex items-center">
              <FaCalculator className="mr-1" />
              Carbon Calculator
            </div>
          </NavLink>
          
          <NavLink 
            to="/certifications" 
            className={({ isActive }) => 
              `pb-1 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <div className="flex items-center">
              <FaCertificate className="mr-1" />
              Certifications
            </div>
          </NavLink>
          
          <NavLink 
            to="/reviews" 
            className={({ isActive }) => 
              `pb-1 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <div className="flex items-center">
              <FaComments className="mr-1" />
              Reviews
            </div>
          </NavLink>
          
          {currentUser && (
            <>
              <NavLink 
                to="/wallet" 
                className={({ isActive }) => 
                  `pb-1 ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                <div className="flex items-center">
                  <FaCoins className="mr-1" />
                  EcoCoin Wallet
                </div>
              </NavLink>
              
              <NavLink 
                to="/contribute" 
                className={({ isActive }) => 
                  `pb-1 ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                <div className="flex items-center">
                  <FaHandHoldingHeart className="mr-1" />
                  Contribute
                </div>
              </NavLink>
              
              <NavLink 
                to="/profile" 
                className={({ isActive }) => 
                  `pb-1 ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                <div className="flex items-center">
                  <FaUser className="mr-1" />
                  Profile
                </div>
              </NavLink>
            </>
          )}
        </nav>
        
        {/* Profile dropdown */}
        <div className="hidden md:block">
          <ProfileDropdown />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white absolute w-full shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <NavLink 
                  to="/comparison" 
                  className={({ isActive }) => 
                    `p-2 rounded-lg flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <FaExchangeAlt />
                  <span>Compare & Book</span>
                </NavLink>
                
                <NavLink 
                  to="/calculator" 
                  className={({ isActive }) => 
                    `p-2 rounded-lg flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <FaCalculator />
                  <span>Carbon Calculator</span>
                </NavLink>
                
                <NavLink 
                  to="/certifications" 
                  className={({ isActive }) => 
                    `p-2 rounded-lg flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <FaCertificate />
                  <span>Certifications</span>
                </NavLink>
                
                <NavLink 
                  to="/reviews" 
                  className={({ isActive }) => 
                    `p-2 rounded-lg flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <FaComments />
                  <span>Reviews</span>
                </NavLink>
                
                {currentUser && (
                  <>
                    <NavLink 
                      to="/wallet" 
                      className={({ isActive }) => 
                        `p-2 rounded-lg flex items-center space-x-2 ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <FaCoins />
                      <span>EcoCoin Wallet</span>
                    </NavLink>
                    
                    <NavLink 
                      to="/contribute" 
                      className={({ isActive }) => 
                        `p-2 rounded-lg flex items-center space-x-2 ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <FaHandHoldingHeart />
                      <span>Contribute</span>
                    </NavLink>
                    
                    <NavLink 
                      to="/profile" 
                      className={({ isActive }) => 
                        `p-2 rounded-lg flex items-center space-x-2 ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <FaUser />
                      <span>My Profile</span>
                    </NavLink>
                  </>
                )}
                
                <div className="pt-4 border-t border-gray-100">
                  <ProfileDropdown />
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar; 