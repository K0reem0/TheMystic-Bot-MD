const handler = async (m, { conn, text }) => {
    // Ensure that the command is only executed by the owner
    if (!m.isOwner) {
        return conn.sendMessage(m.chat, { text: "You do not have permission to execute this command." }, { quoted: m });
    }

    // Loop through all users and reset their rank (exp) and messages
    for (let user in global.global.db.data.users) {
        global.global.db.data.users[user].exp = 200; // Reset experience to 10
        global.global.db.data.users[user].messages = 1;// Reset messages to 1
        global.global.db.data.users[user].dailymessages = 1;
        global.global.db.data.users[user].level = 0;
    }

    // Send confirmation message
    conn.sendMessage(m.chat, { text: "Experience and message counts have been reset for all users." }, { quoted: m });
};

handler.tags = ['owner'];
handler.command = /(تصفير_رانك)$/i; // New command to reset rank for all users
handler.rowner = true;
export default handler;
