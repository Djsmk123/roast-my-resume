import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roast My Resume",
  description: "Roast My Resume is a tool that uses AI to roast your resume and linkedin profile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body className={inter.className}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
