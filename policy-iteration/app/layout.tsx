import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Policy Iteration — Interactive Walkthrough",
  description:
    "An interactive visualization of the Policy Iteration algorithm for dynamic programming in reinforcement learning, based on George A. Lentzas's example.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="tl-masthead">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3">
            <span className="tl-eyebrow" style={{ color: "#ffffff" }}>
              AI Research Residency
            </span>
            <a
              className="tl-eyebrow"
              href="https://logan1085.github.io/ai-residency/"
            >
              Curriculum &#8599;
            </a>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
