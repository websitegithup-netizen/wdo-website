import NewsClient from './NewsClient'

export const metadata = {
  title: 'WDO News & Updates | Latest Stories from Somaliland',
  description: 'Explore the latest news, success stories, and project updates from Waqal Development Organization (WDO) in Somaliland.',
  openGraph: {
    title: 'WDO News & Updates',
    description: 'Impact stories and community news from Waqal Development Organization.',
    images: ['https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070'],
    type: 'article',
  },
}

export default function NewsPage() {
  return <NewsClient />
}
