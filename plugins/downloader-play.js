import axios from 'axios';
import yts from 'yt-search'; // Import the yt-search library

const handler = async (m, { conn, args }) => {
  if (!m || typeof m !== 'object') {
    console.log("Invalid message object.");
    return;
  }

  // Validate arguments
  if (!args.length) {
    throw `*وين رابط أو اسم الفيديو؟*`;
  }

  // Send initial processing message
  const pingMsg = await conn.sendMessage(
    m.chat,
    { text: "جاري البحث... ⏳" },
    { quoted: m }
  );

  try {
    let videoUrl;

    // Update the message with progress
    const updateMessage = async (newText) => {
      await conn.relayMessage(
        m.chat,
        {
          protocolMessage: {
            key: pingMsg.key,
            type: 14,
            editedMessage: {
              conversation: newText,
            },
          },
        },
        {}
      );
    };

    // Check if the input is a URL or a search query
    if (args[0].startsWith("http")) {
      videoUrl = args[0];
      await updateMessage("🔗 تم اكتشاف رابط الفيديو. جاري التحميل...");
    } else {
      const query = args.join(" ");
      await updateMessage(`🔍 البحث عن: *${query}*`);

      const searchResults = await yts(query);

      if (searchResults.videos.length > 0) {
        const firstResult = searchResults.videos[0];
        videoUrl = firstResult.url;
        await updateMessage(`🎥 تم العثور على: *${firstResult.title}*\n⏳ جاري التحميل...`);
      } else {
        throw new Error("لم يتم العثور على نتائج للبحث.");
      }
    }

    // Check if the video URL is valid
    if (!videoUrl || !videoUrl.startsWith("http")) {
      throw new Error("رابط الفيديو غير صالح.");
    }

    // Call the download API
    const apiUrl = `https://deliriussapi-oficial.vercel.app/download/ytmp4?url=${videoUrl}`;
    await updateMessage("⏳ يتم الآن تحميل الفيديو...");

    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status && data.data?.download?.url) {
      const title = data.data.title || "video";
      const size = data.data.download.size || "غير معروف";
      const downloadUrl = data.data.download.url;
      const filename = data.data.download.filename || `${title}.mp4`;

      // Validate the file size
      const fileSize = size.toLowerCase();
      if (fileSize === "0" || fileSize === "0 kb") {
        throw new Error("حجم الملف غير صالح (0 كيلوبايت).");
      }

      await updateMessage(`📥 يتم إرسال الفيديو: *${title}* (${size})`);

      // Send the video file
      await conn.sendFile(
        m.chat,
        downloadUrl,
        filename,
        `🎉 تم التحميل بنجاح!\n📌 العنوان: ${title}\nالحجم: ${size}`,
        m,
        false,
        { mimetype: 'video/mp4' }
      );
    } else {
      throw new Error("لم يتم العثور على رابط تحميل الفيديو.");
    }
  } catch (e) {
    console.error("Error during YouTube download:", e.message);

    // Notify the user about the error
    await conn.relayMessage(
      m.chat,
      {
        protocolMessage: {
          key: pingMsg.key,
          type: 14,
          editedMessage: {
            conversation: `⚠️ حدث خطأ أثناء تحميل الفيديو. تأكد من الرابط أو البحث وحاول مرة أخرى.`,
          },
        },
      },
      {}
    );
  }
};

handler.help = ['youtube <link yt> | <search query>'];
handler.tags = ['downloader'];
handler.command = /^(شغل)$/i;

export default handler;
