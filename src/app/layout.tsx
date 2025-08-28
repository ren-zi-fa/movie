import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SecondNavbar from "@/components/SecondNavbar";
import { ThemeProvider } from "@/components/Theme-Provider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bajakin",
  description: "created by renzi febriandika",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics - gunakan lazyOnload untuk menghindari hydration issues */}
                <meta name="google-site-verification" content="dEZvLlndNL1OhSWrO512KFXi1Tqx_2HU4kvI5LReMEg" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class">
          <div className="fixed top-0 left-0 right-0 z-30">
            <Navbar />
            <SecondNavbar />
          </div>

          <main className="pt-[130px]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
