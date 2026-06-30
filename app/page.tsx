import { supabase } from '@/lib/supabaseClient';

export default async function Home() {
  // Lấy dữ liệu từ bảng chinese_words
  const { data: words, error } = await supabase.from('chinese_words').select('*');

  if (error) {
    return <div>Lỗi khi tải dữ liệu: {error.message}</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Danh sách từ vựng tiếng Trung</h1>
      <ul>
        {words?.map((word: any) => (
          <li key={word.id} className="mb-2">
            <strong>{word.hanzi}</strong> ({word.pinyin}): {word.vietnamese_meaning}
          </li>
        ))}
      </ul>
    </main>
  );
}