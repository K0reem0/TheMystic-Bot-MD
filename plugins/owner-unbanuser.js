const handler = async (m, { conn, participants, usedPrefix, command }) => {
 const BANtext = `*منهو الي تبي تفك المنع عنه من البوت*`;
  
  if (!m.mentionedJid?.[0] && !m.quoted) {
    return m.reply(BANtext, m.chat, { mentions: conn.parseMention(BANtext) });
  }

  let who;
  if (m.isGroup) {
    who = m.mentionedJid?.[0] ? m.mentionedJid[0] : await m?.quoted?.sender;
  } else {
    who = m.chat;
  }

  const users = global.db.data.users;
  users[who].banned = false;
  m.reply('✅ تمت.');
};

handler.command = /^بان-فك$/i;
handler.rowner = true;
export default handler;
