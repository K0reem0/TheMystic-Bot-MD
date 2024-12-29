const handler = async (m, { conn }) => {
  // Check if a welcome message is set for the chat
  if (global.db.data.chats[m.chat].sWelcome) {
    // Remove the welcome message
    delete global.db.data.chats[m.chat].sWelcome;
    
    // Set the welcome flag to false
    global.db.data.chats[m.chat].welcome = false;

    m.reply("تم إزالة رسالة الترحيب بنجاح وأصبح الترحيب معطلًا لهذا الدردشة.");
  } else {
    m.reply("لا توجد رسالة ترحيب تم تعيينها لهذا الدردشة.");
  }
};

handler.help = ['removewelcome'];
handler.tags = ['group'];
handler.command = ['حذف_ترحيب'];
handler.admin = true;

export default handler;
