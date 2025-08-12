import { canLevelUp, xpRange } from '../src/libraries/levelling.js';
import Canvacord from 'canvacord';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const roles = {
    'مواطن 👦🏻': 0,
    'شونين⚔️': 3,
    'ساموراي 🗡': 4,
    'شينوبي 🗡': 6,
    'تارتاروس 👹': 8,
    'نينجا⚔️': 12,
    'ملك التنانين 🐉': 13,
    'يونكو 🧛🏻': 14,
    'شينيغامي 💀': 16,
    'ملك قراصنة👒': 20,
    'ملك👑🤴🏻': 24,
    'الأسطورة الخالدة': 28,
    'هاشيرا🔥🗡️': 32,
    'الفارس الأسود 🖤': 36,
    'حاكم الدمار👺': 48,
    'شيطان🥀⚰️': 52,
    'القوت 🐐': 56,
    'العم': 60,
    'العم آرثر': 100,
}

async function downloadImage(url, filename) {
    const filePath = path.join('./tmp', filename);
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.mkdirSync('./tmp', { recursive: true });
    fs.writeFileSync(filePath, response.data);
    return filePath;
}

const defaultAvatarUrl = 'https://files.catbox.moe/yjj0x6.jpg';
const backgroundUrl = 'https://files.catbox.moe/pdcon2.jpg';

export async function before(m, { conn }) {
    let user = global.db.data.users[m.sender];
    let name = conn.getName(m.sender);

    let beforeLevel = user.level * 1;

    // Level up loop
    while (canLevelUp(user.level, user.exp, global.multiplier)) {
        user.level++;
    }

    // تحديث الدور بعد الترقية
    user.role = (Object.entries(roles)
        .sort((a, b) => b[1] - a[1])
        .find(([, minLevel]) => user.level >= minLevel) || Object.entries(roles)[0])[0];

    if (beforeLevel !== user.level) {
        let { min, xp } = xpRange(user.level, global.multiplier);
        let crxp = user.exp - min;
        let requiredXpToLevelUp = xp;

        // تحميل الصور
        let pp;
        try {
            pp = await conn.profilePictureUrl(m.sender, 'image');
        } catch {
            pp = defaultAvatarUrl;
        }
        pp = await downloadImage(pp, 'avatar.png');
        let customBackground = await downloadImage(backgroundUrl, 'rankbg.jpg');

        const card = await new Canvacord.Rank()
            .setAvatar(pp)
            .setLevel(user.level)
            .setCurrentXP(crxp)
            .setRequiredXP(requiredXpToLevelUp)
            .setProgressBar('#f6a623', 'COLOR')
            .setDiscriminator(m.sender.substring(3, 7))
            .setCustomStatusColor('#f6a623')
            .setLevelColor('#FFFFFF', '#FFFFFF')
            .setOverlay('#000000')
            .setUsername(name)
            .setBackground('IMAGE', customBackground)
            .setRank(level, 'LEVEL', false)
            .renderEmojis(true)
            .build();

        let message = `*❃ ──────⊰ ❀ ⊱────── ❃*\n
*🎊 ازداد مستواك 🎉*\n
*المستوى السابق :* *${beforeLevel}*\n
*المستوى الحالي :* *${user.level}*\n
*التصنيف :* *${user.role}*\n
*❃ ──────⊰ ❀ ⊱────── ❃*`;

        try {
            await conn.sendFile(m.chat, card, 'levelup.jpg', message, m);
        } catch (error) {
            console.error(error);
            m.reply(message);
        }
    }
}
