import { getPortfolioImages } from '@/lib/portfolio.mjs'
import PortfolioGallery from '@/components/PortfolioGallery'
import PageIntro from '@/components/PageIntro'
import BookingCTA from '@/components/BookingCTA'

export const metadata = {
  title: 'Portfolio',
  description: 'Tattoo, piercing and beauty work from ROYAL Multiskill Hub.',
}

export default async function PortfolioPage() {
  const images = await getPortfolioImages()

  return (
    <>
      <PageIntro
        eyebrow="Portfolio"
        title="Our work."
        description="Tattoo, piercing and beauty, from our studio."
      />
      <PortfolioGallery images={images} />
      <BookingCTA title="Make it yours." />
    </>
  )
}
