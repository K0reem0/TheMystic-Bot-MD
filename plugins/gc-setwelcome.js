let isWelcomeHandlerRegistered = false; // متغير لتتبع التسجيل

const handler = async (m, { conn }) => {
  m.reply("تم تعيين رسالة الترحيب بنجاح!");

  if (!isWelcomeHandlerRegistered) {
    isWelcomeHandlerRegistered = true; // تسجيل الحدث لمرة واحدة فقط

    conn.ev.on('group-participants.update', async (update) => {
      if (update.action === 'add') {
        for (const userId of update.participants) {
          const user = global.db.data.users[userId] || {};
          const { name, image } = user;

          if (!name) continue;

          const userMention = `@${userId.split('@')[0]}`;
          const adminId = "201061126830@s.whatsapp.net";
          const adminMention = `@${adminId.split('@')[0]}`;

          const welmess = `
┓═━─┄⊹⊱ «◈» ⊰⊹┄─━═┏
مرحباََ بك في نقابة اجارس
              ⊰🌨️⊱
⚜︎يسرنا تواجدك بيننـا⚜︎
━─┄⊹⊱ «◈» ⊰⊹┄─━

*✧ ♟️┋اللـــقـــب • 〘${name}〙*
*✧ 📧┋المـــنشـن • 〘${userMention}〙*
*✧ 🧑🏻‍💻┋المسؤول  • 〘${adminMention}〙*
━─┄⊹⊱ «◈» ⊰⊹┄─━

  ◈ ⚜︎  قـروب الإعـلانـات 🗞️ ↯↯.
〘 https://chat.whatsapp.com/LLucZEBpwec2n6PvwcRgHD 〙

*⚜︎ 📯 ┃ادارة•* ﹝𝑨𝒋𝒂𝒓𝒔﹞
┛═━─┄⊹⊱ «◈» ⊰⊹┄─━═┗`;

          try {
            if (image) {
              await conn.sendMessage(update.id, {
                image: { url: image },
                caption: welmess,
                mentions: [userId, adminId],
              });
            } else {
              await conn.sendMessage(update.id, {
                text: welmess,
                mentions: [userId, adminId],
              });
            }
          } catch (error) {
            console.error("خطأ أثناء إرسال رسالة الترحيب:", error);
          }
        }
      }
    });
  }
};

handler.help = ['setwelcome'];
handler.tags = ['group'];
handler.command = ['slmc'];
handler.admin = true;

export default handler;
