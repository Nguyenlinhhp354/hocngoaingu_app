import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Ứng dụng Học Tiếng Trung',
  description: 'Website học từ vựng hiệu quả',
  icons: {
    icon: '/favicon.ico', // Đảm bảo đường dẫn này trỏ đúng đến file trong public
  },
};

// app/layout.tsx

import './globals.css';
import DashboardLayout from './components/DashboardLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        {/* Bộ khung mới sẽ tự động áp dụng cho tất cả các trang / và /admin */}
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}