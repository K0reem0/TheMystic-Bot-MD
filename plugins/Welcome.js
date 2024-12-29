// Initialize a global list for groups with welcome messages enabled
global.welcomeEnabledGroups = global.welcomeEnabledGroups || [];

// Command to enable welcome messages in a group
async function enableWelcomeCommand(m, { conn, text, isGroup }) {
    if (!isGroup) return m.reply('هذا الأمر يعمل في المجموعات فقط.');
    const groupId = m.chat;

    if (global.welcomeEnabledGroups.includes(groupId)) {
        return m.reply('تم تفعيل الترحيب بالفعل في هذه المجموعة.');
    }

    global.welcomeEnabledGroups.push(groupId);
    m.reply('تم تفعيل رسائل الترحيب في هذه المجموعة.');
}

// Command to disable welcome messages in a group
async function disableWelcomeCommand(m, { conn, text, isGroup }) {
    if (!isGroup) return m.reply('هذا الأمر يعمل في المجموعات فقط.');
    const groupId = m.chat;

    const index = global.welcomeEnabledGroups.indexOf(groupId);
    if (index === -1) {
        return m.reply('رسائل الترحيب معطلة بالفعل في هذه المجموعة.');
    }

    global.welcomeEnabledGroups.splice(index, 1);
    m.reply('تم تعطيل رسائل الترحيب في هذه المجموعة.');
}

// Welcome message handler
if (!global.welcomeListenerInitialized) {
    conn.ev.off('group-participants.update'); // Remove previous listeners

    conn.ev.on('group-participants.update', async (update) => {
        if (update.action !== 'add') return;

        const groupId = update.id;

        // Check if the welcome message is enabled for this group
        if (!global.welcomeEnabledGroups.includes(groupId)) return;

        const adminId = '201061126830@s.whatsapp.net'; // Admin ID to mention

        for (const userId of update.participants) {
            try {
                // Validate userId
                if (!userId) continue;

                const user = global.db.data.users[userId] || {};
                const name = user.registered ? user.name : 'غير مسجل';
                const profilePictureUrl = user.image || null;

                // Construct the welcome message
                const welcomeMessage = `┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏

مرحباً بك في نقابة اجارس
              ⊰🌨️⊱
⚜︎يسرنا تواجدك بيننـا⚜︎
وانضمامك معنــا و
بكـل ما تحمله معاني الشـوق
⚜︎نتلهف لقراءة مشاركاتك⚜︎

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏
 
*✧ ♟️┋اللـــقـــب • 〘${name}〙*

*✧ 📧┋المـــنشـن • 〘@${userId.split('@')[0]}〙*

*✧ 🧑🏻‍💻┋المسؤول  • 〘@${adminId.split('@')[0]}〙*

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏

  ◈ ⚜︎  قـروب الإعـلانـات 🗞️ ↯↯.
〘 https://chat.whatsapp.com/LLucZEBpwec2n6PvwcRgHD 〙

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏

*⚜︎ 📯 ┃ادارة•* ﹝𝑨𝒋𝒂𝒓𝒔﹞

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏`;

                // Send welcome message with or without image
                if (profilePictureUrl) {
                    await conn.sendMessage(groupId, {
                        image: { url: profilePictureUrl },
                        caption: welcomeMessage,
                        mentions: [userId, adminId],
                    });
                } else {
                    await conn.sendMessage(groupId, {
                        text: welcomeMessage,
                        mentions: [userId, adminId],
                    });
                }
            } catch (error) {
                console.error(`Error sending welcome message: ${error}`);
            }
        }
    });

    global.welcomeListenerInitialized = true; // Mark listener as initialized
}

// Register the commands
handler.command = {
    تفعيل_ترحيب: enableWelcomeCommand,
    ايقاف_ترحيب: disableWelcomeCommand,
};
handler.help = ['enablewelcome', 'disablewelcome'];
handler.tags = ['group'];
handler.group = true;
handler.admin = true;

export default handler;
