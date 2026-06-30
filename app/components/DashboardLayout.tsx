'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Danh sách các menu điều hướng của ứng dụng
  const menuItems = [
    { name: 'Học Flashcards', href: '/', icon: '🎴' },
    { name: 'Từ đã thích', href: '/?filter=favorite', icon: '❤️' },
    { name: 'Bảng quản trị', href: '/admin', icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      
      {/* 1. SIDEBAR TRÊN MÁY TÍNH (ẨN TRÊN ĐIỆN THOẠI) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-5 sticky top-0 h-screen">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Học Tiếng Trung 🚀
          </h1>
          <p className="text-xs text-slate-400 mt-1">Phiên bản chuyên nghiệp</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Khu vực thông tin người dùng ở góc dưới Sidebar */}
        <div className="border-t border-slate-100 pt-4 mt-auto flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            U
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Người dùng</p>
            <p className="text-xs text-slate-400">free_account</p>
          </div>
        </div>
      </aside>

      {/* 2. MENU DI ĐỘNG (NAVBAR TRÊN ĐIỆN THOẠI) */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
          <h1 className="text-lg font-bold text-blue-600">Học Tiếng Trung 🚀</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xl"
          >
            ☰
          </button>
        </header>

        {/* Sidebar dạng trượt dành riêng cho thiết bị di động */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            <div className="relative w-64 max-w-sm bg-white p-5 flex flex-col h-full shadow-xl animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-slate-800">Menu ứng dụng</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
              </div>
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* 3. KHU VỰC CHỨA NỘI DUNG CHÍNH (MAIN CONTENT) */}
        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}