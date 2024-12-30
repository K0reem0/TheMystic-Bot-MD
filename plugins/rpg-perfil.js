import { createHash } from 'crypto';
import { canLevelUp, xpRange } from '../src/libraries/levelling.js';
import Canvacord from 'canvacord';

let handler = async (m, { conn }) => {
  // Fetch the user data directly using m.sender
  let sender = m.sender;

  if (!(sender in global.db.data.users)) throw `✳️ المستخدم غير موجود في قاعدة البيانات`;

  let pp = await conn.profilePictureUrl(sender, 'image').catch(_ => './src/avatar_contact.png');
  let user = global.db.data.users[sender];
  let about = (await conn.fetchStatus(sender).catch(console.error) || {}).status || '';
  let { name, exp, credit, lastclaim, registered, regTime, age, level, role, wealth, warn, messages } = user;
  let { min, xp, max } = xpRange(user.level, global.multiplier);
  let username = conn.getName(sender);
  let math = max - xp;
  let prem = global.prems.includes(sender.split`@`[0]);
  let sn = createHash('md5').update(sender).digest('hex');

  let crxp = exp - min;
  let customBackground = './rankbg (1).jpg';
  let requiredXpToLevelUp = xp;

  // Create the rank card
  const card = await new Canvacord.Rank()
    .setAvatar(pp)
    .setLevel(level)
    .setCurrentXP(crxp)
    .setRequiredXP(requiredXpToLevelUp)
    .setProgressBar('#e1d4a7', 'COLOR')
    .setDiscriminator(sender.substring(3, 7))
    .setCustomStatusColor('#e1d4a7')
    .setLevelColor('#FFFFFF', '#FFFFFF')
    .setOverlay('#000000')
    .setUsername(name)
    .setBackground('IMAGE', customBackground)
    .setRank(level, 'LEVEL', false)
    .renderEmojis(true)
    .build();

  // Create the profile message
  const str = `
*❃ ──────⊰ ❀ ⊱────── ❃*\n
  *🪪 الأسم :* ${name}\n
  *⚠️ الأنذارات:* ${warn}\n
  *💰 الرصيد :* ${credit} *بيلي*\n
  *⬆️ الخبره :* ${crxp} / ${requiredXpToLevelUp}\n
  *✉ الرسائل :* ${messages}\n
  *🏆 التصنيف :* ${role}\n
  *📇 الحساب :* ${registered ? 'مسجل' : 'غير مسجل'}\n
  *⭐️ العضوية :*  ${prem ? 'مميز' : 'عضو'}\n
*❃ ──────⊰ ❀ ⊱────── ❃*`;

  try {
    // Send the rank card image along with the profile details
    conn.sendFile(m.chat, card, 'rank.jpg', str, m, false, { mentions: [sender] });
  } catch (error) {
    console.error(`Error sending profile card: ${error.message}`);
  }
};

handler.help = ['prof'];
handler.tags = ['economy'];
handler.command = ['رانك', 'بروفايل'];

export default handler;
