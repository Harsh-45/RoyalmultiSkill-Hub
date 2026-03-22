export const portfolioImages = [
  // Tattoo
  {
    src: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800',
    alt: 'Minimal line tattoo',
    title: 'Minimal Line Art',
    category: 'Tattoo',
    theme: 'tattoo',
  },
  {
    src: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=800',
    alt: 'Geometric tattoo',
    title: 'Geometric Design',
    category: 'Tattoo',
    theme: 'tattoo',
  },
  {
    src: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800',
    alt: 'Small symbol tattoo',
    title: 'Symbolic Minimal',
    category: 'Tattoo',
    theme: 'tattoo',
  },
  {
    src: 'https://images.unsplash.com/photo-1590246814883-57c511a8c4b9?w=800',
    alt: 'Portrait tattoo',
    title: 'Realistic Portrait',
    category: 'Tattoo',
    theme: 'tattoo',
  },
  {
    src: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800',
    alt: 'Face portrait tattoo',
    title: 'Detailed Portrait',
    category: 'Tattoo',
    theme: 'tattoo',
  },
  {
    src: 'https://images.unsplash.com/photo-1611195974226-ef4f6ab0f3ac?w=800',
    alt: 'Traditional tattoo',
    title: 'Traditional Style',
    category: 'Tattoo',
    theme: 'tattoo',
  },
  {
    src: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800',
    alt: 'Classic tattoo design',
    title: 'Classic Design',
    category: 'Tattoo',
    theme: 'tattoo',
  },

  // Beauty - Bridal
  {
    src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
    alt: 'Bridal makeup',
    title: 'Bridal Elegance',
    category: 'Bridal',
    theme: 'beauty',
  },
  {
    src: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800',
    alt: 'Wedding makeup',
    title: 'Wedding Glam',
    category: 'Bridal',
    theme: 'beauty',
  },
  {
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    alt: 'Bridal look',
    title: 'Royal Bridal',
    category: 'Bridal',
    theme: 'beauty',
  },

  // Beauty - Makeup
  {
    src: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800',
    alt: 'Professional makeup',
    title: 'Glamour Makeup',
    category: 'Makeup',
    theme: 'beauty',
  },
  {
    src: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
    alt: 'Party makeup',
    title: 'Party Ready',
    category: 'Makeup',
    theme: 'beauty',
  },

  // Beauty - Hair
  {
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    alt: 'Hair transformation',
    title: 'Hair Transformation',
    category: 'Hair',
    theme: 'beauty',
  },
  {
    src: 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=800',
    alt: 'Facial treatment result',
    title: 'Facial Glow Up',
    category: 'Facial',
    theme: 'beauty',
  },
]

export const categories = [
  'All',
  'Tattoo',
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

