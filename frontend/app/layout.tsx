import "./globals.css";
import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";

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
        className={`bg-dark ${font.className} text-gray-300 text-sm tracking-wide`}
      >
        {children}
      </body>
    </html>
  );
}
