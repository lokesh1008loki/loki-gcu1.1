'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function LeadGenerationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    interests: [] as string[],
    otherInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const interestOptions = [
    { id: 'ikea', label: '🛍️ IKEA Order', value: 'IKEA Order' },
    { id: 'flight', label: '✈️ Flight Booking', value: 'Flight Booking' },
    { id: 'disney', label: '🎢 Disneyland/Theme Park Tickets', value: 'Disneyland/Theme Park Tickets' },
    { id: 'rent', label: '🏠 Rent Payment', value: 'Rent Payment' },
    { id: 'other', label: '📝 Other', value: 'Other' }
  ];

  const handleInterestChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter(interest => interest !== value)
        : [...prev.interests, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          variants={successVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div 
            className="text-6xl mb-4"
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            🎉
          </motion.div>
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Thank You!
          </motion.h2>
          <motion.p 
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Your information has been submitted successfully. We'll contact you within 15 minutes with your personalized travel and lifestyle optimization details!
          </motion.p>
          <motion.div 
            className="bg-green-50 border border-green-200 rounded-lg p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-green-800 font-medium">
              ✅ Your optimization request is being processed
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header 
        className="bg-white shadow-sm border-b border-gray-100"
        variants={headerVariants}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Optimize Your <motion.span 
                className="text-blue-600"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                Travel & Lifestyle
              </motion.span> with Expert Planning
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            >
              Travel, Shop, and Live Comfortably with GoComfortUSA
            </motion.p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Benefits Section */}
          <motion.div
            variants={itemVariants}
            className="space-y-6"
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Why Choose GoComfortUSA?
              </h2>
              <div className="space-y-4">
                {[
                  { icon: "✅", title: "Expert Strategy", desc: "Start optimizing your travel and orders with professional research" },
                  { icon: "🤝", title: "Trusted by Thousands Across the USA", desc: "Join our community of savvy travelers and shoppers" },
                  { icon: "⚡", title: "Fast Response Within 15 Minutes", desc: "Get your personalized research details quickly" }
                ].map((benefit, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <motion.div 
                      className="text-2xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    >
                      {benefit.icon}
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white"
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <h3 className="text-xl font-bold mb-3">Our Services</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { icon: "🛍️", text: "IKEA Orders" },
                  { icon: "✈️", text: "Flight Bookings" },
                  { icon: "🎢", text: "Theme Park Tickets" },
                  { icon: "🏠", text: "Rent Payments" }
                ].map((service, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <span>{service.icon}</span>
                    <span>{service.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            variants={formVariants}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            whileHover={{ 
              y: -2,
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
              transition: { duration: 0.3 }
            }}
          >
            <div className="text-center mb-6">
              <motion.h2 
                className="text-2xl font-bold text-gray-800 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Get Your Personalized Strategy
              </motion.h2>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Fill out the form below and we'll contact you within 15 minutes with expert options
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </motion.div>

              {/* Phone Number */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="(555) 123-4567"
                />
              </motion.div>

              {/* WhatsApp/Telegram */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp or Telegram Number <span className="text-blue-600">(Preferred for quick response)</span>
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </motion.div>

              {/* Interests */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What services are you interested in? *
                </label>
                <div className="space-y-2">
                  {interestOptions.map((option, index) => (
                    <motion.label 
                      key={option.id} 
                      className="flex items-center space-x-3 cursor-pointer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(option.value)}
                        onChange={() => handleInterestChange(option.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Other Interest Text Input */}
              <AnimatePresence>
                {formData.interests.includes('Other') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label htmlFor="otherInterest" className="block text-sm font-medium text-gray-700 mb-1">
                      Please specify other interest
                    </label>
                    <input
                      type="text"
                      id="otherInterest"
                      value={formData.otherInterest}
                      onChange={(e) => setFormData(prev => ({ ...prev, otherInterest: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Tell us about your specific needs"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || formData.interests.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div 
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Submit & Get My Optimized Strategy'
                )}
              </motion.button>
            </form>

            {/* Support Info */}
            <motion.div 
              className="mt-6 pt-6 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <h3 className="text-sm font-medium text-gray-700 mb-3">Need immediate assistance?</h3>
              <div className="space-y-2 text-sm">
                <motion.div 
                  className="flex items-center space-x-2"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <span className="text-green-600">📱</span>
                  <span>WhatsApp: +1-555-123-4567</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <span className="text-blue-600">📧</span>
                  <span>Email: support@gocomfortusa.com</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 text-white py-8 mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">
            GoComfortUSA – Travel, Shop, and Live Comfortably
          </h3>
          <p className="text-gray-300 text-sm">
            Your information is 100% secure and never shared.
          </p>
        </div>
      </motion.footer>
    </motion.div>
  );
} 