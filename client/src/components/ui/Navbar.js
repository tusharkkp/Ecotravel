import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaLeaf, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import EcoWalletDropdown from '../wallet/EcoWalletDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Handle navigation to sections on home page or separate pages
  const handleNavigation = (e, path, sectionId = null) => {
    e.preventDefault();
    
    // If we're going to a section on the home page
    if (path === '/' && sectionId) {
      // If already on home page, scroll to section
      if (location.pathname === '/') {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home page with section hash
        navigate(`/#${sectionId}`);
      }
    } else {
      // Navigate to a different page
      navigate(path);
    }
    
    // Close mobile menu if open
    if (isOpen) setIsOpen(false);
    
    // Close user menu if open
    if (showUserMenu) setShowUserMenu(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    
    // Close menus
    if (isOpen) setIsOpen(false);
    if (showUserMenu) setShowUserMenu(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaLeaf className="text-primary-500 text-2xl" />
            <span className="text-xl font-display font-bold text-primary-700">EcoTravel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="/#features"
              onClick={(e) => handleNavigation(e, '/', 'features')}
              className="text-gray-600 hover:text-primary-500 transition-colors duration-300"
            >
              Features
            </a>
            <NavLink 
              to="/calculator"
              className={({ isActive }) => 
                isActive 
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-primary-500 transition-colors duration-300'
              }
            >
              Carbon Calculator
            </NavLink>
            <NavLink 
              to="/certifications"
              className={({ isActive }) => 
                isActive 
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-primary-500 transition-colors duration-300'
              }
            >
              Green Certifications
            </NavLink>
            <NavLink 
              to="/rewards"
              className={({ isActive }) => 
                isActive 
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-primary-500 transition-colors duration-300'
              }
            >
              Rewards
            </NavLink>
            <NavLink 
              to="/reviews"
              className={({ isActive }) => 
                isActive 
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-primary-500 transition-colors duration-300'
              }
            >
              Community Reviews
            </NavLink>
            <NavLink 
              to="/achievement-example"
              className={({ isActive }) => 
                isActive 
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-primary-500 transition-colors duration-300'
              }
            >
              Achievements Demo
            </NavLink>
          </div>

          {/* Login/Register or User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <>
                {/* EcoWallet Dropdown */}
                <EcoWalletDropdown userId={currentUser.id} />
                
                {/* User Profile Menu */}
                <div className="relative">
                  <button 
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                      {currentUser.profileImage ? (
                        <img 
                          src={currentUser.profileImage} 
                          alt={currentUser.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-primary-600" />
                      )}
                    </div>
                    <span className="font-medium">
                      {currentUser.fullName?.split(' ')[0] || 'User'}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                      <Link 
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/profile/eco-impact"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <span className="flex items-center">
                          <FaLeaf className="mr-2 text-emerald-500" />
                          Eco Impact
                        </span>
                      </Link>
                      <Link 
                        to="/calculator"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Calculations
                      </Link>
                      <Link 
                        to="/rewards"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Rewards
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors duration-300"
                >
                  Log in
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {/* Mobile EcoWallet Button (only shown when logged in) */}
            {currentUser && (
              <div className="mr-3">
                <EcoWalletDropdown userId={currentUser.id} />
              </div>
            )}
            
            <button onClick={toggleMenu} className="text-gray-600 hover:text-primary-500 focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-3">
            <div className="flex flex-col space-y-3">
              <a 
                href="/#features"
                onClick={(e) => handleNavigation(e, '/', 'features')}
                className="text-gray-600 hover:text-primary-500 px-2 py-1 transition-colors duration-300"
              >
                Features
              </a>
              <NavLink 
                to="/calculator"
                onClick={toggleMenu}
                className={({ isActive }) => 
                  isActive 
                    ? 'text-primary-600 font-medium px-2 py-1'
                    : 'text-gray-600 hover:text-primary-500 px-2 py-1 transition-colors duration-300'
                }
              >
                Carbon Calculator
              </NavLink>
              <NavLink 
                to="/certifications"
                onClick={toggleMenu}
                className={({ isActive }) => 
                  isActive 
                    ? 'text-primary-600 font-medium px-2 py-1'
                    : 'text-gray-600 hover:text-primary-500 px-2 py-1 transition-colors duration-300'
                }
              >
                Green Certifications
              </NavLink>
              <NavLink 
                to="/rewards"
                onClick={toggleMenu}
                className={({ isActive }) => 
                  isActive 
                    ? 'text-primary-600 font-medium px-2 py-1'
                    : 'text-gray-600 hover:text-primary-500 px-2 py-1 transition-colors duration-300'
                }
              >
                Rewards
              </NavLink>
              <NavLink 
                to="/reviews"
                onClick={toggleMenu}
                className={({ isActive }) => 
                  isActive 
                    ? 'text-primary-600 font-medium px-2 py-1'
                    : 'text-gray-600 hover:text-primary-500 px-2 py-1 transition-colors duration-300'
                }
              >
                Community Reviews
              </NavLink>
              <NavLink 
                to="/achievement-example"
                onClick={toggleMenu}
                className={({ isActive }) => 
                  isActive 
                    ? 'text-primary-600 font-medium px-2 py-1'
                    : 'text-gray-600 hover:text-primary-500 px-2 py-1 transition-colors duration-300'
                }
              >
                Achievements Demo
              </NavLink>
              
              {/* Mobile Auth Links */}
              <div className="pt-2 flex flex-col space-y-3 border-t">
                {currentUser ? (
                  <>
                    <NavLink 
                      to="/profile"
                      onClick={toggleMenu}
                      className={({ isActive }) => 
                        isActive 
                          ? 'text-primary-600 font-medium px-2 py-1 flex items-center'
                          : 'text-gray-600 hover:text-primary-500 px-2 py-1 flex items-center transition-colors duration-300'
                      }
                    >
                      <FaUser className="mr-2" />
                      My Profile
                    </NavLink>
                    <button 
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 px-2 py-1 flex items-center transition-colors duration-300 text-left"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      onClick={toggleMenu}
                      className="text-primary-600 hover:text-primary-700 px-2 py-1 transition-colors duration-300"
                    >
                      Log in
                    </Link>
                    <Link 
                      to="/register"
                      onClick={toggleMenu}
                      className="text-primary-600 hover:text-primary-700 px-2 py-1 transition-colors duration-300"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 