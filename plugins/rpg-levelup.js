import { canLevelUp, xpRange } from '../src/libraries/levelling.js'

let handler = async (m, { conn }) => {
    let name = conn.getName(m.sender);
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/assets/images/menu/main/galaxyMenu.png');
    let user = global.db.data.users[m.sender];

    if (!canLevelUp(user.level, user.exp, global.multiplier)) {
        let { min, xp, max } = xpRange(user.level, global.multiplier);
        let lvl = `*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *الأسم :*  *${name}*
◍ *المستوى :*  *${user.level}*
◍ *الخبرة :* *${user.exp - min}/${xp}*
◍ *التصنيف :* *${user.role}*
*❃ ──────⊰ ❀ ⊱────── ❃*

*مرحبا* *${name}* *لا يمكنك الترقي حاليا. أنت تحتاج إلى* *${max - user.exp}* *للصعود للمستوى التالي.*
`;
        conn.sendFile(m.chat, pp, 'levelup.jpg', lvl, m);
        return;
    }

    let before = user.level * 1;
    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++;

    if (before !== user.level) {
        // The user's role is updated automatically in your `handler.before` logic.
        let teks = `تهانينا ${name} على الوصول إلى المستوى ${user.level}!`;
        let str = `
*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *المستوى السابق :* *${before}*
◍ *المستوى الحالي :* *${user.level}*
◍ *التصنيف الحالي :* *${user.role}*
*❃ ──────⊰ ❀ ⊱────── ❃*
        `.trim();

        try {
            const img = await levelup(teks, user.level); // Assuming `levelup` generates an image.
            conn.sendFile(m.chat, pp, 'levelup.jpg', str, m);
        } catch (e) {
            m.reply(str);
        }
    }
};

handler.help = ['levelup'];
handler.tags = ['xp'];
handler.command = ['nivel', 'lvl', 'لفل'];

export default handler;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
