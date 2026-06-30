import { NextResponse } from 'next/server';

// Đổi sang mô hình thế hệ mới để sửa triệt để lỗi 404 của Google
const MODEL_NAME = 'gemini-2.0-flash'; 

export async function POST(request: Request) {
  try {
    const { hanzi, meaning } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Chưa cấu hình GEMINI_API_KEY trong file .env.local' }, { status: 500 });
    }

    const prompt = `Bạn là một giáo viên tiếng Trung chuẩn bản xứ. Hãy tạo đúng 1 câu ví dụ ngắn gọn, dễ hiểu sử dụng từ khóa "${hanzi}" (có nghĩa tiếng Việt là: ${meaning}). 
    Bắt buộc phải trả về kết quả dưới dạng cấu trúc JSON thuần túy (không bọc trong khối văn bản tu từ nào cả) theo mẫu chính xác sau:
    {
      "sentence": "Câu tiếng Trung mẫu",
      "pinyin": "Phiên âm pinyin của câu trên",
      "vietnamese": "Dịch nghĩa tiếng Việt của câu trên"
    }`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Lỗi từ Google API:", data);
      return NextResponse.json({ error: data.error?.message || 'Google API trả về lỗi' }, { status: response.status });
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("❌ Cấu trúc phản hồi từ AI không đúng:", data);
      return NextResponse.json({ error: 'Không nhận được cấu trúc văn bản từ AI' }, { status: 500 });
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    const cleanJson = textResponse.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanJson);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Lỗi sập hệ thống Backend:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}