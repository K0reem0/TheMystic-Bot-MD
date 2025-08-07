const timeout = 60000;
const poin = 500;
const poin_lose = -100;
const poin_bot = 200;

const handler = async (m, { conn, usedPrefix, text }) => {
  conn.suit = conn.suit || {};

  // تحقق من أن المستخدم غير مشترك بلعبة حالياً
  if (Object.values(conn.suit).find(room => room.id.startsWith('suit') && [room.p, room.p2].includes(m.sender))) {
    throw '❗ أنت بالفعل داخل لعبة حجر ورقة مقص.';
  }

  const textquien = `👤 من تريد أن تتحدى؟\nاستخدم: ${usedPrefix}suit @اسم_العضو`;
  if (!m.mentionedJid[0]) return m.reply(textquien, m.chat, { mentions: conn.parseMention(textquien) });

  // تحقق من أن المستخدم المذكور ليس مشغولاً بلعبة أخرى
  if (Object.values(conn.suit).find(room => room.id.startsWith('suit') && [room.p, room.p2].includes(m.mentionedJid[0]))) {
    throw '⚠️ الشخص الذي تريد تحديه مشغول في لعبة أخرى!';
  }

  const id = 'suit_' + new Date() * 1;
  const caption = `🎮 تحدي جديد!\n\n@${m.sender.split('@')[0]} تحدى @${m.mentionedJid[0].split('@')[0]} في لعبة حجر ✊ ورقة ✋ مقص ✌️!\n\n💬 انتظر القبول...`;

  conn.suit[id] = {
    chat: await conn.sendMessage(m.chat, { text: caption }, { mentions: await conn.parseMention(caption) }),
    id: id,
    p: m.sender,
    p2: m.mentionedJid[0],
    status: 'wait',
    waktu: setTimeout(() => {
      if (conn.suit[id]) {
        conn.reply(m.chat, '⏱️ انتهى الوقت، تم إلغاء التحدي لعدم الرد.', m);
        delete conn.suit[id];
      }
    }, timeout),
    poin,
    poin_lose,
    poin_bot,
    timeout,
  };
};

handler.command = /^تحدي|suit(pvp)?$/i;
handler.group = true;
handler.game = true;

export default handler;
