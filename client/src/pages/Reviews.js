import React, { useState } from 'react';
import { FaUser, FaStar, FaThumbsUp, FaComment, FaFilter, FaSearch } from 'react-icons/fa';

const Reviews = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Example reviews data - in a real app, this would come from an API
  const reviews = [
    {
      id: 1,
      user: "EcoExplorer",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 5,
      title: "Amazing Eco-Resort Experience",
      text: "The solar-powered villas were incredible. Staff were knowledgeable about local ecosystem and showed us how they conserve water and reduce waste. Truly inspiring!",
      location: "Bali, Indonesia",
      type: "accommodation",
      tags: ["eco-resort", "solar-power", "sustainable"],
      likes: 42,
      comments: 8,
      date: "2023-09-15"
    },
    {
      id: 2,
      user: "GreenTraveler",
      avatar: "https://i.pravatar.cc/150?img=4",
      rating: 4,
      title: "Low-Carbon Train Adventure",
      text: "Took the train instead of flying and reduced my carbon footprint by 80%. The scenic route through the Alps was breathtaking, and I met fellow eco-conscious travelers along the way.",
      location: "Swiss Alps, Europe",
      type: "transportation",
      tags: ["train-travel", "low-carbon", "scenic-route"],
      likes: 36,
      comments: 5,
      date: "2023-10-03"
    },
    {
      id: 3,
      user: "SustainableWanderer",
      avatar: "https://i.pravatar.cc/150?img=8",
      rating: 5,
      title: "Zero-Waste Hiking Tour",
      text: "The guide provided reusable containers for lunch and educated us about leaving no trace. We even participated in a beach cleanup as part of the activity. Highly recommend!",
      location: "Costa Rica",
      type: "activity",
      tags: ["zero-waste", "hiking", "beach-cleanup"],
      likes: 51,
      comments: 12,
      date: "2023-11-22"
    }
  ];

  // Filter reviews based on active tab
  const filteredReviews = activeTab === 'all' 
    ? reviews 
    : reviews.filter(review => review.type === activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Community Reviews</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Discover sustainable travel tips and insights from fellow eco-conscious travelers.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-primary-50 rounded-xl p-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-grow">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-600"><FaFilter /></span>
            <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
              <option value="most-liked">Most Liked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-8 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 mr-2 rounded-lg font-medium ${
            activeTab === 'all' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          All Reviews
        </button>
        <button 
          onClick={() => setActiveTab('accommodation')}
          className={`px-6 py-2 mr-2 rounded-lg font-medium ${
            activeTab === 'accommodation' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Accommodations
        </button>
        <button 
          onClick={() => setActiveTab('transportation')}
          className={`px-6 py-2 mr-2 rounded-lg font-medium ${
            activeTab === 'transportation' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Transportation
        </button>
        <button 
          onClick={() => setActiveTab('activity')}
          className={`px-6 py-2 mr-2 rounded-lg font-medium ${
            activeTab === 'activity' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Activities
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {filteredReviews.map(review => (
          <div key={review.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={review.avatar} alt={review.user} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{review.title}</h3>
                  <div className="flex items-center mb-1">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`${i < review.rating ? 'text-yellow-400' : 'text-gray-300'} mr-1`} />
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">{review.user}</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">
                    {review.location} • {review.date}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.text}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {review.tags.map((tag, index) => (
                  <span key={index} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between border-t pt-3">
                <button className="flex items-center text-gray-500 hover:text-primary-600">
                  <FaThumbsUp className="mr-1" /> {review.likes}
                </button>
                <button className="flex items-center text-gray-500 hover:text-primary-600">
                  <FaComment className="mr-1" /> {review.comments}
                </button>
                <button className="text-primary-600 font-medium hover:underline">
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews found for this category. Be the first to share your experience!
          </div>
        )}

        {filteredReviews.length > 0 && (
          <div className="text-center pt-4">
            <button className="px-8 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50">
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews; 