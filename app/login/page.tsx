'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false); // Trạng thái chuyển đổi giữa Đăng nhập và Đăng ký
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Hàm xử lý khi người dùng nhấn nút Gửi Form (Submit)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isSignUp) {
      // LOGIC ĐĂNG KÝ TÀI KHOẢN MỚI
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setMessage(`❌ Lỗi đăng ký: ${error.message}`);
      } else {
        setMessage('🎉 Đăng ký thành công! Hãy kiểm tra email của bạn để xác thực tài khoản.');
      }
    } else {
      // LOGIC ĐĂNG NHẬP TÀI KHOẢN HIỆN CÓ
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(`❌ Lỗi đăng nhập: ${error.message}`);
      } else {
        setMessage('🚀 Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
          router.push('/'); // Chuyển hướng người dùng về trang chủ học tập
          router.refresh();
        }, 1500);
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col justify-center">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {isSignUp ? 'Tạo tài khoản mới ✨' : 'Chào mừng trở lại 👋'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {isSignUp ? 'Nhập email để tham gia cộng đồng học tiếng Trung' : 'Đăng nhập để tiếp tục lộ trình của bạn'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {/* Ô NHẬP EMAIL */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
          <input
            type="email"
            required
            placeholder="name@example.com"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Ô NHẬP MẬT KHẨU */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Mật khẩu</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* NÚT BẤM KÍCH HOẠT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg text-sm shadow-md shadow-blue-100 transition-all"
        >
          {loading ? 'Đang xử lý...' : isSignUp ? 'Đăng ký ngay' : 'Đăng nhập'}
        </button>
      </form>

      {/* DÒNG CHỮ THÔNG BÁO KẾT QUẢ */}
      {message && (
        <div className="mt-4 p-3 rounded-lg text-xs font-medium text-center bg-slate-50 text-slate-700 border border-slate-100 animate-pulse">
          {message}
        </div>
      )}

      {/* KHỐI NÚT CHUYỂN ĐỔI QUA LẠI GIỮA ĐĂNG NHẬP / ĐĂNG KÝ */}
      <div className="border-t border-slate-100 pt-4 mt-6 text-center">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage('');
          }}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isSignUp ? 'Bạn đã có tài khoản? Đăng nhập tại đây' : 'Chưa có tài khoản? Đăng ký miễn phí ngay'}
        </button>
      </div>
    </div>
  );
}