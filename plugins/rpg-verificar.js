import { createHash } from 'crypto';
import uploadImage from '../src/libraries/uploadImage.js'; // تأكد من صحة المسار

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid?.[0] ?? (m.quoted ? await m.quoted.sender : false);
    } else who = m.chat;

    if (!who) throw '*منشن الشخص أو رد عليه لتسجيله*';

    // أنشئ السجل إذا ما كان موجود
    if (!global.db.data.users[who]) {
        global.db.data.users[who] = {
            registered: false,
            name: null,
            regTime: null,
            image: null,
            exp: 0,
            messages: 0,
        };
    }

    const user = global.db.data.users[who];
    if (user.registered) throw '*تم تسجيل هذا المستخدم مسبقًا*';

    // استخراج الاسم من النص
    let name = '';
    if (m.mentionedJid && m.mentionedJid.length > 0 && text.trim().split(' ').length > 1) {
        name = text.trim().split(' ').slice(1).join(' ');
    } else {
        const nameText = text?.trim();
        if (!nameText) throw `*اكتب الاسم بعد الأمر*\nمثال: ${usedPrefix + command} أحمد`;
        if (nameText.length >= 30) throw '*الاسم طويل جدًا*';
        name = nameText;
    }

    // التأكد من أن الاسم غير مستخدم فقط من قبل مستخدمين مسجلين
    const isNameTaken = Object.entries(global.db.data.users).some(([jid, existingUser]) => {
        return (
            jid !== who &&
            existingUser.registered &&
            existingUser.name?.toLowerCase() === name.toLowerCase()
        );
    });

    if (isNameTaken) throw '*الاسم مستخدم بالفعل*';

    // محاولة أخذ صورة من الرد فقط، لا تأخذ صورة الملف الشخصي
    let imageUrl = null;
    if (m.quoted && /image\/(png|jpe?g)/.test(m.quoted.mimetype)) {
        try {
            const media = await m.quoted.download();
            imageUrl = await uploadImage(media);
        } catch (e) {
            console.error(e);
            throw '*حدث خطأ أثناء تحميل الصورة. حاول مرة أخرى.*';
        }
    }

    user.name = name.trim();
    user.regTime = +new Date();
    user.registered = true;
    user.image = imageUrl;
    user.exp = 100;
    user.messages = 1;

    const sn = createHash('md5').update(who).digest('hex').slice(0, 21);

    const replyMessage = `*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *تم تسجيلك بنجاح*
*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *الاسم:* *${name}*
◍ *الايدي:* *${sn}*
*❃ ──────⊰ ❀ ⊱────── ❃*`;

    if (imageUrl) {
        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: replyMessage
        });
    } else {
        m.reply(replyMessage);
    }
};

handler.help = ['تسجيل <الاسم>'];
handler.tags = ['rg'];
handler.command = ['تسجيل', 'register', 'reg', 'registrar'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
