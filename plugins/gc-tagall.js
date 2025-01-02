let handler = async (m, { conn, participants }) => {
  // Check if the message is from the desired group
  if (m.chat.endsWith('120363041026065606@g.us')) {
    // Header text for the mention message
    let teks = "*❃ ──────⊰ ❀ ⊱────── ❃* \n\n *مـنشــــــن عـــــــــام لأعــــــضاء ومشرفـــين*\n *✦╎𝑨𝒋𝒂𝒓𝒔﹝🌨️﹞𝑲𝒊𝒏𝒈𝒅𝒐𝒎╎✦*\n *المنشن خاص للمشرفين نتأسف على الازعاج* \n\n";

    // Sort participants based on names
    participants.sort((a, b) => {
      let userA = global.db.data.users[a.id] || { registered: false, name: "غير مسجل ⚠️" };
      let userB = global.db.data.users[b.id] || { registered: false, name: "غير مسجل ⚠️" };

      // Ensure names are strings and fallback to "غير مسجل ⚠️" if undefined
      const nameA = userA.name || "غير مسجل ⚠️";
      const nameB = userB.name || "غير مسجل ⚠️";

      return nameA.localeCompare(nameB, 'ar', { sensitivity: 'base' });
    });

    let currentLetter = '';

    // Unregister users who are not in the participants list
    Object.keys(global.db.data.users).forEach(userId => {
      const user = global.db.data.users[userId];
      const isInParticipants = participants.some(mem => mem.id === userId);

      if (user.registered && !isInParticipants) {
        // Unregister the user
        user.registered = false;
        user.name = ''; // Clear the name
        user.regTime = 0; // Reset registration time
      }
    });

    // Loop through participants and create the mention message
    for (let mem of participants) {
      let user = global.db.data.users[mem.id] || { registered: false, name: "غير مسجل ⚠️" };
      let name = user.name || "غير مسجل ⚠️"; // Ensure the name is defined
      let firstLetter = name.charAt(0);

      if (firstLetter !== currentLetter) {
        // Start a new section for the current letter
        teks += `*❃ ──────⊰ ${firstLetter} ⊱────── ❃*\n\n`;
        currentLetter = firstLetter;
      }

      // Add user information to the mention message
      teks += `◍ ${user.registered ? name : "غير مسجل ⚠️"} @${mem.id.split('@')[0]}\n\n`;
    }

    teks += "*❃ ──────⊰ ❀ ⊱────── ❃*";

    // Send the mention message to the group
    conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) });
  }
};

// Command properties
handler.help = ['mentionall'];
handler.tags = ['group'];
handler.command = /^(اجارس)$/i;
handler.group = true;
handler.admin = true;

// Export the handler function
export default handler;
