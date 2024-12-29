let handler = async (m, { conn, participants, groupMetadata, isAdmin, isBotAdmin, text, command }) => {
    const groupId = m.chat; // Current group ID
    const adminId = '201061126830@s.whatsapp.net'; // Admin ID to mention

    // Initialize the database if not already set
    if (!global.db.data.groups) global.db.data.groups = {};
    if (!global.db.data.groups[groupId]) global.db.data.groups[groupId] = { welcomeEnabled: true };

    const groupData = global.db.data.groups[groupId];
    const welcomeEnabled = groupData.welcomeEnabled;

    if (command === 'enablewelcome') {
        if (!isAdmin) throw '❌ *Only group admins can enable the welcome message.*';
        groupData.welcomeEnabled = true;
        return m.reply('✅ *Welcome messages have been enabled for this group.*');
    }

    if (command === 'disablewelcome') {
        if (!isAdmin) throw '❌ *Only group admins can disable the welcome message.*';
        groupData.welcomeEnabled = false;
        return m.reply('✅ *Welcome messages have been disabled for this group.*');
    }

    if (!welcomeEnabled) return; // Do nothing if welcome is disabled for the group

    for (const participant of participants) {
        const userId = participant.id || participant; // Handle both object and string formats
        let user = global.db.data.users[userId]; // Fetch user data from the database

        // Check if the user is registered
        const registeredName = user && user.registered ? user.name : 'غير مسجل';
        const profilePictureUrl = user && user.image ? user.image : null;

        const welcomeMessage = `┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏

مرحباً بك في نقابة اجارس
              ⊰🌨️⊱
⚜︎يسرنا تواجدك بيننـا⚜︎
وانضمامك معنــا و
بكـل ما تحمله معاني الشـوق
⚜︎نتلهف لقراءة مشاركاتك⚜︎

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏
 
*✧ ♟️┋اللـــقـــب • 〘${registeredName}〙*

*✧ 📧┋المـــنشـن • 〘@${userId.split('@')[0]}〙*

*✧ 🧑🏻‍💻┋المسؤول  • 〘@${adminId.split('@')[0]}〙*

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏

  ◈ ⚜︎  قـروب الإعـلانـات 🗞️ ↯↯.
〘 https://chat.whatsapp.com/LLucZEBpwec2n6PvwcRgHD 〙

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏

*⚜︎ 📯 ┃ادارة•* ﹝𝑨𝒋𝒂𝒓𝒔﹞

┓═━━━──┄⊹⊱ «◈» ⊰⊹┄──━━━═┏`;

        // Send message with or without user image
        if (profilePictureUrl) {
            await conn.sendMessage(m.chat, {
                image: { url: profilePictureUrl },
                caption: welcomeMessage,
                mentions: [userId, adminId], // Mention both the user and the admin
            });
        } else {
            await conn.sendMessage(m.chat, {
                text: welcomeMessage,
                mentions: [userId, adminId], // Mention both the user and the admin
            });
        }
    }
};

// Handler Metadata
handler.help = ['enablewelcome', 'disablewelcome'];
handler.tags = ['group'];
handler.command = ['enablewelcome', 'disablewelcome']; // Commands to enable/disable
handler.group = true; // Ensure it only works in groups
handler.admin = true; // Ensure the user is admin
handler.botAdmin = true; // Ensure the bot is admin
handler.fail = null;

// Listener for group participants update
handler.participantsUpdate = async (m, { conn, participants, groupMetadata }) => {
    await handler(m, { conn, participants, groupMetadata });
};

export default handler;
