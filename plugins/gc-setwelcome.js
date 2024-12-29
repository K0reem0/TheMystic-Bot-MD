const handler = async (m, { conn, text }) => {
  if (text) {
    global.db.data.chats[m.chat].sWelcome = text;
    m.reply("تم تعيين رسالة الترحيب بنجاح!");
  } else {
    throw `*كيفية الاستخدام:*
- استخدم النص فقط لتعيين رسالة الترحيب العامة.`;
  }

  conn.ev.on('group-participants.update', async (update) => {
    if (update.action === 'add') {
      for (const userId of update.participants) {
        // جلب بيانات المستخدم من قاعدة البيانات
        const user = global.db.data.users[userId] || {};
        const { name, image } = user;

        if (!name) continue; // إذا لم يتم تسجيل المستخدم، لا يتم إرسال رسالة.

        // نص الترحيب
        const welcomeText = global.db.data.chats[update.id]?.sWelcome || "مرحبًا بك في المجموعة!";

        // صيغة الإشارة
        const mention = `@${userId.split('@')[0]}`;

        if (image) {
          // إرسال الترحيب مع الصورة
          await conn.sendMessage(update.id, {
            image: { url: image },
            caption: `${welcomeText}\n\n*الاسم:* ${name}\n*الإشارة:* ${mention}`,
            mentions: [userId],
          });
        } else {
          // إرسال الترحيب كنص فقط
          await conn.sendMessage(update.id, {
            text: `${welcomeText}\n\n*الاسم:* ${name}\n*الإشارة:* ${mention}`,
            mentions: [userId],
          });
        }
      }
    }
  });
};

handler.help = ['setwelcome <text>'];
handler.tags = ['group'];
handler.command = ['ترحيب'];
handler.admin = true;

export default handler;
