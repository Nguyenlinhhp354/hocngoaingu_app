'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

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
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-10">Flashcards Tiếng Trung</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {words.map((word) => (
          <Flashcard key={word.id} word={word} />
        ))}
      </div>
    </main>
  );
}

function Flashcard({ word }: { word: any }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="h-48 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Mặt trước */}
        <div className="absolute w-full h-full bg-blue-500 text-white rounded-xl flex items-center justify-center p-6 backface-hidden shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
          <span className="text-5xl font-bold">{word.hanzi}</span>
        </div>
        {/* Mặt sau */}
        <div className="absolute w-full h-full bg-white border-2 border-blue-500 rounded-xl flex flex-col items-center justify-center p-6 shadow-lg" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(1800deg)' }}>
          <span className="text-2xl font-bold text-gray-800">{word.pinyin}</span>
          <span className="text-lg text-gray-600 mt-2">{word.vietnamese_meaning}</span>
        </div>
      </motion.div>
    </div>
  );
}