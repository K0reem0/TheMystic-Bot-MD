import { createHash } from 'crypto';
import { canLevelUp, xpRange } from '../src/libraries/levelling.js';
import Canvacord from 'canvacord';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function downloadImage(url, filename) {
  const filePath = path.join('./tmp', filename);
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.mkdirSync('./tmp', { recursive: true });
  fs.writeFileSync(filePath, response.data);
  return filePath;
}

let handler = async (m, { conn }) => {
  let who = m.quoted
    ? m.quoted.sender
    : m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.fromMe
    ? conn.user.jid
    : m.sender;

  // إذا المستخدم غير موجود في قاعدة البيانات أنشئ له سجل جديد
  if (!global.db.data.users[who]) {
    global.db.data.users[who] = {
      registered: false,
      name: null,
      regTime: null,
      image: null,
      exp: 100,
      messages: 0,
      credit: 0,
      level: 0,
      role: '👦🏻 مواطن',
      warn: 0
    };
  }

  let user = global.db.data.users[who];

  // إذا exp أو level ليست أرقام صحيحة، تعيين القيم الافتراضية
  if (isNaN(user.exp) || user.exp === undefined) user.exp = 100;
  if (isNaN(user.level) || user.level === undefined) user.level = 0;
  if (isNaN(user.messages) || user.messages === undefined) user.messages = 0;
  if (isNaN(user.credit) || user.credit === undefined) user.credit = 0;


  // روابط الصور
  const defaultAvatarUrl = 'https://files.catbox.moe/yjj0x6.jpg';
  const backgroundUrl = 'https://files.catbox.moe/pdcon2.jpg';

  // تحميل الصور
  let pp;
  try {
    pp = await conn.profilePictureUrl(who, 'image');
  } catch {
    pp = defaultAvatarUrl;
  }
  pp = await downloadImage(pp, 'avatar.png');
  let customBackground = await downloadImage(backgroundUrl, 'rankbg.jpg');

  let { name, exp, credit, registered, level, role, warn, messages } = user;
  let { min, xp, max } = xpRange(level, global.multiplier);
  let username = conn.getName(who);
  let prem = global.prems.includes(who.split('@')[0]);

  let crxp = exp - min;
  let requiredXpToLevelUp = xp;

  const card = await new Canvacord.Rank()
    .setAvatar(pp)
    .setLevel(level)
    .setCurrentXP(crxp)
    .setRequiredXP(requiredXpToLevelUp)
    .setProgressBar('#f6a623', 'COLOR')
    .setDiscriminator(who.substring(3, 7))
    .setCustomStatusColor('#f6a623')
    .setLevelColor('#FFFFFF', '#FFFFFF')
    .setOverlay('#000000')
    .setUsername(username)
    .setBackground('IMAGE', customBackground)
    .setRank(level, 'LEVEL', false)
    .renderEmojis(true)
    .build();

  const str = `*❃ ──────⊰ ❀ ⊱────── ❃*

*🪪 الأسم :* ${name}

*⚠️ الأنذارات:* ${warn}

*💰 الرصيد :* ${credit} *بيلي*

*⬆️ الخبره :* ${crxp} / ${requiredXpToLevelUp}

*🏆 التصنيف :* ${role}

*✉ الرسائل :* ${messages}

*📇 الحساب :* ${registered ? 'مسجل' : 'غير مسجل'}

*⭐️ العضوية :*  ${prem ? 'مميز' : 'عضو'}

*❃ ──────⊰ ❀ ⊱────── ❃*`;

  try {
    conn.sendFile(m.chat, card, 'rank.jpg', str, m, false, { mentions: [who] });
  } catch (error) {
    console.error(error);
  }
};

handler.help = ['prof'];
handler.tags = ['economy'];
handler.command = ['رانك', 'بروفايل'];

export default handler;
