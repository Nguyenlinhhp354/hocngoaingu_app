'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [meaning, setMeaning] = useState('');
  const [words, setWords] = useState<any[]>([]);
  
  // Các biến trạng thái để bảo mật
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Mật khẩu của bạn (Bạn có thể đổi chữ '1234' thành mật khẩu bạn muốn)
  const ADMIN_PASSWORD = '1234';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert('Sai mật khẩu rồi bạn ơi! ❌');
    }
  };

  async function fetchWords() {
    const { data, error } = await supabase
      .from('chinese_words')
      .select('*')
      .order('id', { ascending: false });
    
    if (data) setWords(data);
  }

  useEffect(() => {
    if (isAuthorized) {
      fetchWords();
    }
  }, [isAuthorized]);

  const addWord = async () => {
    if (!hanzi || !pinyin || !meaning) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const { error } = await supabase
      .from('chinese_words')
      .insert([{ hanzi, pinyin, vietnamese_meaning: meaning }]);
    
    if (error) {
      alert('Lỗi: ' + error.message);
    } else {
      alert('Thêm từ thành công! 🎉');
      setHanzi(''); setPinyin(''); setMeaning('');
      fetchWords();
    }
  };

  const deleteWord = async (id: number) => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa từ này?');
    if (!isConfirmed) return;

    const { error } = await supabase.from('chinese_words').delete().eq('id', id);

    if (error) alert('Lỗi: ' + error.message);
    else setWords(words.filter(word => word.id !== id));
  };

  // NẾU CHƯA ĐĂNG NHẬP: Hiện màn hình khóa
  if (!isAuthorized) {
    return (
      <main className="max-w-md mx-auto p-6 mt-20 text-center">
        <div className="bg-white p-8 rounded-xl shadow-md border">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">🔒 Trang Bảo Mật</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="Nhập mật khẩu Admin..." 
              className="border-2 p-3 rounded-lg text-center text-lg focus:border-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="bg-gray-800 hover:bg-gray-950 text-white p-3 rounded-lg font-semibold transition-colors">
              Xác Nhận Truy Cập
            </button>
          </form>
        </div>
      </main>
    );
  }

  // NẾU ĐÃ ĐĂNG NHẬP ĐÚNG: Hiện toàn bộ giao diện quản trị cũ
  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Trang Quản Trị Từ Vựng</h1>
        <button onClick={() => setIsAuthorized(false)} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg font-medium">
          Đăng xuất 🔓
        </button>
      </div>
      
      <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md border mb-10">
        <input placeholder="Chữ Hán" className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 text-lg" onChange={(e) => setHanzi(e.target.value)} value={hanzi} />
        <input placeholder="Pinyin" className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 text-lg" onChange={(e) => setPinyin(e.target.value)} value={pinyin} />
        <input placeholder="Nghĩa" className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 text-lg" onChange={(e) => setMeaning(e.target.value)} value={meaning} />
        <button onClick={addWord} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg text-lg transition-colors">
          Thêm Từ Vựng
        </button>
      </div>

      <hr className="my-8 border-gray-300" />

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Danh sách hiện có ({words.length})</h2>
      <div className="flex flex-col gap-3">
        {words.map((word) => (
          <div key={word.id} className="flex justify-between items-center bg-gray-50 border-2 border-gray-200 p-4 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
            <div>
              <span className="text-2xl font-bold text-blue-600 mr-4">{word.hanzi}</span>
              <span className="text-gray-500 text-lg mr-4">[{word.pinyin}]</span>
              <span className="text-gray-800 text-lg font-medium">{word.vietnamese_meaning}</span>
            </div>
            <button onClick={() => deleteWord(word.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              Xóa
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}