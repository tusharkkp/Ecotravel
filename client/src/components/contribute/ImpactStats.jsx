import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaTree, FaWater, FaPaw, FaUsers } from 'react-icons/fa';
import CountUp from 'react-countup';

const StatCard = ({ icon, title, value, unit, description, delay, color }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        delay: delay,
        ease: "easeOut" 
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`bg-white rounded-2xl shadow-xl overflow-hidden border-b-4 ${color}`}
    >
      <div className="p-6">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${color.replace('border', 'bg').replace('-600', '-100')}`}>
          {icon}
        </div>
        
        <h3 className="font-bold text-gray-800 text-xl mb-1">{title}</h3>
        
        <div className="flex items-baseline mb-2">
          <span className={`text-3xl font-extrabold ${color.replace('border', 'text')}`}>
            {isInView ? (
              <CountUp
                end={value}
                duration={2.5}
                separator=","
              />
            ) : 0}
          </span>
          <span className="ml-1 text-gray-600">{unit}</span>
        </div>
        
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

const ImpactStats = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block text-emerald-600 font-semibold tracking-widest uppercase text-sm mb-2"
          >
            Our Collective Impact
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            Together We're Making a Difference
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-gray-600 text-lg"
          >
            Through our community's contributions, we've achieved remarkable environmental impact worldwide.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <StatCard
            icon={<FaTree className="text-green-600 text-2xl" />}
            title="Trees Planted"
            value={187456}
            unit="trees"
            description="Helping restore forests and absorb carbon dioxide"
            delay={0.1}
            color="border-green-600"
          />
          
          <StatCard
            icon={<FaWater className="text-blue-600 text-2xl" />}
            title="Ocean Cleanup"
            value={82651}
            unit="kg"
            description="Plastic waste removed from oceans and waterways"
            delay={0.2}
            color="border-blue-600"
          />
          
          <StatCard
            icon={<FaPaw className="text-amber-600 text-2xl" />}
            title="Wildlife Saved"
            value={1254}
            unit="species"
            description="Endangered species protected through habitat conservation"
            delay={0.3}
            color="border-amber-600"
          />
          
          <StatCard
            icon={<FaUsers className="text-purple-600 text-2xl" />}
            title="Community Members"
            value={24895}
            unit="people"
            description="Eco-conscious travelers making a difference"
            delay={0.4}
            color="border-purple-600"
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 italic">
            "Small actions, multiplied by millions of people, can transform the world." — Howard Zinn
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStats; 