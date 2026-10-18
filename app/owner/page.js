import OwnerDashboard from '@/components/OwnerDashboard'

export const metadata = {
  title: 'Owner dashboard | Royal Multiskill Hub',
  description: 'Private appointment management for Royal Multiskill Hub.',
  robots: { index: false, follow: false, nocache: true },
}

export default function OwnerPage() {
  return <OwnerDashboard />
}
