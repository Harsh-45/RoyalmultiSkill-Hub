import MyRequests from '@/components/MyRequests'
import PageIntro from '@/components/PageIntro'

export const metadata = {
  title: 'My requests',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

export default function MyRequestsPage() {
  return (
    <div className="min-h-screen">
      <PageIntro eyebrow="Your appointments" title="My requests" description="Your saved requests in this browser. No sign-in needed." />
      <section className="section-space">
        <div className="studio-container"><div className="mx-auto max-w-4xl"><MyRequests /></div></div>
      </section>
    </div>
  )
}
