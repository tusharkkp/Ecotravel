// import { navigate } from '@reach/router';

class ChatbotService {
  // Knowledge base for common questions
  static knowledgeBase = {
    // Eco Points / Rewards
    'eco-points': {
      patterns: ['eco[ -]points', 'points', 'how (to|do) (i|we) earn', 'rewards'],
      response: "You can earn EcoCoins by making sustainable travel choices! Each eco-friendly booking earns you points based on how much carbon you save. You'll get more points for choosing accommodations, transport, and activities with higher eco-ratings.",
      options: [
        { text: "View Rewards Page", value: "NAVIGATE_TO_REWARDS" },
        { text: "How to redeem points?", value: "QUERY_REDEEM_POINTS" }
      ]
    },
    'redeem-points': {
      patterns: ['redeem', 'use points', 'spend (points|ecocoins)'],
      response: "You can redeem your EcoCoins for various rewards including discounts on eco-friendly accommodations, carbon offset certificates, and sustainable travel merchandise. Visit the Rewards page to see all available options!",
      options: [
        { text: "View Rewards Page", value: "NAVIGATE_TO_REWARDS" }
      ]
    },
    
    // Carbon Calculator
    'carbon-calculator': {
      patterns: ['carbon (calculator|footprint)', 'calculate (emissions|footprint)', 'how much co2'],
      response: "Our Carbon Calculator helps you estimate the environmental impact of your travel choices. Enter your transportation, accommodation, and activities to see your carbon footprint and get personalized suggestions for reducing emissions.",
      options: [
        { text: "Go to Calculator", value: "NAVIGATE_TO_CALCULATOR" },
        { text: "How accurate is it?", value: "QUERY_CALCULATOR_ACCURACY" }
      ]
    },
    'calculator-accuracy': {
      patterns: ['accurate', 'accuracy', 'reliable'],
      response: "Our calculator uses industry-standard emission factors based on research from transportation agencies, hospitality studies, and climate science. While not exact to your specific case, it provides a reliable estimate within ±10% of actual emissions.",
    },
    
    // Green Certifications
    'green-certification': {
      patterns: ['certification', 'certified', 'eco[ -]rating', 'sustainable (hotel|accommodation|lodging)'],
      response: "Green-certified hotels and services meet specific environmental standards verified by third-party organizations. These include energy efficiency, water conservation, waste reduction, and sustainable sourcing practices.",
      options: [
        { text: "View Certifications", value: "NAVIGATE_TO_CERTIFICATIONS" },
        { text: "Popular eco-hotels?", value: "QUERY_ECO_HOTELS" }
      ]
    },
    
    // General site navigation
    'help-navigation': {
      patterns: ['help', 'navigate', 'find', 'where is', 'how to use'],
      response: "I can help you navigate our eco-travel platform! What would you like to explore?",
      options: [
        { text: "Carbon Calculator", value: "NAVIGATE_TO_CALCULATOR" },
        { text: "Green Certifications", value: "NAVIGATE_TO_CERTIFICATIONS" },
        { text: "Rewards System", value: "NAVIGATE_TO_REWARDS" },
        { text: "Travel Comparison", value: "NAVIGATE_TO_COMPARISON" }
      ]
    },
    
    // Company and mission
    'about-company': {
      patterns: ['about', 'company', 'mission', 'who are you'],
      response: "We're a sustainable travel platform dedicated to helping travelers reduce their environmental impact while still enjoying amazing experiences. Our mission is to make eco-friendly travel choices easy, accessible, and rewarding!",
    },
    
    // Fallback
    'fallback': {
      response: "I'm sorry, I don't have information on that topic yet. Is there something else about eco-friendly travel I can help you with?",
      options: [
        { text: "Carbon Calculator", value: "NAVIGATE_TO_CALCULATOR" },
        { text: "Green Certifications", value: "NAVIGATE_TO_CERTIFICATIONS" },
        { text: "Rewards System", value: "NAVIGATE_TO_REWARDS" }
      ]
    }
  };
  
  // Navigation intent patterns
  static navigationPatterns = {
    'NAVIGATE_TO_CALCULATOR': [
      'carbon calculator', 
      'calculator', 
      'calculate (my|) (carbon|footprint)',
      'take me to (the|) calculator'
    ],
    'NAVIGATE_TO_CERTIFICATIONS': [
      'certification', 
      'green certification', 
      'eco certification',
      'sustainable places',
      'take me to certification'
    ],
    'NAVIGATE_TO_REWARDS': [
      'rewards', 
      'eco( |-)points',
      'ecocoin',
      'take me to rewards'
    ],
    'NAVIGATE_TO_COMPARISON': [
      'compar(e|ison)', 
      'options',
      'take me to comparison'
    ],
    'NAVIGATE_TO_PROFILE': [
      'profile', 
      'my account',
      'account',
      'take me to (my|) profile'
    ]
  };
  
