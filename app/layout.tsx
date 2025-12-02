import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "R2 System Solution | Website Design, IT Support, Cybersecurity & Tech Consulting",
  description:
    "R2 System Solution provides professional website design, managed IT support, cybersecurity services, cloud solutions, and technology consulting in the UK and beyond. We help businesses stay secure, efficient, and digitally transformed.",
  keywords: [
    "R2 System Solution",
    "IT Support UK",
    "Managed IT Services",
    "Cybersecurity Services",
    "Website Design UK",
    "Web Development Agency",
    "IT Consultancy",
    "Cloud Solutions",
    "Digital Transformation",
    "Business Technology",
  ],
  openGraph: {
    title: "R2 System Solution | IT Support, Web Design & Cybersecurity",
    description:
      "Professional IT solutions, website design, cybersecurity, and technology consulting for modern businesses.",
    url: "https://blog.r2systemsolution.co.uk",
    siteName: "R2 System Solution",
    images: [
      {
        url: "https://blog.r2systemsolution.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "R2 System Solution - IT & Web Services",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "R2 System Solution | Website Design, IT Support & Cybersecurity",
    description:
      "Expert IT support, secure infrastructure, website design, and business tech solutions.",
    images: ["https://blog.r2systemsolution.co.uk/og-image.png"],
  },
  authors: [{ name: "R2 System Solution" }],
  creator: "R2 System Solution",
  publisher: "R2 System Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
