import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command, text, participants }) => {
  const user = global.db.data.users[m.sender];
  const isAdmin = participants?.some(p => p.jid === m.sender && p.admin);

    if (command === 'كتم') {
        if (!isAdmin && !user.mutorol) {
    return m.reply(`❌ ليس لديك صلاحية استخدام أمر كتم.\n🛒 يمكنك شراء هذه الميزة من المتجر باستخدام:\n${usedPrefix}شراء كتم`);
        }

        const groupMetadata = await conn.groupMetadata(m.chat);
        const groupOwner = groupMetadata.owner || m.chat.split('-')[0] + '@s.whatsapp.net';

        if (m.mentionedJid?.[0] === groupOwner) throw "تخسي تكتم ولومي";

        let target = m.mentionedJid?.[0] ?? (m.quoted ? await m.quoted.sender : m.sender);
        if (!target) {
            conn.reply(m.chat, "منشن الي تبي تسكته 👤", m);
            return;
        }

        if (target === conn.user.jid) throw "على خشمي قال يسكتني";

        // Ensure user entry exists in database
        if (!global.db.data.users[target]) {
            global.db.data.users[target] = {};
        }

        // Check if already muted
        if (global.db.data.users[target].muto) throw "سكتنا البثر ذا 🔇";
        if (!isAdmin) user.mutorol = false; // إزالة الصلاحية بعد الاستخدام

        // Set muto to true with timestamp
        global.db.data.users[target].muto = {
            status: true,
            timestamp: Date.now()
        };

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

        conn.reply(m.chat, "النشبه ذا اشغلنا اسكت 🔇 (لمدة دقيقتين)", muteNotification, null, { mentions: [target] });

        // Set timeout to automatically unmute after 2 minutes (120000 milliseconds)
        setTimeout(async () => {
            if (global.db.data.users[target]?.muto?.status) {
                global.db.data.users[target].muto = { status: false };
                
                // Unmute notification
                const unmuteNotification = {
                    key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'auto-unmute-notif' },
                    message: {
                        locationMessage: {
                            name: 'انتهى الكتم تلقائياً',
                            jpegThumbnail: await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer(),
                            vcard: null,
                        },
                    },
                    participant: '0@s.whatsapp.net',
                };
                
                conn.reply(m.chat, `انتهى كتم @${target.split('@')[0]} تلقائياً بعد دقيقتين 🔊`, unmuteNotification, null, { mentions: [target] });
            }
        }, 120000);
    }

    if (command === 'لكتم') {
        if (!isAdmin) throw "للمشرفين فقط 👑";

        let target = m.mentionedJid?.[0] ?? (m.quoted ? await m.quoted.sender : m.sender);
        if (!target) {
            conn.reply(m.chat, "منشن الشخص الي تبي تشيل الكتم عنه 👤", m);
            return;
        }

        if (target === m.sender) throw "كلم مشرف يشيل الكتم عنك";

        // Ensure user entry exists in database
        if (!global.db.data.users[target]) {
            global.db.data.users[target] = { muto: { status: false } };
        }

        // Check if already unmuted
        if (!global.db.data.users[target].muto?.status) {
            conn.reply(m.chat, "هذا مب مكتوم", m);
            return;
        }

        // Set muto to false
        global.db.data.users[target].muto = { status: false };

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

        conn.reply(m.chat, "خلاص تعال اشتقنا لسوالفك 😔 🔊", unmuteNotification, null, { mentions: [target] });
    }
};

// Function to handle all incoming messages
handler.all = async function (m) {
    const sender = m.sender || m.key.participant || m.key.remoteJid;

    // Check if the sender is muted
    if (global.db.data.users[sender]?.muto?.status) {
        // Check if mute has expired (2 minutes)
        const muteTime = global.db.data.users[sender].muto.timestamp;
        if (Date.now() - muteTime > 120000) {
            global.db.data.users[sender].muto = { status: false };
            return;
        }
        
        // If muted, delete the message
        await this.sendMessage(m.chat, { delete: m.key });
    }
};

// Command aliases and properties
handler.command = /^(كتم|لكتم)$/i;
handler.group = true;
handler.botAdmin = true;

export default handler;
