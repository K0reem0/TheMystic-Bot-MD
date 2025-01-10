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
      { text: 'Downloading YouTube video...' },
      { quoted: m }
    );

    // Use a reliable and robust API (example: YTDL-Core)
    const ytdl = require('ytdl-core'); // Import ytdl-core library
    const info = await ytdl.getInfo(link); 

    // Get the highest quality video URL
    const formats = info.formats.filter(format => format.container === 'mp4');
    const highestQuality = formats.reduce((prev, curr) => 
      (prev.qualityLabel || 0) > (curr.qualityLabel || 0) ? prev : curr
    );
    const downloadUrl = highestQuality.url; 

    if (downloadUrl) {
      // Send downloaded video to the chat
      await conn.sendFile(m.chat, downloadUrl, 'video.mp4', 'YouTube video downloaded!', m);
    } else {
      await conn.sendMessage(m.chat, { text: 'Failed to download video.' }, { edit: key });
    }
  } catch (e) {
    console.error('Error downloading YouTube video:', e);
    await conn.sendMessage(m.chat, { text: 'Failed to download video.' }, { edit: key });
  }
};

export default handler;
