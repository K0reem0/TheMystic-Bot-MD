import { createHash } from 'crypto';
import { canLevelUp, xpRange } from '../src/libraries/levelling.js';
import Canvacord from 'canvacord';

let handler = async (m, { conn }) => {
  let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

  if (!(who in global.db.data.users)) throw `✳️ اهذا المستخدم غير موجود ف قاعدة بياناتي`;

  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png');
  let user = global.db.data.users[who];
  let about = (await conn.fetchStatus(who).catch(console.error) || {}).status || ''
  let { name, exp, credit, lastclaim, registered, regTime, age, level, role, wealth, warn, messages } = global.db.data.users[who];
  let { min, xp, max } = xpRange(user.level, global.multiplier);
  let username = conn.getName(who);
  let math = max - xp;
  let prem = global.prems.includes(who.split`@`[0]);
  let sn = createHash('md5').update(who).digest('hex');

  let crxp = exp - min
  let customBackground  = './rankbg (1).jpg'
  let requiredXpToLevelUp = xp

  const card = await new Canvacord.Rank()
  .setAvatar(pp)
  .setLevel(level)
  .setCurrentXP(crxp) 
  .setRequiredXP(requiredXpToLevelUp) 
  .setProgressBar('#e1d4a7', 'COLOR') // Set progress bar color here
  .setDiscriminator(who.substring(3, 7))
  .setCustomStatusColor('#e1d4a7')
  .setLevelColor('#FFFFFF', '#FFFFFF')
  .setOverlay('#000000')
  .setUsername(username)
  .setBackground('IMAGE', customBackground)
  .setRank(level, 'LEVEL', false)
  .renderEmojis(true)
  .build();

  const str = `
*❃ ──────⊰ ❀ ⊱────── ❃*\n
  *🪪 الأسم :* ${username}\n
  *⚠️ الأنذارات:* ${warn}\n
  *💰 الرصيد :* ${credit} *بيلي*\n
  *⬆️ الخبره :* ${crxp} / ${requiredXpToLevelUp}\n
  *✉ الرسائل :* ${messages}\n
  *🏆 التصنيف :* ${role}\n
  *📇 الحساب :* ${registered ? 'مسجل': 'غير مسجل'}\n
  *⭐️ العضوية :*  ${prem ? 'مميز' : 'عضو'}\n
*❃ ──────⊰ ❀ ⊱────── ❃*`
 

  try {
    conn.sendFile(m.chat, card, 'rank.jpg', str, m, false, { mentions: [who] });
    m.react('✅');
  } catch (error) {
    console.error(error);
  }}

handler.help = ['prof'];
handler.tags = ['economy'];
handler.command = ['رانك','بروفايل'];

export default handler;
