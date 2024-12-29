const handler = async (m, { conn, text }) => {
  if (text) {
    global.db.data.chats[m.chat].sWelcome = text;
    m.reply("تم تعيين رسالة الترحيب بنجاح!");
  } else {
    throw `*كيفية الاستخدام:*
- استخدم النص فقط لتعيين رسالة الترحيب العامة.`;
  }

  conn.on('group-participants-update', async (update) => {
    if (update.action === 'add') {
      for (const who of update.participants) {
        // جلب بيانات المستخدم من قاعدة البيانات
        const user = global.db.data.users[who] || {};
        const { name, image } = user;

        if (!name) continue; // إذا لم يتم تسجيل المستخدم، لا يتم إرسال رسالة.

        // نص الترحيب
        const welcomeText = global.db.data.chats[m.chat]?.sWelcome || "مرحبًا بك في المجموعة!";

        if (image) {
          // إرسال الترحيب مع الصورة
          await conn.sendMessage(m.chat, {
            image: { url: image },
            caption: `${welcomeText}\n\n*الاسم:* ${name}`,
            mentions: [who],
          });
        } else {
          // إرسال الترحيب كنص فقط
          await conn.sendMessage(m.chat, {
            text: `${welcomeText}\n\n*الاسم:* ${name}`,
            mentions: [who],
          });
        }
      }
    }
  });
};

handler.help = ['setwelcome <text>'];
handler.tags = ['group'];
handler.command = ['setwelcome'];
handler.admin = true;

export default handler;
