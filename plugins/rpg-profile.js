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
  let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

  if (!(who in global.db.data.users)) throw '✳️ اهذا المستخدم غير موجود ف قاعدة بياناتي';

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

  let user = global.db.data.users[who];
  let { name, exp, credit, registered, level, role, warn } = user;
  let { min, xp, max } = xpRange(user.level, global.multiplier);
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
