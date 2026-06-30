'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

export default function Home() {
  const [words, setWords] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorite'>('all');
  const [searchQuery, setSearchQuery] = useState(''); // Lưu chuỗi tìm kiếm

  async function fetchData() {
    const { data } = await supabase
      .from('chinese_words')
      .select('*')
      .order('id', { ascending: false });
    if (data) setWords(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Lọc từ vựng kết hợp cả trạng thái "Yêu thích" lẫn "Tìm kiếm"
  const filteredWords = words.filter((word) => {
    const matchesFilter = filter === 'favorite' ? word.is_favorite === true : true;
    const matchesSearch = 
      word.hanzi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.vietnamese_meaning.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* KHỐI CHÀO MỪNG & THỐNG KÊ NHANH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <h2 className="text-xl font-bold">Chào mừng bạn trở lại! 👋</h2>
          <p className="text-slate-300 text-sm mt-1">Hôm nay là một ngày tuyệt vời để tích lũy thêm từ vựng mới.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center min-w-[90px]">
            <span className="block text-xl font-bold text-indigo-300">{words.length}</span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider">Tổng số từ</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center min-w-[90px]">
            <span className="block text-xl font-bold text-red-400">{words.filter(w => w.is_favorite).length}</span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider">Yêu thích</span>
          </div>
        </div>
      </div>

      {/* THANH CÔNG CỤ: TÌM KIẾM & BỘ LỌC */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Ô tìm kiếm */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Tìm chữ Hán, pinyin, nghĩa..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Nút bộ lọc */}
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setFilter('all')} 
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === 'all' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setFilter('favorite')} 
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === 'favorite' ? 'bg-red-500 text-white shadow-md shadow-red-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Yêu thích ❤️
          </button>
        </div>
      </div>

      {/* DANH SÁCH THẺ BÀI (GRID RESPONSIVE CHUYÊN NGHIỆP) */}
      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map((word) => (
            <Flashcard key={word.id} word={word} onUpdate={fetchData} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-400 text-lg">Không tìm thấy từ vựng nào khớp với điều kiện tìm kiếm 🌟</p>
        </div>
      )}

    </div>
  );
}

function Flashcard({ word, onUpdate }: { word: any; onUpdate: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase
      .from('chinese_words')
      .update({ is_favorite: !word.is_favorite })
      .eq('id', word.id);

    if (!error) onUpdate();
  };

  return (
    <div 
      className="h-56 cursor-pointer relative group" 
      style={{ perspective: '1000px' }} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 22 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* MẶT TRƯỚC (CHỮ HÁN) */}
        <div 
          className="absolute w-full h-full bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm group-hover:shadow-md transition-shadow" 
          style={{ backfaceVisibility: 'hidden', position: 'absolute' }}
        >
          <button onClick={toggleFavorite} className="absolute top-4 right-4 text-xl z-10 p-1 hover:scale-125 transition-transform">
            {word.is_favorite ? '❤️' : '🤍'}
          </button>
          <span className="text-5xl font-bold text-slate-800 tracking-wide bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
            {word.hanzi}
          </span>
          <span className="text-xs text-slate-400 mt-4 font-medium tracking-wider uppercase">Bấm để lật nghĩa</span>
        </div>

        {/* MẶT SAU (PINYIN & NGHĨA VÀ AI CÂU MẪU) */}
        <div 
          className="absolute w-full h-full bg-gradient-to-b from-slate-50 to-white border-2 border-slate-900 rounded-2xl flex flex-col items-center justify-between p-5 shadow-lg" 
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute' }}
        >
          <button onClick={toggleFavorite} className="absolute top-4 right-4 text-xl z-10 p-1 hover:scale-125 transition-transform">
            {word.is_favorite ? '❤️' : '🤍'}
          </button>
          
          <div className="text-center mt-2">
            <span className="text-2xl font-bold text-indigo-600 tracking-wide">{word.pinyin}</span>
            <p className="text-base text-slate-700 font-semibold mt-1">{word.vietnamese_meaning}</p>
          </div>

          {/* Vùng hiển thị câu mẫu (Tạm thời giữ gọn gàng) */}
          <div className="w-full bg-slate-100/80 border border-slate-200/60 p-2.5 rounded-xl text-center text-xs text-slate-500">
            Tính năng AI Ví dụ đang được bảo trì ✨
          </div>
        </div>
      </motion.div>
    </div>
  );
}