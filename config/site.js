// ============================================
// ROYAL MULTISKILL HUB - SITE CONFIGURATION
// ============================================
// UPDATE ALL YOUR BUSINESS DETAILS HERE
// This is the ONLY file you need to edit for contact information
// ============================================

export const siteConfig = {
  // Business Information
  businessName: "Royal Multiskill Hub",
  tagline: "Ink • Beauty • Confidence",
  description: "Premium tattoo studio and beauty parlour offering professional services in tattoos, hair care, facials, and beauty treatments.",
  
  // Contact Information
  contact: {
    // WhatsApp (Format: Country code + number, no spaces or +)
    whatsapp: "917264939526",
    
    // Phone (Display format with spaces)
    phone: "+91 72649 39526",
    
    // Email
    email: "shraddhakopre123@gmil.com",
    
    // Instagram (username only, without @)
    instagram: "royalmultiskill_hub",
    
    // Facebook (optional - leave empty if not used)
    facebook: "",
    
    // YouTube (optional - leave empty if not used)
    youtube: "",
  },
  
  // Business Address
  address: {
    street: "Natraj Marg",
    area: "Gandhi Chowk",
    city: "Amgaon",
    state: "Maharashtra",
    pincode: "441902",
    country: "India",
    
    // Full address (auto-generated from above)
    get full() {
      return `${this.street}, ${this.area}, ${this.city}, ${this.state} - ${this.pincode}`;
    },
    
    // Short address for display
    get short() {
      return `${this.area}, ${this.city}`;
    }
  },
  
  // Google Maps
  maps: {
    // Get embed URL from: https://www.google.com/maps
    // Click Share → Embed a map → Copy the src URL from iframe
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3715.412321757479!2d80.37872137528842!3d21.373663680363375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a2bb90c70d11665%3A0x4485a338fbe23260!2sNew%20Royal%20Beauty%20Salon%20%26%20Tattoo%20Studio!5e0!3m2!1sen!2sin!4v1774171874761!5m2!1sen!2sin",
    
    // Direct Google Maps link (for "Get Directions" button)
    directionsUrl: "https://maps.app.goo.gl/gLEufXwxakBA8k4K8",
  },
  
  // Business Hours
  hours: {
    weekdays: {
      days: "Monday - Saturday",
      time: "10:00 AM - 8:00 PM"
    },
    weekend: {
      days: "Sunday",
      time: "11:00 AM - 6:00 PM"
    },
    note: "Walk-ins welcome, but appointments are recommended"
  },
  
  // Social Media Links (Full URLs)
  social: {
    get instagram() {
      return siteConfig.contact.instagram 
        ? `https://instagram.com/${siteConfig.contact.instagram}` 
        : "";
    },
    get facebook() {
      return siteConfig.contact.facebook 
        ? `https://facebook.com/${siteConfig.contact.facebook}` 
        : "";
    },
    get youtube() {
      return siteConfig.contact.youtube 
        ? `https://youtube.com/@${siteConfig.contact.youtube}` 
        : "";
    },
  },
  
  // WhatsApp Message Templates
  whatsapp: {
    // Default message
    defaultMessage: "Hi! I want to book an appointment for Tattoo or Beauty Service",
    
    // Service inquiry message
    serviceMessage: (serviceName) => 
      `Hi! I want to know more about ${serviceName}`,
    
    // Contact form message
    contactMessage: (name, phone, message) => 
      `Hi! I'm ${name}. Phone: ${phone}. Message: ${message}`,
    
    // Get WhatsApp URL
    getUrl: (message = siteConfig.whatsapp.defaultMessage) => 
      `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`,
  },
  
  // SEO & Meta Information
  seo: {
    keywords: "tattoo, beauty parlour, hair salon, facial, waxing, threading, hair color, tattoo studio, beauty services",
    author: "Royal Multiskill Hub",
    ogImage: "/og-image.jpg", // Add your Open Graph image to public folder
  },
  
  // Statistics (for About page)
  stats: {
    clients: "1000+",
    experience: "5+",
    tattoos: "500+",
    satisfaction: "100%"
  },
  
  // Website URL (update after deployment)
  url: "https://royalmultiskillhub.com",
}

// Helper function to get WhatsApp link
export const getWhatsAppLink = (message) => {
  return siteConfig.whatsapp.getUrl(message);
}

// Helper function to get social media links
export const getSocialLinks = () => {
  return {
    instagram: siteConfig.social.instagram,
    facebook: siteConfig.social.facebook,
    youtube: siteConfig.social.youtube,
  };
}

// Export individual items for convenience
export const {
  businessName,
  tagline,
  description,
  contact,
  address,
  maps,
  hours,
  social,
  whatsapp,
  seo,
  stats,
  url,
} = siteConfig;

export default siteConfig;