  // Route mappings for navigation intents
  static routes = {
    'NAVIGATE_TO_CALCULATOR': '/calculator',
    'NAVIGATE_TO_CERTIFICATIONS': '/certifications',
    'NAVIGATE_TO_REWARDS': '/rewards',
    'NAVIGATE_TO_COMPARISON': '/comparison',
    'NAVIGATE_TO_PROFILE': '/profile'
  };
  
  /**
   * Processes a user message and returns an appropriate response
   * @param {string} message - The user's message
   * @returns {Object} Response object with text and optional data
   */
  static processMessage(message) {
    // Check for navigation intents first
    const navigationIntent = this.detectNavigationIntent(message);
    if (navigationIntent) {
      return {
        text: `I'll take you to the ${navigationIntent.split('_').pop().toLowerCase()} page.`,
        action: 'navigate',
        route: this.routes[navigationIntent]
      };
    }
    
    // Check knowledge base for matching patterns
    const intent = this.detectIntent(message);
    if (intent) {
      return {
        text: this.knowledgeBase[intent].response,
        options: this.knowledgeBase[intent].options
      };
    }
    
    // Fallback response if no intent matches
    return {
      text: this.knowledgeBase['fallback'].response,
      options: this.knowledgeBase['fallback'].options
    };
  }
  
  /**
   * Detects the intent of a user message
   * @param {string} message - The user's message
   * @returns {string|null} The detected intent key or null if no match
   */
  static detectIntent(message) {
    const normalizedMessage = message.toLowerCase();
    
    // Try to match against patterns in knowledge base
    for (const [intent, data] of Object.entries(this.knowledgeBase)) {
      if (data.patterns) {
        for (const pattern of data.patterns) {
          const regex = new RegExp(pattern, 'i');
          if (regex.test(normalizedMessage)) {
            return intent;
          }
        }
      }
    }
    
    return null;
  }
  
  /**
   * Detects if the message contains a navigation intent
   * @param {string} message - The user's message
   * @returns {string|null} The navigation intent or null if no match
   */
  static detectNavigationIntent(message) {
    const normalizedMessage = message.toLowerCase();
    
    for (const [intent, patterns] of Object.entries(this.navigationPatterns)) {
      for (const pattern of patterns) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(normalizedMessage)) {
          return intent;
        }
      }
    }
    
    return null;
  }
  
  /**
   * Handles a value from an option selection
   * @param {string} value - The option value
   * @returns {Object} Response object with text and optional data
   */
  static handleOptionSelection(value) {
    // Check if it's a navigation intent
    if (value.startsWith('NAVIGATE_TO_')) {
      return {
        text: `I'll take you to the ${value.split('_').pop().toLowerCase()} page.`,
        action: 'navigate',
        route: this.routes[value]
      };
    }
    
    // Check if it's a query intent
    if (value.startsWith('QUERY_')) {
      const queryIntent = value.replace('QUERY_', '').toLowerCase().replace(/_/g, '-');
      if (this.knowledgeBase[queryIntent]) {
        return {
          text: this.knowledgeBase[queryIntent].response,
          options: this.knowledgeBase[queryIntent].options
        };
      }
    }
    
    return this.processMessage(value);
  }
  
  /**
   * Gets welcome message for first-time users
   * @returns {Object} Welcome message and options
   */
  static getWelcomeMessage() {
    return {
      text: "Hi there! 👋 I'm EcoGuide, your sustainable travel assistant. How can I help you plan your eco-friendly adventure today?",
      options: [
        { text: "How do I earn rewards?", value: "QUERY_ECO_POINTS" },
        { text: "Calculate my carbon footprint", value: "NAVIGATE_TO_CALCULATOR" },
        { text: "What are green certifications?", value: "QUERY_GREEN_CERTIFICATION" }
      ]
    };
  }
  
  /**
   * Performs the actual navigation in the app
   * @param {string} route - The route to navigate to
   */
  static navigateTo(route) {
    if (typeof window !== 'undefined') {
      // For browser environment, use the location API
      window.location.href = route;
    }
    // We'll let the component handle React Router navigation instead
  }
}

export default ChatbotService; 