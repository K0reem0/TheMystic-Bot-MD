import { createHash } from 'crypto';
import uploadImage from '../src/libraries/uploadImage.js'; // Ensure this is the correct path

// Configuration
const adminId = '201061126830@s.whatsapp.net'; // Replace with the actual admin ID
let welcomeEnabled = true; // Flag to control welcome messages

// Function to handle new participants
async function handleNewParticipant(conn, participant) {
    if (!welcomeEnabled) return; // Exit if welcome messages are disabled

    const userId = participant;
    const user = global.db.data.users[userId];

    if (!user || !user.registered) {
        console.warn(`User ${userId} is not registered in the database.`);
        return;
    }

    const name = user.name || 'عضو جديد';
    const imageUrl = user.image;

    const welcomeMessage = `
┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏

مرحباً بك في نقابة اجارس
              ⊰🌨️⊱
⚜︎يسرنا تواجدك بيننـا⚜︎
وانضمامك معنــا و
بكـل ما تحمله معاني الشـوق
⚜︎نتلهف لقراءة مشاركاتك⚜︎

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏

*✧ ♟️┋اللـــقـــب •* ${name}

*✧ 📧┋المـــنشـن •* @${userId.split('@')[0]}

*✧ 🧑🏻‍💻┋المسؤول  •* @${adminId.split('@')[0]}

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏

◈ ⚜︎  قـروب الإعـلانـات 🗞️ ↯↯.
https://chat.whatsapp.com/LLucZEBpwec2n6PvwcRgHD

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏

*⚜︎ 📯 ┃ادارة•* ﹝𝑨𝒋𝒂𝒓𝒔﹞

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏
`;

    try {
        if (imageUrl) {
            await conn.sendMessage(conn.chatId, {
                image: { url: imageUrl },
                caption: welcomeMessage,
                mentions: [userId, adminId]
            });
        } else {
            await conn.sendMessage(conn.chatId, {
                text: welcomeMessage,
                mentions: [userId, adminId]
            });
        }
    } catch (error) {
        console.error('Error sending welcome message:', error);
    }
}

// Event listener for group participants update
conn.ev.on('group-participants.update', async (update) => {
    if (update.action === 'add') {
        for (const userId of update.participants) {
            await handleNewParticipant(conn, userId);
        }
    }
});

// Command to toggle welcome messages
let handler = async (m, { conn, command }) => {
    if (command === 'enablewelcome') {
        welcomeEnabled = true;
        m.reply('Welcome messages have been enabled.');
    } else if (command === 'disablewelcome') {
        welcomeEnabled = false;
        m.reply('Welcome messages have been disabled.');
    }
};

handler.help = ['enablewelcome', 'disablewelcome'];
handler.tags = ['admin'];
handler.command = ['enablewelcome', 'disablewelcome'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
