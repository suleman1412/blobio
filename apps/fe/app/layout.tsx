import type { Metadata } from "next";
import { Jersey_25, Pixelify_Sans, Press_Start_2P, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const spaceGro = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jersey25 = Jersey_25({
  variable: "--font-jersey",
  weight: ['400'],
  subsets: ['latin']
})

const p2pfont = Press_Start_2P({
  variable: "--font-press-start",
  weight: '400',
  subsets: ['latin']
})

const pixelifySans = Pixelify_Sans({
  variable: '--font-pixelify-sans',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Blob.io: Retro Themed Agario",
  description: "Blob.io: Retro Themed Agario",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body
          className={`${p2pfont.variable} ${pixelifySans.variable} ${spaceGro.variable} ${jersey25.variable} antialiased`}
        >
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
