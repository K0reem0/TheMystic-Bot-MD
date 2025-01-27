import axios from 'axios';

const handler = {};

handler.all = async function (m) {
  const message = m.text?.trim();

  // Check if the message contains a YouTube link
  if (isYouTubeLink(message)) {
    await processYouTubeLink(m, this, message); // Pass 'conn' as 'this' in handler.all
  }
};

const isYouTubeLink = (text) => {
  if (!text) return false;
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(text);
};

const processYouTubeLink = async (m, conn, link) => {
  try {
    // Notify user about the download process
    const { key } = await conn.sendMessage(
      m.chat,
      { text: '⏳ جاري تحميل فيديو اليوتيوب...' },
      { quoted: m }
    );

    // Use the provided API to get video details
    const apiUrl = `https://d7c6b89f-2204-4cad-838a-93412968a472-00-3joifo184f3b6.sisko.replit.dev/api/getVideo?url=${link}`;
    const response = await axios.get(apiUrl);

    // Extract data from the API response
    const data = response.data;
    if (data && data.data && data.data.media && data.data.media.download && data.data.media.download.url) {
      const downloadUrl = data.data.media.download.url; // Video download URL
      const title = data.data.title || 'video';
      const fileSize = 'غير معروف'; // File size not provided by the API

      // Send the downloaded video to the chat
      await conn.sendFile(
        m.chat,
        downloadUrl,
        `${title}.mp4`,
        `✅ تم تحميل الفيديو بنجاح!\nالعنوان: ${title}`,
        m,
        false,
        { mimetype: 'video/mp4' }
      );
    } else {
      await conn.sendMessage(
        m.chat,
        { text: '❌ حدث خطأ أثناء الحصول على رابط التحميل.' },
        { edit: key }
      );
    }
  } catch (e) {
    console.error('Error downloading YouTube video:', e);
    await conn.sendMessage(
      m.chat,
      { text: '⚠️ حدث خطأ أثناء تحميل الفيديو.' },
      { edit: key }
    );
  }
};

export default handler;
