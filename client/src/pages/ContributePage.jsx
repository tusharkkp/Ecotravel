import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaCoins, FaTree, FaWater, FaPaw, FaRecycle, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EcoCoinService from '../services/EcoCoinService';

// Import our enhanced components
import ContributionHero from '../components/contribute/ContributionHero';
import ContributionCard3D from '../components/contribute/ContributionCard3D';
import ContributionForm from '../components/contribute/ContributionForm';
import ImpactStats from '../components/contribute/ImpactStats';
import ImpactGlobe from '../components/contribute/ImpactGlobe';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <motion.div 
      className={`fixed top-4 right-4 z-50 max-w-md ${
        type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
      } text-white p-4 rounded-lg shadow-xl`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <div className="flex items-center">
        {type === 'success' ? (
          <FaLeaf className="mr-2 flex-shrink-0" />
        ) : (
          <FaInfoCircle className="mr-2 flex-shrink-0" />
        )}
        <p>{message}</p>
      </div>
    </motion.div>
  );
};

// Main Contribute page component
const ContributePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [selectedCause, setSelectedCause] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Environmental causes data with enhanced details
  const causes = [
    {
      id: 'trees',
      name: 'Plant Trees',
      description: 'Support tree planting initiatives to combat deforestation and climate change.',
      icon: <FaTree className="text-green-600" />,
      minAmount: 50,
      impactDescription: 'Every 50 EcoCoins plants 1 tree, absorbing approx. 25kg of CO₂ per year.',
      color: 'emerald'
    },
    {
      id: 'oceans',
      name: 'Ocean Cleanup',
      description: 'Help remove plastic pollution from our oceans and protect marine ecosystems.',
      icon: <FaWater className="text-blue-600" />,
      minAmount: 100,
      impactDescription: 'Every 100 EcoCoins removes approx. 2kg of plastic waste from oceans.',
      color: 'blue'
    },
    {
      id: 'wildlife',
      name: 'Wildlife Conservation',
      description: 'Support efforts to protect endangered species and their habitats.',
      icon: <FaPaw className="text-amber-600" />,
      minAmount: 75,
      impactDescription: 'Every 75 EcoCoins helps protect endangered wildlife and their habitats.',
      color: 'amber'
    },
    {
      id: 'renewable',
      name: 'Renewable Energy',
      description: 'Invest in clean energy projects to reduce dependence on fossil fuels.',
      icon: <FaRecycle className="text-teal-600" />,
      minAmount: 150,
      impactDescription: 'Every 150 EcoCoins offsets approx. 75kg of CO₂ through renewable energy projects.',
      color: 'teal'
    }
  ];

  // Fetch user balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const result = await EcoCoinService.getBalance(currentUser?.id);
        if (result.success) {
          setBalance(result.balance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };
    
    fetchBalance();
  }, [currentUser]);

  // Handle cause selection
  const handleSelectCause = (causeId) => {
    const cause = causes.find(c => c.id === causeId);
    setSelectedCause(cause);
    
    // Set minimum contribution amount
    if (cause) {
      setContributionAmount(cause.minAmount);
    }
  };

  // Handle contribution submission
  const handleContribute = async () => {
    if (!selectedCause) {
      setToast({
        show: true,
        message: 'Please select a cause to contribute to.',
        type: 'error'
      });
      return;
    }
    
    if (contributionAmount < selectedCause.minAmount) {
      setToast({
        show: true,
        message: `Minimum contribution for ${selectedCause.name} is ${selectedCause.minAmount} EcoCoins.`,
        type: 'error'
      });
      return;
    }
    
    if (contributionAmount > balance) {
      setToast({
        show: true,
        message: 'You don\'t have enough EcoCoins for this contribution.',
        type: 'error'
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await EcoCoinService.contributeEcoCoins(
        currentUser?.id,
        contributionAmount,
        {
          name: selectedCause.name,
          causeId: selectedCause.id
        }
      );
      
      if (result.success) {
        setToast({
          show: true,
          message: `Thank you! You've contributed ${contributionAmount} EcoCoins to ${selectedCause.name}.`,
          type: 'success'
        });
        
        // Update the balance
        setBalance(result.newBalance);
        
        // Reset selection
        setSelectedCause(null);
        setContributionAmount(50);
        
        // Redirect to profile after a delay
        setTimeout(() => {
          navigate('/profile/eco-impact');
        }, 3000);
      } else {
        setToast({
          show: true,
          message: result.error || 'Failed to process contribution. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error making contribution:', error);
      setToast({
        show: true,
        message: 'An error occurred. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toast notification */}
      <AnimatePresence>
        {toast.show && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast({ ...toast, show: false })} 
          />
        )}
      </AnimatePresence>
      
      {/* Hero section */}
      <ContributionHero />
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 max-w-4xl mx-auto">
            <Link to="/profile/eco-impact" className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors">
              <FaArrowLeft className="mr-2" />
              <span>Back to Eco Impact</span>
            </Link>
          </div>
          
          {/* Balance card */}
          <div className="max-w-4xl mx-auto mb-12">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg overflow-hidden"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="p-6 text-white flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-white/20 p-4 rounded-full mr-4">
                    <FaCoins className="text-yellow-300 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-emerald-100">Your EcoCoin Balance</h3>
                    <p className="text-3xl font-bold">{balance}</p>
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-emerald-50">
                  <div className="flex items-center text-sm">
                    <FaLeaf className="mr-2" />
                    <span>Contributing gives you <strong>2× Rating Points</strong></span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* 3D Globe and Contribution Selection */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Select a Cause to Support</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 3D Globe Visualization */}
              <div className="lg:col-span-1">
                <ImpactGlobe selectedProject={selectedCause?.id} />
              </div>
              
              {/* Contribution cards */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {causes.map(cause => (
                    <ContributionCard3D
                      key={cause.id}
                      id={cause.id}
                      name={cause.name}
                      description={cause.description}
                      icon={cause.icon}
                      minAmount={cause.minAmount}
                      impactDescription={cause.impactDescription}
                      onSelect={handleSelectCause}
                      selected={selectedCause?.id === cause.id}
                      color={cause.color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Contribution form */}
          <div className="max-w-4xl mx-auto mb-16">
            <ContributionForm 
              selectedCause={selectedCause}
              balance={balance}
              contributionAmount={contributionAmount}
              setContributionAmount={setContributionAmount}
              isLoading={isLoading}
              onContribute={handleContribute}
              minAmount={selectedCause?.minAmount}
            />
          </div>
          
          {/* Impact Statistics */}
          <ImpactStats />
          
          {/* Information card */}
          <div className="max-w-4xl mx-auto mt-16">
            <motion.div 
              className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-8 border border-emerald-100 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col md:flex-row items-start">
                <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-4 rounded-full mr-6 mb-4 md:mb-0">
                  <FaLeaf className="text-white text-3xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-4">Why Your Contribution Matters</h3>
                  <p className="text-emerald-700 mb-4 leading-relaxed">
                    When you contribute your EcoCoins to environmental causes, you're making a real difference. Our partners use these contributions to fund various environmental projects around the world, from reforestation and ocean cleanup to wildlife conservation and renewable energy initiatives.
                  </p>
                  <p className="text-emerald-700 leading-relaxed">
                    <strong>Bonus:</strong> Contributing EcoCoins gives you <strong>double the points</strong> towards your EcoRating, helping you reach the next tier faster while maximizing your positive impact on the planet!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContributePage; 