import './globals.css'
import ClientLayout from './ClientLayout'

export const metadata = {
  title: 'Waqal Development Organization (WDO)',
  description: 'Empowering communities in Somaliland through education, health, youth, and environmental programs.',
  icons: {
    icon: [
      { url: '/logo.png?v=3' },
      { url: '/favicon.png?v=3' }
    ],
    apple: '/logo.png?v=3',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
