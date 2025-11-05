import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Assistant } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import GlobalProvider from "@/components/Application/GlobalProvider";
import Script from "next/script";

const assistantFont = Assistant({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap'
})

export const metadata = {
  title: "La Klosette",
  description: "A brand that you must wear",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://cdn.lordicon.com/lordicon.js" />
      </head>
      <body
        className={`${assistantFont.className} antialiased`}
      >
        <GlobalProvider>

          <ToastContainer />
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
