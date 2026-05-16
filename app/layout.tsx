import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/components/LocaleContext";
import { SettingsProvider } from "@/components/SettingsContext";
import { ReplayProvider } from "@/components/ReplayContext";
import { CourseProvider } from "@/components/CourseContext";
import { race } from "@/lib/mock-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-background text-foreground overflow-hidden">
        <ThemeProvider>
          <LocaleProvider defaultLocale={race.defaultLocale}>
            <SettingsProvider>
              <ReplayProvider>
                <CourseProvider courses={race.courses}>
                  <TooltipProvider delayDuration={200}>
                    {children}
                  </TooltipProvider>
                </CourseProvider>
              </ReplayProvider>
            </SettingsProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
