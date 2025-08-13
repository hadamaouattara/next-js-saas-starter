import './globals.css'

export const metadata = {
  title: 'Exonov Quantum',
  description: 'Advanced AI & Quantum Computing Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
