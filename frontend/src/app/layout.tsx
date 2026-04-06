import type { Metadata } from "next";
import { Archivo_Black, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const archivoDisplay = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Voz Clone",
    template: "%s · Voz Clone",
  },
  description: "Diễn đàn — giao diện thử nghiệm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${jetbrainsMono.variable} ${archivoDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
