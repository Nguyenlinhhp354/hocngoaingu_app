import { createClient } from '@supabase/supabase-js';

// Thay các giá trị này bằng thông tin dự án của bạn
const supabaseUrl = 'https://yrpvdvgswlfvkspcasjv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycHZkdmdzd2xmdmtzcGNhc2p2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjczNjczMCwiZXhwIjoyMDk4MzEyNzMwfQ.KrJqHptck88DvLNpCREk2MKVSP48WJn3o8FplmlvrYs'; 

const supabase = createClient(supabaseUrl, supabaseKey);

const words = [
  { hanzi: '你好', pinyin: 'nǐ hǎo', vietnamese_meaning: 'Xin chào' },
  { hanzi: '谢谢', pinyin: 'xièxie', vietnamese_meaning: 'Cảm ơn' },
  { hanzi: '老师', pinyin: 'lǎoshī', vietnamese_meaning: 'Giáo viên' },
  { hanzi: '学生', pinyin: 'xuésheng', vietnamese_meaning: 'Học sinh' },
  { hanzi: '朋友', pinyin: 'péngyou', vietnamese_meaning: 'Bạn bè' },
  { hanzi: '学校', pinyin: 'xuéxiào', vietnamese_meaning: 'Trường học' },
  { hanzi: '吃饭', pinyin: 'chīfàn', vietnamese_meaning: 'Ăn cơm' },
  { hanzi: '学习', pinyin: 'xuéxí', vietnamese_meaning: 'Học tập' },
  { hanzi: '中国', pinyin: 'zhōngguó', vietnamese_meaning: 'Trung Quốc' },
  { hanzi: '越南', pinyin: 'yuènán', vietnamese_meaning: 'Việt Nam' },
];

async function seedData() {
  const { data, error } = await supabase.from('chinese_words').insert(words);
  if (error) console.error('Lỗi khi thêm dữ liệu:', error);
  else console.log('Đã thêm 10 từ vựng thành công!');
}

seedData();