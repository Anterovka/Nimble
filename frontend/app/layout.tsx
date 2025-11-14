import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "./LenisProvider";
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Nimble — Конструктор одностраничных сайтов без кода",
  description: "Создавай одностраничные сайты без кода за 5 минут. Визуальный редактор с drag & drop, публикация в один клик, без навыков программирования",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
