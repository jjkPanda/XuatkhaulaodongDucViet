import type React from "react"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _openSans = Open_Sans({ subsets: ["latin", "vietnamese"] })

export const metadata: Metadata = {
  title: "Xuất Khẩu Lao động Đức 2025 | Thu nhập cao, Phúc lợi tốt, Định cư lâu dài",
  description:
    "Chương trình xuất khẩu lao động Đức uy tín. Thu nhập từ 25-40 triệu/tháng, phúc lợi châu Âu, cơ hội định cư. Đăng ký tư vấn miễn phí ngay!",
  generator: "v0.app",
  keywords: [
    "xuất khẩu lao động Đức",
    "visa Đức",
    "làm việc ở Đức",
    "lương cao Đức",
    "visa blue card",
    "định cư Đức",
    "công việc châu Âu",
    "tuyển dụng lao động nước ngoài",
    "cơ hội làm việc Đức",
    "phúc lợi Đức",
  ].join(", "),
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://xuatkhaoduc.com",
    siteName: "Xuất Khẩu Lao động Đức",
    title: "Xuất Khẩu Lao động Đức 2025 - Thu nhập cao, Phúc lợi tốt",
    description: "Cơ hội công việc với mức lương 25-40 triệu/tháng và phúc lợi tốt tại Đức",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Xuất Khẩu Lao động Đức",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xuất Khẩu Lao động Đức 2025",
    description: "Thu nhập 25-40 triệu/tháng, phúc lợi châu Âu, cơ hội định cư",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://xuatkhaoduc.com",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
