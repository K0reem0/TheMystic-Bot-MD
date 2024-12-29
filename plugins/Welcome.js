let handler = async (m, { conn, participants, groupMetadata }) => {
    const adminId = '201061126830@s.whatsapp.net'; // Admin ID to mention

    for (const participant of participants) {
        const userId = participant; // The ID of the new member
        let user = global.db.data.users[userId]; // Fetch user data from the database

        // Check if the user is registered
        const registeredName = user && user.registered ? user.name : 'غير مسجل';
        const profilePictureUrl = user && user.image ? user.image : null;
        const groupName = groupMetadata.subject; // Group name

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
            // Send welcome message with user image
            await conn.sendMessage(m.chat, {
                image: { url: profilePictureUrl },
                caption: welcomeMessage,
                mentions: [userId, adminId], // Mention both the user and the admin
            });
        } else {
            // Send welcome message without image
            await conn.sendMessage(m.chat, {
                text: welcomeMessage,
                mentions: [userId, adminId], // Mention both the user and the admin
            });
        }
    }
};

// Handler Metadata
handler.help = ['welcome'];
handler.tags = ['group'];
handler.command = ['welcome']; // Trigger for the command
handler.group = true; // Ensure it only works in groups
handler.admin = true; // Ensure the bot is admin
handler.botAdmin = true; // Ensure the bot is admin
handler.fail = null;

export default handler;
