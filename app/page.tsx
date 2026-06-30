'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('chinese_words').select('*');
      if (data) setWords(data);
    }
    fetchData();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-center mb-8">Học Từ Vựng Tiếng Trung</h1>
      <div className="grid gap-4">
        {words.map((word) => (
          <div key={word.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <span className="text-4xl font-bold text-blue-600">{word.hanzi}</span>
              <span className="text-lg text-gray-500 italic">{word.pinyin}</span>
            </div>
            <p className="mt-4 text-xl text-gray-800">{word.vietnamese_meaning}</p>
          </div>
        ))}
      </div>
    </main>
  );
}