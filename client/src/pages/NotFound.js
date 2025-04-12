import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaLeaf } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="mb-8 flex justify-center">
        <FaLeaf className="text-primary-500 text-7xl" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
        Sorry, we couldn't find the page you're looking for. 
        It might have been moved or doesn't exist.
      </p>
      <Link to="/" className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-300">
        <FaHome className="mr-2" /> Return to Home
      </Link>
    </div>
  );
};

export default NotFound; 