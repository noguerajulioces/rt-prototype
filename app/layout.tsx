import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/components/LocaleContext";
import { SettingsProvider } from "@/components/SettingsContext";
import { ReplayProvider } from "@/components/ReplayContext";
import { race } from "@/lib/mock-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nekrotrail 2026 · RaceTracker",
  description: "Seguimiento en vivo de Nekrotrail 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={race.defaultLocale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-background text-foreground overflow-hidden">
        <ThemeProvider>
          <LocaleProvider defaultLocale={race.defaultLocale}>
            <SettingsProvider>
              <ReplayProvider>
                <TooltipProvider delayDuration={200}>
                  {children}
                </TooltipProvider>
              </ReplayProvider>
            </SettingsProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
