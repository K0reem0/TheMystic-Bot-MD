import fs from 'fs';

const handler = async (m, { conn, text }) => {
    try {
        const globalData = global.global.db.data.users;
        const idioma = globalData[m.sender]?.language || global.defaultLenguaje;
        const translations = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
        const tradutor = translations.plugins.owner_resetuser;

        const numberPattern = /\d+/g;
        let user = '';
        const numberMatches = text?.match(numberPattern);
        if (numberMatches) {
            const number = numberMatches.join('');
            user = `${number}@s.whatsapp.net`;
        } else if (m.quoted?.sender) {
            const quotedNumberMatches = m.quoted.sender.match(numberPattern);
            if (quotedNumberMatches) {
                const number = quotedNumberMatches.join('');
                user = `${number}@s.whatsapp.net`;
            } else {
                return conn.sendMessage(m.chat, { text: tradutor.texto1 }, { quoted: m });
            }
        } else {
            return conn.sendMessage(m.chat, { text: tradutor.texto2 }, { quoted: m });
        }

        const userNumber = user.split('@')[0];

        if (!globalData[user] || globalData[user] === '') {
            return conn.sendMessage(
                m.chat,
                { text: `${tradutor.texto3[0]} @${userNumber} ${tradutor.texto3[1]}`, mentions: [user] },
                { quoted: m }
            );
        }

        // Save the name, image, and registration status
        const { name, image, registered } = globalData[user];

        // Reset all data except name, image, and registered
        globalData[user] = {
            name,
            image,
            registered,
            // Reset other fields here (clear all user-specific data except these)
            // For example:
            language: undefined,
            preferences: undefined,
            settings: undefined,
            // Add any other fields you wish to clear
        };

        conn.sendMessage(
            m.chat,
            { text: `${tradutor.texto4[0]} @${userNumber} ${tradutor.texto4[1]}`, mentions: [user] },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, { text: 'An unexpected error occurred.' }, { quoted: m });
    }
};

handler.tags = ['owner'];
handler.command = /(restablecerdatos|deletedatauser|resetuser)$/i;
handler.rowner = true;
export default handler;
