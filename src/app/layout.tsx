import type { Metadata } from "next";
import { Public_Sans, Lora } from "next/font/google";
import "regenerator-runtime/runtime";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import { PlanSwitcherProvider } from "@/components/layout/PlanSwitcherContext";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SideQuest",
  description:
    "SideQuest helps you master any hobby by focusing on the most impactful techniques. No information overload, just focused learning.",
  keywords: ["learning", "hobby", "mastery", "techniques", "focused learning"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${publicSans.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <PlanSwitcherProvider>
            {children}
          </PlanSwitcherProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
