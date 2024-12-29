const handler = async (m, { conn }) => {
  // Remove the welcome message from the chat's settings
  if (global.db.data.chats[m.chat].sWelcome) {
    delete global.db.data.chats[m.chat].sWelcome;
    m.reply("تم إزالة رسالة الترحيب بنجاح!");
  } else {
    m.reply("لا توجد رسالة ترحيب تم تعيينها لهذا الدردشة.");
  }
};

handler.help = ['removewelcome'];
handler.tags = ['group'];
handler.command = ['حذف_ترحيب'];
handler.admin = true;

export default handler;
