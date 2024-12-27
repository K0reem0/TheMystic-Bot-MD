import axios from 'axios';

const handler = {};

// Store user download choices temporarily
const userChoices = {};

// Global message handler to monitor all messages
handler.all = async function (m) {
  const message = m.text?.trim();

  // Check if the message contains a TikTok link
  if (isTikTokLink(message)) {
    await askDownloadChoice(m, this, message); // Pass 'conn' as 'this' in handler.all
  }

  // Check if the user is responding with a download choice
  if (userChoices[m.sender]) {
    const choice = message;
    if (['1', '2', '3'].includes(choice)) {
      await processTikTokLink(m, this, userChoices[m.sender].link, choice);
      delete userChoices[m.sender]; // Remove user from the choice list after processing
    }
  }
};

// Function to check if the message contains a TikTok link
const isTikTokLink = (text) => {
  if (!text) return false;
  const tiktokRegex = /(?:https?:\/\/)?(?:w{3}|vm|vt|t)?\.?tiktok\.com\/([^\s&]+)/gi;
  return tiktokRegex.test(text);
};

// Ask the user for their download choice
const askDownloadChoice = async (m, conn, link) => {
  try {
    // Fetch TikTok video details to include sizes
    const response = await axios.get(`https://api.dorratz.com/v2/tiktok-dl?url=${link}`);
    const result = response.data;

    if (result.status && result.data?.media) {
      const media = result.data.media;

      userChoices[m.sender] = { link }; // Store the user's link temporarily

      const messageText = `🎥 *ماذا تريد تحميله؟*\n\n` +
        `1️⃣ *مع علامة مائية (WT)* - ${media.size_wm}\n` +
        `2️⃣ *الجودة الأصلية (ORG)* - ${media.size_org}\n` +
        `3️⃣ *جودة HD* - ${media.size_hd}\n\n` +
        `*أرسل رقم الخيار لتحميل المحتوى.*`;

      await conn.sendMessage(m.chat, { text: messageText }, { quoted: m });
    } else {
      throw new Error("تعذر جلب تفاصيل الفيديو.");
    }
  } catch (e) {
    console.error("حدثت مشكلة أثناء جلب تفاصيل الفيديو:", e);
    await conn.sendMessage(
      m.chat,
      { text: `⚠️ فشل جلب تفاصيل الفيديو. تأكد من الرابط وحاول مرة أخرى.` },
      { quoted: m }
    );
  }
};

// Function to process and download TikTok content based on user choice
const processTikTokLink = async (m, conn, link, choice) => {
  try {
    // API call to fetch TikTok video details
    const response = await axios.get(`https://api.dorratz.com/v2/tiktok-dl?url=${link}`);
    const result = response.data;

    if (result.status && result.data?.media) {
      const media = result.data.media;
      let downloadUrl;
      let filename;
      let caption;

      // Determine the download type based on user choice
      switch (choice) {
        case '1':
          downloadUrl = media.wm;
          filename = 'video-wt.mp4';
          caption = `✅ *تم التحميل بنجاح!*\n\n📥 *بدون علامة مائية (WT)* - ${media.size_wm}`;
          break;
        case '2':
          downloadUrl = media.org;
          filename = 'video-org.mp4';
          caption = `✅ *تم التحميل بنجاح!*\n\n📥 *الجودة الأصلية (ORG)* - ${media.size_org}`;
          break;
        case '3':
          if (parseSize(media.size_hd) > 16) {
            // File size exceeds limit
            await conn.sendMessage(
              m.chat,
              {
                text: `⚠️ الملف بحجم *${media.size_hd}* يتجاوز الحد الأقصى للتحميل. يمكنك تحميله يدويًا من الرابط أدناه:\n\n🔗 ${media.hd}`,
              },
              { quoted: m }
            );
            return;
          }
          downloadUrl = media.hd;
          filename = 'video-hd.mp4';
          caption = `✅ *تم التحميل بنجاح!*\n\n📥 *جودة HD* - ${media.size_hd}`;
          break;
        default:
          throw new Error("خيار غير صالح.");
      }

      // Send the requested file
      await conn.sendFile(m.chat, downloadUrl, filename, caption, m);
    } else {
      throw new Error("لينك خاطئ أو حدثت مشكلة أثناء التحميل.");
    }
  } catch (e) {
    console.error("حدثت مشكلة أثناء معالجة اللينك:", e);
    await conn.sendMessage(
      m.chat,
      { text: `⚠️ فشل التحميل، حاول لاحقاً.` }
    );
  }
};

// Helper function to parse file size and return size in MB
const parseSize = (size) => {
  const sizeMatch = size.match(/(\d+(\.\d+)?)\s?MB/i);
  return sizeMatch ? parseFloat(sizeMatch[1]) : 0;
};

export default handler;
