import "./globals.css";

import type { Metadata } from "next";
import { ToastContainer } from "./lib/Toast";
import { Titillium_Web } from "next/font/google";

import NextTopLoader from "nextjs-toploader";

const font = Titillium_Web({
  weight: ["200", "300", "400", "600", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PingPong",
  description: "PingPong game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${font.className} text-gray-400 text-sm tracking-wide overflow-hidden`}
      >
        <NextTopLoader showSpinner={false} height={2} color="#C2C4C0" />
        {children}
        <ToastContainer />
        {/* <ToastContainer
          position="bottom-right"
          hideProgressBar
          // autoClose={false}
          theme="dark"
          draggable={false}
        /> */}
      </body>
    </html>
  );
}
