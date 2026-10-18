import HomePage from '@/components/HomePage'
import ReviewsSection from '@/components/ReviewsSection'
import { getPortfolioImages } from '@/lib/portfolio.mjs'

export default async function Home() {
  const portfolioImages = await getPortfolioImages()
  return <HomePage portfolioImages={portfolioImages} reviewsSection={<ReviewsSection />} />
}
