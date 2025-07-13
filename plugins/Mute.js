import fetch from 'node-fetch';

const handler = async (message, { conn, command, text, isAdmin }) => {
    if (command === 'كتم') {
        if (!isAdmin) throw "للمشرفين فقط 👑";

        const groupMetadata = await conn.groupMetadata(message.chat);
        const groupOwner = groupMetadata.owner || message.chat.split('-')[0] + '@s.whatsapp.net';

        if (message.mentionedJid?.[0] === groupOwner) throw "تخسي تكتم هنودي";

        let target = message.mentionedJid?.[0] || message.quoted?.sender || text;
        if (!target) {
            conn.reply(message.chat, "منشن الي تبي تسكته 👤", message);
            return;
        }

        if (target === conn.user.jid) throw "على خشمي قال يسكتني";

        // Ensure user entry exists in database
        if (!global.db.data.users[target]) {
            global.db.data.users[target] = {};
        }

        // Check if already muted
        if (global.db.data.users[target].muto) throw "سكتنا البثر ذا 🔇";

        // Set muto to true
        global.db.data.users[target].muto = true;

        // Mute notification
        const muteNotification = {
            key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'muta-notif' },
            message: {
                locationMessage: {
                    name: 'اخرس',
                    jpegThumbnail: await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer(),
                    vcard: null,
                },
            },
            participant: '0@s.whatsapp.net',
        };

        conn.reply(message.chat, "النشبه ذا اشغلنا اسكت 🔇", muteNotification, null, { mentions: [target] });
    }

    if (command === 'لكتم') {
        if (!isAdmin) throw "للمشرفين فقط 👑";

        let target = message.mentionedJid?.[0] || message.quoted?.sender || text;
        if (!target) {
            conn.reply(message.chat, "منشن الشخص الي تبي تشيل الكتم عنه 👤", message);
            return;
        }

        if (target === message.sender) throw "كلم مشرف يشيل الكتم عنك";

        // Ensure user entry exists in database
        if (!global.db.data.users[target]) {
            global.db.data.users[target] = { muto: false };
        }

        // Check if already unmuted
        if (!global.db.data.users[target].muto) {
            conn.reply(message.chat, "هذا مب مكتوم", message);
            return;
        }

        // Set muto to false
        global.db.data.users[target].muto = false;

        // Unmute notification
        const unmuteNotification = {
            key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'unmute-notif' },
            message: {
                locationMessage: {
                    name: 'اسف 😔',
                    jpegThumbnail: await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer(),
                    vcard: null,
                },
            },
            participant: '0@s.whatsapp.net',
        };

        conn.reply(message.chat, "خلاص تعال اشتقنا لسوالفك 😔 🔊", unmuteNotification, null, { mentions: [target] });
    }
};

// Function to handle all incoming messages
handler.all = async function (m) {
    const sender = m.sender || m.key.participant || m.key.remoteJid;

    // Check if the sender is muted
    if (global.db.data.users[sender]?.muto) {
        // If muted, delete the message
        await this.sendMessage(m.chat, { delete: m.key });
    }
};

// Command aliases and properties
handler.command = /^(كتم|لكتم)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
