import axios from 'axios';

const handler = {};

// Global message handler for monitoring all messages
handler.all = async function (m) {
  const message = m.text?.trim();

  // Check if the message contains a TikTok link
  if (isTikTokLink(message)) {
    await processTikTokLink(m, this, message); // Pass 'conn' as 'this' in handler.all
  }
};

const isTikTokLink = (text) => {
  if (!text) return false;
  const tiktokRegex = /https?:\/\/(vm\.)?tiktok\.com\/[^\s]+/i;
  return tiktokRegex.test(text);
};

const processTikTokLink = async (m, conn, link) => {
  // Notify the user about the download process
  const { key } = await conn.sendMessage(
    m.chat,
    { text: "جارٍ معالجة رابط التيك توك، اصبر شوي..." },
    { quoted: m }
  );

  // Expand shortened TikTok links if necessary
  try {
    const response = await axios.get(link, { maxRedirects: 0, validateStatus: (status) => status === 302 });
    link = response.headers.location || link; // Update with the expanded URL if applicable
  } catch (error) {
    console.error("Error expanding TikTok URL:", error);
    await conn.sendMessage(m.chat, { text: "⚠️ الرابط غير صالح. حاول مرة أخرى بلينك صحيح." }, { edit: key });
    return;
  }

  try {
    // Fetch TikTok video details using the API
    const response = await axios.get(`https://api.dorratz.com/v2/tiktok-dl?url=${link}`);
    const result = response.data;

    if (result.status && result.data && result.data.media) {
      const { media, author, title } = result.data;

      // Use HD video if available; fallback to original video without watermark
      const videoUrl = media.hd || media.org;

      if (!videoUrl) {
        throw new Error("No video available.");
      }

      // Send the video (HD if available)
      await conn.sendFile(
        m.chat,
        videoUrl,
        'tiktok.mp4',
        `🎥 *العنوان*: ${title}\n👤 *المستخدم*: ${author.nickname} (${author.username})\n\n✅ *تم التحميل !*`,
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
      { text: "⚠️ حدث خطأ أثناء معالجة الرابط. حاول مرة أخرى لاحقًا." },
      { edit: key }
    );
  }
};

export default handler;
