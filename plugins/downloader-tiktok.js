import axios from 'axios';

const handler = async (m, { conn, args }) => {
  if (!m || typeof m !== 'object') {
    console.log("Invalid message object.");
    return;
  }

  // Validate arguments
  if (!args[0]) {
    throw `*وين لينك التيك توك؟*`;
  }

  // Expand shortened TikTok URL
  let tiktokUrl = args[0];
  try {
    const response = await axios.get(tiktokUrl, { maxRedirects: 0, validateStatus: (status) => status === 302 });
    tiktokUrl = response.headers.location; // Get the expanded URL
  } catch (error) {
    console.error("Error expanding TikTok URL:", error);
    throw `*الرابط غير صالح أو قصير جدًا. تأكد من أنه صحيح.*`;
  }

  // Validate TikTok URL
  if (!/^https?:\/\/(www\.)?tiktok\.com\/.+/.test(tiktokUrl)) {
    throw `*تأكد أن الرابط صحيح من تيك توك.*`;
  }

  // Inform the user about the processing
  const { key } = await conn.sendMessage(
    m.chat,
    { text: "جاري المعالجة..." },
    { quoted: m }
  );

  try {
    // Fetch TikTok video details using the API
    const response = await axios.get(`https://api.dorratz.com/v2/tiktok-dl?url=${tiktokUrl}`);
    const result = response.data;

    if (result.status && result.data && result.data.media) {
      const { media, author, title } = result.data;

      // Use HD video if available; fallback to original video without watermark
      const videoUrl = media.hd || media.org;

      if (!videoUrl) {
        throw new Error("HD and original video not available.");
      }

      // Send the video (HD if available)
      await conn.sendFile(
        m.chat,
        videoUrl,
        'tiktok.mp4',
        `🎥 *العنوان*: ${title}\n👤 *المستخدم*: ${author.nickname} (${author.username})\n\n✅ *تم تحميل الفيديو !*`,
        m
      );
    } else {
      throw new Error("فشل الحصول على الفيديو. تحقق من الرابط أو حاول مرة أخرى.");
    }
  } catch (error) {
    console.error("Error downloading TikTok video:", error);

    // Inform the user about the error
    await conn.sendMessage(
      m.chat,
      { text: "⚠️ حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى لاحقًا." },
      { edit: key }
    );
  }
};

handler.help = ['tiktok <link tt>'];
handler.tags = ['downloader'];
handler.command = /^(تيك|tik)$/i;

export default handler;
