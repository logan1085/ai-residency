import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Spectral } from "next/font/google";
import "./globals.css";

// Serif carries the whole document: display and body alike.
const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

// Sans is reserved for small tracked-caps labels.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Mono only for numeric and equation data.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Policy Iteration: An Interactive Walkthrough",
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
      className={`${spectral.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="tl-masthead">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 pt-8 pb-2">
            <span
              className="tl-eyebrow"
              style={{ color: "var(--tl-ink)", letterSpacing: "0.2em" }}
            >
              AI Research Residency
            </span>
            <a
              className="tl-eyebrow"
              href="https://www.loganzev.com/ai-research-residency"
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
