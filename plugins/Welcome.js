// Store groups where welcome messages are enabled
global.welcomeEnabledGroups = global.welcomeEnabledGroups || [];

// Command to enable welcome messages in a group
async function enableWelcomeCommand(m, { isGroup, isAdmin }) {
    if (!isGroup) return m.reply('❌ هذا الأمر يعمل في المجموعات فقط.');
    if (!isAdmin) return m.reply('❌ هذا الأمر مخصص للمشرفين فقط.');

    const groupId = m.chat;

    if (global.welcomeEnabledGroups.includes(groupId)) {
        return m.reply('✅ تم تفعيل الترحيب بالفعل في هذه المجموعة.');
    }

    global.welcomeEnabledGroups.push(groupId);
    m.reply('✅ تم تفعيل رسائل الترحيب في هذه المجموعة.');
}

// Command to disable welcome messages in a group
async function disableWelcomeCommand(m, { isGroup, isAdmin }) {
    if (!isGroup) return m.reply('❌ هذا الأمر يعمل في المجموعات فقط.');
    if (!isAdmin) return m.reply('❌ هذا الأمر مخصص للمشرفين فقط.');

    const groupId = m.chat;

    const index = global.welcomeEnabledGroups.indexOf(groupId);
    if (index === -1) {
        return m.reply('✅ رسائل الترحيب معطلة بالفعل في هذه المجموعة.');
    }

    global.welcomeEnabledGroups.splice(index, 1);
    m.reply('✅ تم تعطيل رسائل الترحيب في هذه المجموعة.');
}

// Welcome message listener
if (!global.welcomeListenerInitialized) {
    conn.ev.off('group-participants.update'); // Remove duplicate listeners

    conn.ev.on('group-participants.update', async (update) => {
        try {
            if (update.action !== 'add') return;

            const groupId = update.id;

            // Check if welcome is enabled for this group
            if (!global.welcomeEnabledGroups.includes(groupId)) return;

            const adminId = '201061126830@s.whatsapp.net'; // Admin ID to mention

            for (const userId of update.participants) {
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

                // Send the welcome message
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
            }
        } catch (error) {
            console.error(`Error sending welcome message: ${error.message}`);
        }
    });

    global.welcomeListenerInitialized = true; // Ensure listener is initialized only once
}

// Register the commands
handler.command = {
    enableWelcome: enableWelcomeCommand,
    disableWelcome: disableWelcomeCommand,
};
handler.help = ['enablewelcome', 'disablewelcome'];
handler.tags = ['group'];
handler.group = true;
handler.admin = true;

export default handler;
