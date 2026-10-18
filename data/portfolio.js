export const portfolioImages = [
  // Tattoo
  {
    src: '/tattoo-studio.jpg',
    alt: 'Large black and grey traditional tattoo across a shoulder and back',
    title: 'Traditional Composition',
    category: 'Tattoo',
    theme: 'tattoo',
  },
  {
    src: '/gallery/tattoo-geometric.jpg',
    alt: 'Detailed floral tattoo on an upper arm',
    title: 'Floral Composition',
    category: 'Tattoo',
    theme: 'tattoo',
  },
  {
    src: '/gallery/tattoo-symbol.jpg',
    alt: 'A gloved tattoo artist working on a forearm design',
    title: 'In the Making',
    category: 'Tattoo',
    theme: 'tattoo',
  },

  // Beauty - Bridal
  {
    src: '/gallery/beauty-bridal.jpg',
    alt: 'Lip colour being applied to a makeup look with winged eyeliner',
    title: 'Bridal Makeup Details',
    category: 'Bridal',
    theme: 'beauty',
  },
  {
    src: '/gallery/beauty-wedding.jpg',
    alt: 'Portrait of a woman with voluminous natural curly hair',
    title: 'Natural Texture',
    category: 'Hair',
    theme: 'beauty',
  },
  {
    src: '/gallery/beauty-royal.jpg',
    alt: 'Long wavy hair viewed from behind',
    title: 'Long Hair Styling',
    category: 'Hair',
    theme: 'beauty',
  },

  // Beauty - Makeup
  {
    src: '/gallery/beauty-makeup.jpg',
    alt: 'Makeup brushes and cosmetics arranged on a dressing table',
    title: 'Tools of the Trade',
    category: 'Makeup',
    theme: 'beauty',
  },
  {
    src: '/gallery/beauty-party.jpg',
    alt: 'Eye shadow palette, lip colours and cosmetic brushes',
    title: 'A Study in Colour',
    category: 'Makeup',
    theme: 'beauty',
  },

  // Beauty - Hair
  {
    src: '/gallery/beauty-hair.jpg',
    alt: 'Black and white reference photograph of a hair salon interior',
    title: 'The Salon Mood',
    category: 'Hair',
    theme: 'beauty',
  },
  {
    src: '/gallery/beauty-facial.jpg',
    alt: 'A woman wearing hair rollers and white sunglasses',
    title: 'Retro Styling Mood',
    category: 'Hair',
    theme: 'beauty',
  },
  {
    src: '/gallery/beauty-facial-treatment.jpg',
    alt: 'A facial mask being applied with a brush during a skincare treatment',
    title: 'Skincare Ritual',
    category: 'Facial',
    theme: 'beauty',
  },
]

export const categories = [
  'All',
  'Tattoo',
  'Piercing',
  'Bridal',
  'Makeup',
  'Hair',
  'Facial',
]

export const getImagesByCategory = (category) => {
  if (category === 'All') return portfolioImages
  return portfolioImages.filter((img) => img.category === category)
}

export const getImagesByTheme = (theme) => {
  return portfolioImages.filter((img) => img.theme === theme)
}

