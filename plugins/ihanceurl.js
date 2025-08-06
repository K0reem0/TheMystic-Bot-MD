import axios from 'axios';
import FormData from "form-data";

const handler = async (m, { conn, args, command }) => {
  const url = args[0];
  if (!url || !url.startsWith('http')) {
    return m.reply(`❌ رابط غير صالح.\n📌 مثال: /${command} https://image.jpg`);
  }

  m.reply("🛠️ جاري تحميل الصورة وتحسينها، الرجاء الانتظار...");

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    const enhanced = await ihancer(buffer, { method: 1, size: 'high' });

    await conn.sendMessage(m.chat, { image: enhanced, caption: "✅ تم تحسين الصورة بنجاح!" }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("❌ حدث خطأ أثناء تحسين الصورة.");
  }
};

handler.command = ['enhanceurl'];
export default handler;

async function ihancer(buffer, { method = 1, size = 'high' } = {}) {
  const sizes = ['low', 'medium', 'high'];
  if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('الصورة غير موجودة');
  if (!sizes.includes(size)) throw new Error(`الأحجام المدعومة: ${sizes.join(', ')}`);

  const form = new FormData();
  form.append('method', method.toString());
  form.append('is_pro_version', 'false');
  form.append('is_enhancing_more', 'false');
  form.append('max_image_size', size);
  form.append('file', buffer, `enhance_${Date.now()}.jpg`);

  const { data } = await axios.post('https://ihancer.com/api/enhance', form, {
    headers: {
      ...form.getHeaders(),
      'accept-encoding': 'gzip',
      'user-agent': 'Dart/3.5 (dart:io)'
    },
    responseType: 'arraybuffer'
  });

  return Buffer.from(data);
}
