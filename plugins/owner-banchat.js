const handler = async (m) => {
  global.db.data.chats[m.chat].isBanned = true;
  m.reply('✅ تم ايقاف البوت.');
};

handler.help = ['banchat'];
handler.tags = ['owner'];
handler.command = /^ايقاف$/i;
handler.rowner = true;

export default handler;
