const handler = async (m, { conn }) => {
  // إعداد رسالة الترحيب الثابتة
  global.db.data.chats[m.chat].sWelcome = "always";

  m.reply("تم خلي الترحيب علي");

  conn.ev.on('group-participants.update', async (update) => {
    if (update.action === 'add') {
      for (const userId of update.participants) {
        // جلب بيانات المستخدم من قاعدة البيانات
        const user = global.db.data.users[userId] || {};
        const { name, image } = user;

        if (!name) continue; // إذا لم يتم تسجيل المستخدم، لا يتم إرسال رسالة.

        // صيغة الإشارة للمستخدم الجديد
        const userMention = `@${userId.split('@')[0]}`;

        // صيغة الإشارة للمشرف
        const adminId = "201061126830@s.whatsapp.net";
        const adminMention = `@${adminId.split('@')[0]}`;

        // نص الترحيب
        const welcomeMessage = `
┓═━─┄⊹⊱ «◈» ⊰⊹┄─━═┏

مرحباََ بك في نقابة اجارس
              ⊰🌨️⊱
⚜︎يسرنا تواجدك بيننـا⚜︎
وانضمامك معنــا و
بكـل ما تحمله معاني الشـوق
⚜︎نتلهف لقراءة مشاركاتك⚜︎
━─┄⊹⊱ «◈» ⊰⊹┄─━

*✧ ♟️┋اللـــقـــب • 〘${name}〙*

*✧ 📧┋المـــنشـن • 〘${userMention}〙*

*✧ 🧑🏻‍💻┋المسؤول  • 〘${adminMention}〙*

━─┄⊹⊱ «◈» ⊰⊹┄─━

  ◈ ⚜︎  قـروب الإعـلانـات 🗞️ ↯↯.
〘 https://chat.whatsapp.com/LLucZEBpwec2n6PvwcRgHD 〙

━─┄⊹⊱ «◈» ⊰⊹┄─━

*⚜︎ 📯 ┃ادارة•* ﹝𝑨𝒋𝒂𝒓𝒔﹞

┛═━─┄⊹⊱ «◈» ⊰⊹┄─━═┗`;

        if (image) {
          // إرسال الترحيب مع الصورة
          await conn.sendMessage(update.id, {
            image: { url: image },
            caption: welcomeMessage,
            mentions: [userId, adminId],
          });
        } else {
          // إرسال الترحيب بدون صورة
          await conn.sendMessage(update.id, {
            text: welcomeMessage,
            mentions: [userId, adminId],
          });
        }
      }
    }
  });
};

handler.help = ['setwelcome'];
handler.tags = ['group'];
handler.command = ['ترحيب'];
handler.admin = true;

export default handler;
