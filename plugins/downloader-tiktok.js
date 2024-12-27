import axios from 'axios';

const handler = async (m, { conn, args, command, usedPrefix }) => {
  // Validate the message object
  if (!m || typeof m !== 'object') {
    console.log("Invalid message object.");
    return;
  }

  // Regex for validating TikTok URLs
  const tiktokUrlRegex = /(?:https?:\/\/)?(?:w{3}|vm|vt|t)?\.?tiktok\.com\/([^\s&]+)/gi;

  // Check if a valid URL is provided
  if (!args[0] || !tiktokUrlRegex.test(args[0])) {
    throw `*وين رابط التيكتوك الصحيح ؟*`;
  }

  // Notify the user that processing has started
  const { key } = await conn.sendMessage(
    m.chat,
    { text: "جاري التحميل من تيكتوك..." },
    { quoted: m }
  );
  await conn.sendMessage(m.chat, { text: "صبر قليلاً...", edit: key });

  try {
    // Make API request to download TikTok video
    const response = await axios.get(`https://api.dorratz.com/v2/tiktok-dl?url=${args[0]}`);
    const result = response.data;

    if (result.status && result.data?.media?.org) {
      const media = result.data.media;
      const author = result.data.author;
      const caption = `✅ *تم التحميل بنجاح!*\n\n` +
                      `🎥 *العنوان:* ${result.data.title}\n` +
                      `⏱ *المدة:* ${result.data.duration} ثانية\n` +
                      `👤 *الناشر:* ${author.nickname} (${author.username})\n` +
                      `❤️ *الإعجابات:* ${result.data.like}\n` +
                      `🔁 *المشاركات:* ${result.data.share}\n` +
                      `💬 *التعليقات:* ${result.data.comment}\n\n` +
                      `📥 *روابط إضافية:*\n` +
                      `• [جودة أصلية](${media.org})\n` +
                      `• [بدون علامة مائية](${media.wm})\n` +
                      `• [HD](${media.hd})\n` +
                      `• [الموسيقى](${media.music})`;

      // Send the video file (original quality) to the user
      await conn.sendFile(m.chat, media.org, 'tiktok.mp4', caption, m);
    } else {
      throw new Error("رابط غير صالح أو حدث خطأ أثناء التحميل.");
    }
  } catch (e) {
    console.error("An error occurred:", e.message);

    // Send an error message to the user
    await conn.sendMessage(
      m.chat,
      { text: `⚠️ خطأ: ${e.message || 'لم نتمكن من تحميل الفيديو. حاول مرة أخرى لاحقًا.'}` },
      { edit: key }
    );
  }
};

handler.help = ['tiktok <link tiktok>'];
handler.tags = ['downloader'];
handler.command = /^(تيك|tik)$/i;

export default handler;
