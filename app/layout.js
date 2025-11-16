import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";
import Providers from "./providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: "The Pizza Unlimited",
  description:
    "Order delicious pizzas, track orders, reserve tables, and enjoy fast service at Pizza Unlimited.",
  keywords: ["pizza", "restaurant", "food delivery", "order food"],
  icons: "/favicon.ico",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <Providers>
            
            {/* ✅ Add Toaster here */}
            <Toaster position="bottom-right" duration={2500} />

            <Navbar />
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
