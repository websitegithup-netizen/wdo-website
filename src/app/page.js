import HomeClient from './HomeClient'

export const metadata = {
  title: 'Waqal Development Organization (WDO) | Somaliland NGO',
  description: 'WDO is a nonprofit organization dedicated to empowering Somaliland through education, healthcare, youth development, and environmental sustainability. Join our mission today.',
  keywords: 'WDO, Waqal Development Organization, Somaliland NGO, Gabiley, Education Somaliland, Healthcare Somaliland, Youth Development Somaliland, Environmental Sustainability Somaliland',
  openGraph: {
    title: 'Waqal Development Organization (WDO)',
    description: 'Empowering Somaliland communities through sustainable development.',
    images: ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070'],
    type: 'website',
  },
}

export default function Home() {
  return <HomeClient />
}
