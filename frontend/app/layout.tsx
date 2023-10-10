import "./globals.css";
import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
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
        className={`bg-dark ${font.className} text-gray-400 text-sm tracking-wide`}
      >
        <NextTopLoader showSpinner={false} height={2} color="#C2C4C0" />
        {children}
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          // autoClose={false}
          theme="dark"
          draggable={false}
          closeButton={<X className="text-gray-500" size={15} />}
        />
      </body>
    </html>
  );
}
