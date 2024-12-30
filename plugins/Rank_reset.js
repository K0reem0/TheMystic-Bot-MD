const handler = async (m, { conn, text }) => {
    const numberPattern = /\d+/g;
    let user = '';
    const numberMatches = text.match(numberPattern);
    if (numberMatches) {
        const number = numberMatches.join('');
        user = number + '@s.whatsapp.net';
    } else if (m.quoted && m.quoted.sender) {
        const quotedNumberMatches = m.quoted.sender.match(numberPattern);
        if (quotedNumberMatches) {
            const number = quotedNumberMatches.join('');
            user = number + '@s.whatsapp.net';
        } else {
            return conn.sendMessage(m.chat, { text: "Invalid user input." }, { quoted: m });
        }
    } else {
        return conn.sendMessage(m.chat, { text: "Please specify a user or reply to a message." }, { quoted: m });
    }

    const userNumber = user.split('@')[0];
    if (!global.global.db.data.users[user]) {
        return conn.sendMessage(m.chat, { text: `User @${userNumber} does not exist in the database.`, mentions: [user] }, { quoted: m });
    }

    global.global.db.data.users[user].exp = 10;
    global.global.db.data.users[user].messages = 1;

    conn.sendMessage(m.chat, { text: `Experience and messages for user @${userNumber} have been reset.`, mentions: [user] }, { quoted: m });
};

handler.tags = ['owner'];
handler.command = /(تصفير_رانك)$/i;
handler.rowner = true;
export default handler;
