import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import { portfolio, site } from "@/lib/portfolio";
import "./globals.css";

const name =
  `${portfolio.profile.firstName} ${portfolio.profile.lastName}`.trim();
export const metadata: Metadata = {
  title: `${name} — Portfolio`,
  description: portfolio.profile.summary || site.description,
  openGraph: {
    title: `${name} — Portfolio`,
    description: portfolio.profile.summary || site.description,
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
