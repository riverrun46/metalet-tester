import '../globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }]
}

export const metadata: Metadata = {
  title: 'Metalet Tester',
  description: 'Metalet钱包API测试',
}

export default async function RootLayout({ children, params: { locale } }: { children: React.ReactNode; params: any }) {
  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
