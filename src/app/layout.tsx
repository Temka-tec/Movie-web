import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MovieZ",
  description: "Movie website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="white">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Suspense fallback={null}>
            <Header />
          </Suspense>

          {children}

          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
