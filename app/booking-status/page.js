import BookingStatus from '@/components/BookingStatus'
import PageIntro from '@/components/PageIntro'

export const metadata = {
  title: 'Booking status',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

export default function BookingStatusPage() {
  return (
    <div className="min-h-screen">
      <PageIntro eyebrow="Your appointment" title="Booking status" />
      <section className="section-space">
        <div className="studio-container"><div className="mx-auto max-w-2xl"><BookingStatus /></div></div>
      </section>
    </div>
  )
}
