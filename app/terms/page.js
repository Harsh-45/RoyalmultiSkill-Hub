import Link from 'next/link'
import PageIntro from '@/components/PageIntro'

export const metadata = { title: 'Website terms', description: 'Appointment requests, portfolio photos and Google service information.' }

export default function TermsPage() {
  return (
    <>
      <PageIntro eyebrow="Website information" title="Website terms" description="Using this website and its appointment services." />
      <section className="section-space">
        <div className="studio-container mx-auto max-w-3xl space-y-8 text-sm leading-7 text-muted">
          <div><h2 className="mb-3 font-display text-3xl text-paper">Booking a visit</h2><p>Submitting an appointment is a request. The studio confirms your time after owner approval. Check your private status link or My requests for the decision. Discuss final service details, suitability and pricing with the studio.</p></div>
          <div><h2 className="mb-3 font-display text-3xl text-paper">Portfolio photos</h2><p>Portfolio photos are provided by Royal Multiskill Hub. Contact the studio before reusing its work or photographs.</p></div>
          <div><h2 className="mb-3 font-display text-3xl text-paper">Google Maps and reviews</h2><p>Google Maps content, when displayed, is provided under the <a href="https://maps.google.com/help/terms_maps/" target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4">Google Maps and Google Earth Additional Terms of Service</a>. Links to read or write reviews open Google’s website, where Google’s terms apply. Reviews reflect the reviewers’ own experiences.</p></div>
          <p>Read our <Link href="/privacy" className="text-gold underline underline-offset-4">privacy information</Link> or <Link href="/contact" className="text-gold underline underline-offset-4">contact the studio</Link> with questions.</p>
        </div>
      </section>
    </>
  )
}
