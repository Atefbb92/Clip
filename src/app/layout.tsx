import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsProvider } from "@/providers/nuqs-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TRPCProvider } from "@/providers/trpc-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diamond - Orthodontic Management",
  description: "Professional orthodontic practice management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className} suppressHydrationWarning={true}>
        <TRPCProvider>
          <LanguageProvider>
            <NuqsProvider>
              {children}
            </NuqsProvider>
          </LanguageProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}