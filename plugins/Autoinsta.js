import axios from "axios";

const handler = {};

// Global message handler for monitoring all messages
handler.all = async function (m) {
  const message = m.text?.trim();

  // Check if the message contains an Instagram link
  if (isInstagramLink(message)) {
    await processInstagramLink(m, this, message); // Pass 'conn' as 'this' in handler.all
  }
};

const isInstagramLink = (text) => {
  if (!text) return false;
  const instaRegex = /https?:\/\/(www\.)?instagram\.com\/[^\s]+/i;
  return instaRegex.test(text);
};

const processInstagramLink = async (m, conn, link) => {
  // Notify user about the download process
  const { key } = await conn.sendMessage(
    m.chat,
    { text: "جارٍ المعالجة اصبر شويتين..." },
    { quoted: m }
  );

  try {
    // Make the API call to fetch Instagram video details
    const response = await axios.get(`https://instagram-video-downloader-api-eight.vercel.app/igdl?url=${link}`);
    const result = response.data;

    if (result.url?.status && Array.isArray(result.url.data) && result.url.data.length > 0) {
      // Iterate through all download links and send them one by one
      for (const media of result.url.data) {
        if (media.url) {
          await conn.sendFile(m.chat, media.url, "video.mp4", "تم التحميل بنجاح", m);
        }
      }
    } else {
      throw new Error("لينك خاطئ أو حدثت مشكلة أثناء التحميل.");
    }
  } catch (e) {
    console.error("حدثت مشكلة أثناء معالجة اللينك:", e);
    await conn.sendMessage(
      m.chat,
      { text: "فشل التحميل. حاول لاحقًا." },
      { edit: key }
    );
  }
};

export default handler;
