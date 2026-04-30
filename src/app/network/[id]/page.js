import EventDetailClient from './EventDetailClient'

export async function generateMetadata({ params }) {
  return {
    title: `Event Detail | WDO`,
    description: 'Detailed information about Waqal Development Organization events and impact.'
  }
}

export default function EventPage() {
  return <EventDetailClient />
}
