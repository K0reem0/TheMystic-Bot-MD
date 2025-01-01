let handler = async (m, { conn }) => {
  let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

  if (!(who in global.db.data.users)) throw `✳️ هذا المستخدم غير موجود في قاعدة بياناتي`;

  let user = global.db.data.users[who];
  let now = new Date();
  
  // Check if the user's last reset was not today
  if (user.lastResetDate !== now.toISOString().slice(0, 10)) {
    // Reset dailyMessages count at 12 AM
    user.dailymessages = 0;
    user.lastResetDate = now.toISOString().slice(0, 10); // Store today's date as the last reset date
  }
  
  // Save the updated user data
  global.db.data.users[who] = user;

  // Send the current daily messages count
  conn.reply(m.chat, `*🔢 عدد رسائلك اليومية:* ${user.dailymessages} رسالة`, m);
};

// Command to show daily messages
handler.help = ['dailyMessages'];
handler.tags = ['economy'];
handler.command = ['تفاعلي', 'تفاعله'];

export default handler;
