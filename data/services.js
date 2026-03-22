export const servicesData = {
  waxing: {
    title: "Waxing",
    icon: "✨",
    theme: "beauty",
    services: [
      { name: "Upper Lips", price: "₹50" },
      { name: "Face Wax", price: "₹100" },
      { name: "Underarms", price: "₹100" },
      { name: "Half Hand", price: "₹150" },
      { name: "Full Hand", price: "₹200" },
      { name: "Half Legs", price: "₹250" },
      { name: "Full Legs", price: "₹500" },
      { name: "Full Back", price: "₹100" },
      { name: "Stomach", price: "₹100" },
      { name: "Half Body", price: "₹1000" },
      { name: "Full Body", price: "₹1500" },
    ],
  },
  threading: {
    title: "Threading",
    icon: "🧵",
    theme: "beauty",
    services: [
      { name: "Eyebrows", price: "₹30" },
      { name: "Forehead", price: "₹10" },
      { name: "Chin", price: "₹10" },
      { name: "Uplips", price: "₹10" },
      { name: "Full Face", price: "₹100" },
    ],
  },
  hairServices: {
    title: "Hair Services",
    icon: "💇",
    theme: "beauty",
    services: [
      { name: "Hair Wash with Conditioner", price: "₹100" },
      { name: "Child Hair Cutting", price: "₹99" },
      { name: "Haircut without Blow Dry", price: "₹99" },
      { name: "Haircut with Blow Dry", price: "₹150" },
      { name: "Haircut with Layers", price: "₹200" },
      { name: "Signature Cut", price: "₹300" },
      { name: "Multi Layer (90°)", price: "₹400" },
      { name: "Advance Haircut with Foam", price: "₹500" },
    ],
  },
  hairColour: {
    title: "Hair Colour",
    icon: "🎨",
    theme: "beauty",
    services: [
      { name: "Rough Touch", price: "₹200–500" },
      { name: "Heena Colour", price: "₹300–700" },
      { name: "Professional Colour", price: "₹1000 (As per client)" },
      { name: "Highlight Streak", price: "Starting ₹1500" },
      { name: "Global Colour", price: "₹1500" },
    ],
  },
  hairChemical: {
    title: "Hair Chemical Treatments",
    icon: "⚗️",
    theme: "beauty",
    services: [
      { name: "Hair Wash with Conditioner", price: "₹300" },
      { name: "Protein Treatment", price: "₹1000" },
      { name: "Spa Treatment", price: "₹500" },
      { name: "Straightening", price: "₹2000" },
      { name: "Smoothing", price: "₹2500" },
      { name: "Keratin", price: "₹3000" },
      { name: "Rebonding", price: "₹3000" },
      { name: "Botox Treatment", price: "₹4000" },
      { name: "Deno Plastia", price: "₹25000" },
    ],
  },
  additionalHair: {
    title: "Additional Hair Services",
    icon: "💫",
    theme: "beauty",
    services: [
      { name: "Hair Ironing", price: "₹300 (Depends on Length)" },
      { name: "Curls Hair", price: "₹300 (Depends on Length)" },
      { name: "Blow Dry", price: "₹200" },
      { name: "Dry-Dry Curls", price: "₹300" },
    ],
  },
  faceCare: {
    title: "Face Care",
    icon: "🌸",
    theme: "beauty",
    services: [
      { name: "Cleaning", price: "₹100" },
      { name: "Steam & Scrub", price: "₹300" },
      { name: "Cleanup", price: "₹300" },
      { name: "Herbal Facial", price: "₹350" },
      { name: "Royal Facial", price: "₹800" },
      { name: "Fruit Facial", price: "₹400" },
      { name: "Fairness Facial", price: "₹700" },
      { name: "Aroma Facial", price: "₹800" },
      { name: "Diamond Facial", price: "₹1000" },
      { name: "Shahnaz Facial", price: "₹1100" },
      { name: "Hydra Facial", price: "₹2000" },
      { name: "O3+ Facial", price: "₹1000" },
      { name: "Korean Facial", price: "₹1500" },
      { name: "Gold Facial", price: "₹500" },
    ],
  },
  tattoo: {
    title: "Tattoo Pricing",
    icon: "🖋️",
    theme: "tattoo",
    services: [
      { name: "Custom Tattoo", price: "₹400 per inch", featured: true },
    ],
    description: "Professional custom tattoos with premium quality ink and hygiene standards.",
  },
};

export const getCategoriesByTheme = (theme) => {
  return Object.entries(servicesData)
    .filter(([_, category]) => category.theme === theme)
    .map(([key, category]) => ({ key, ...category }));
};

export const getAllCategories = () => {
  return Object.entries(servicesData).map(([key, category]) => ({
    key,
    ...category,
  }));
};

