const handler = async (m) => {
  global.db.data.chats[m.chat].isBanned = false;
  m.reply('✅ تم تشغيل البوت.');
};

handler.help = ['banchat'];
handler.tags = ['owner'];
handler.command = /^تشغيل$/i;
handler.rowner = true;

export default handler;
