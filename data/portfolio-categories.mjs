export const portfolioCategoryDefinitions = [
  { label: 'Tattoo', directory: 'tattoo', theme: 'tattoo' },
  { label: 'Piercing', directory: 'piercing', theme: 'piercing' },
  { label: 'Bridal', directory: 'beauty/bridal', theme: 'beauty' },
  { label: 'Makeup', directory: 'beauty/makeup', theme: 'beauty' },
  { label: 'Hair', directory: 'beauty/hair', theme: 'beauty' },
  { label: 'Facial', directory: 'beauty/facial', theme: 'beauty' },
  { label: 'Waxing', directory: 'beauty/waxing', theme: 'beauty' },
  { label: 'Threading', directory: 'beauty/threading', theme: 'beauty' },
]

export const categories = ['All', ...portfolioCategoryDefinitions.map(({ label }) => label)]
