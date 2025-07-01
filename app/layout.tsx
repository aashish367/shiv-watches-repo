import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QuoteProvider } from "@/contexts/QuoteContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shiv Watches - Wholesale Watch Accessories & Clocks',
  description: 'Your trusted wholesale partner for watches, clocks, and home appliances at competitive prices.',
   icons: {
    icon: "/images/fevicon.png", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <QuoteProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster position="top-right" />
            </QuoteProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}