import BookingForm from '@/components/BookingForm'
import PageIntro from '@/components/PageIntro'

export const metadata = {
  title: 'Book your visit',
  description: 'Request a tattoo, piercing or beauty appointment at Royal Multiskill Hub. Choose a one-hour slot from 10 AM to 8 PM.',
}

export default function BookPage() {
  return (
    <div className="min-h-screen">
      <PageIntro eyebrow="Appointments" title="Book your visit" description="Tattoo, piercing and beauty. Choose your service and time." />
      <section className="section-space">
        <div className="studio-container">
          <div className="mx-auto max-w-2xl"><BookingForm /></div>
        </div>
      </section>
    </div>
  )
}
