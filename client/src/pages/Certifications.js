import React, { useState } from 'react';
import { FaLeaf, FaStar, FaSearch, FaTimes, FaCheck, FaGlobe, FaBuilding, FaCalendarAlt } from 'react-icons/fa';

const Certifications = () => {
  // State to track which certification is selected for viewing details
  const [selectedCert, setSelectedCert] = useState(null);
  // State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Example certification data - in a real app, this would come from an API
  const certifications = [
    {
      id: 1,
      name: "EcoStay Resort",
      type: "accommodation",
      rating: 4.8,
      location: "Alpine Valley, Switzerland",
      description: "Fully sustainable resort with renewable energy and waste reduction systems.",
      provider: "Global Sustainable Tourism Council",
      criteria: [
        { name: "Energy Efficiency", score: 95, description: "Uses 100% renewable energy sources" },
        { name: "Waste Management", score: 90, description: "Zero waste policy with comprehensive recycling" },
        { name: "Water Conservation", score: 85, description: "Advanced water recycling systems" }
      ],
      website: "https://ecostay-resort.example.com",
      verified: true,
      certifiedSince: "2020-03-15"
    },
    {
      id: 2,
      name: "GreenRail Transport",
      type: "transportation",
      rating: 4.5,
      location: "European Network",
      description: "Low-emission train service using renewable energy sources.",
      provider: "EcoTransit Authority",
      criteria: [
        { name: "Carbon Emissions", score: 92, description: "80% reduction compared to standard rail" },
        { name: "Energy Source", score: 95, description: "Powered by renewable electricity" },
        { name: "Noise Pollution", score: 88, description: "Advanced noise reduction technology" }
      ],
      website: "https://greenrail.example.com",
      verified: true,
      certifiedSince: "2019-08-22"
    },
    {
      id: 3,
      name: "EcoTours Adventure",
      type: "activity",
      rating: 4.7,
      location: "Costa Rica",
      description: "Carbon-neutral tours supporting local conservation efforts.",
      provider: "Rainforest Alliance",
      criteria: [
        { name: "Conservation Support", score: 98, description: "Directly funds local conservation projects" },
        { name: "Community Impact", score: 94, description: "Employs and trains local communities" },
        { name: "Carbon Footprint", score: 89, description: "Carbon-neutral operations with offsets" }
      ],
      website: "https://ecotours.example.com",
      verified: true,
      certifiedSince: "2021-01-10"
    }
  ];

  // Handle opening the modal with the selected certification
  const handleViewDetails = (cert) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Optional: delay clearing the selected cert for better animation
    setTimeout(() => setSelectedCert(null), 300);
  };

  // Color mapping for certification types
  const typeColors = {
    accommodation: 'bg-primary-500',
    transportation: 'bg-secondary-500',
    activity: 'bg-accent-500'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Green Certification Database</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Discover eco-certified accommodations, transportation providers, and activities 
          that meet rigorous sustainability standards.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-primary-50 rounded-xl p-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-grow">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for eco-certified providers..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-white border border-primary-500 rounded-lg text-primary-600 hover:bg-primary-50">
              Accommodations
            </button>
            <button className="px-4 py-2 bg-white border border-primary-500 rounded-lg text-primary-600 hover:bg-primary-50">
              Transportation
            </button>
            <button className="px-4 py-2 bg-white border border-primary-500 rounded-lg text-primary-600 hover:bg-primary-50">
              Activities
            </button>
          </div>
        </div>
      </div>

      {/* Certifications List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map(cert => (
          <div key={cert.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className={`h-3 ${typeColors[cert.type] || 'bg-gray-500'}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{cert.name}</h3>
                <div className="flex items-center bg-primary-100 px-3 py-1 rounded-full">
                  <FaLeaf className="text-primary-600 mr-1" />
                  <span className="font-medium">{cert.rating}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-3">{cert.location}</p>
              <p className="text-gray-600 mb-4">{cert.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`${i < Math.floor(cert.rating) ? 'text-yellow-400' : 'text-gray-300'} mr-1`} />
                  ))}
                </div>
                {/* View Details button with onClick handler */}
                <button 
                  className="text-primary-600 font-medium hover:underline"
                  onClick={() => handleViewDetails(cert)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying certification details */}
      {isModalOpen && selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal header with colored bar based on certification type */}
            <div className={`h-3 ${typeColors[selectedCert.type] || 'bg-gray-500'}`}></div>
            
            <div className="p-6">
              {/* Close button */}
              <div className="flex justify-end">
                <button 
                  onClick={closeModal}
                  className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
                  aria-label="Close modal"
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* Certification header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedCert.name}</h2>
                  <p className="text-gray-500 flex items-center">
                    <span className="mr-4">{selectedCert.location}</span>
                    {selectedCert.verified && (
                      <span className="flex items-center text-green-600">
                        <FaCheck className="mr-1" /> Verified
                      </span>
                    )}
                  </p>
                </div>
                <div className="bg-primary-100 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Eco-rating</p>
                  <div className="flex items-center">
                    <FaLeaf className="text-primary-600 mr-1" />
                    <span className="font-bold text-xl">{selectedCert.rating}</span>
                    <span className="text-gray-400 ml-1">/5</span>
                  </div>
                </div>
              </div>
              
              {/* Certification provider info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Certified by</p>
                    <p className="font-medium">{selectedCert.provider}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <p className="text-sm text-gray-500 mb-1">Certified since</p>
                    <p className="font-medium flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      {new Date(selectedCert.certifiedSince).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Certification description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600">{selectedCert.description}</p>
                {selectedCert.website && (
                  <a 
                    href={selectedCert.website} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 mt-3 hover:underline"
                  >
                    <FaGlobe className="mr-2" /> Visit Website
                  </a>
                )}
              </div>
              
              {/* Certification criteria */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Certification Criteria</h3>
                <div className="space-y-4">
                  {selectedCert.criteria.map((criterion, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{criterion.name}</h4>
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                          Score: {criterion.score}/100
                        </div>
                      </div>
                      <p className="text-gray-600">{criterion.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer with buttons */}
              <div className="mt-8 pt-4 border-t flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications; 