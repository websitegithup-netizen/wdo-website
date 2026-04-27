import TeamClient from './TeamClient'

export const metadata = {
  title: 'Our Team | Waqal Development Organization (WDO)',
  description: 'Meet the dedicated professionals and activists driving social impact and sustainable development in Somaliland. Join WDO\'s mission.',
  openGraph: {
    title: 'Our Team | WDO Somaliland',
    description: 'The experts and activists behind Waqal Development Organization.',
    images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071'],
  },
}

export default function TeamPage() {
  return <TeamClient />
}
