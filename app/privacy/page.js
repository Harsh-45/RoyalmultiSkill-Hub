import Link from 'next/link'
import PageIntro from '@/components/PageIntro'
import siteConfig from '@/config/site'

export const metadata = { title: 'Privacy', description: 'How Royal Multiskill Hub uses appointment details and website services.' }

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Website information" title="Privacy" description="Your appointment details and the services this website uses." />
      <section className="section-space">
        <div className="studio-container mx-auto max-w-3xl space-y-8 text-sm leading-7 text-muted">
          <div><h2 className="mb-3 font-display text-3xl text-paper">Appointment requests</h2><p>We collect the name, phone number, service, appointment time and notes you submit so the studio can review and manage your request. The owner can view these details. Booking records are scheduled for deletion three days after the appointment ends.</p></div>
          <div><h2 className="mb-3 font-display text-3xl text-paper">Saved requests</h2><p>This browser saves private booking links and appointment status for My requests. It does not save your name, phone number or notes in that list. You can remove individual saved links or clear your browser data. Anyone with a private booking link can view that appointment’s status.</p></div>
          <div><h2 className="mb-3 font-display text-3xl text-paper">Google services</h2><p>This website uses Google Fonts and may display a Google Maps embed. These services can receive network and device information when your browser loads their content. Review links open the studio’s listing or review form on Google. Google explains its practices in the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4">Google Privacy Policy</a>.</p></div>
          <div><h2 className="mb-3 font-display text-3xl text-paper">WhatsApp and external links</h2><p>Choosing Send on WhatsApp opens a prepared message. You decide whether to send it. WhatsApp, Google and other external services apply their own privacy policies when you use them.</p></div>
          <div><h2 className="mb-3 font-display text-3xl text-paper">Contact the studio</h2><p>For questions about your appointment details, <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`} className="text-gold underline underline-offset-4">call {siteConfig.contact.phone}</a> or <Link href="/contact" className="text-gold underline underline-offset-4">contact the studio</Link>.</p></div>
        </div>
      </section>
    </>
  )
}
