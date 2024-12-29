let handler = async function (m, { conn, text, usedPrefix }) {
  // Check if the message has a mentioned user
  let targetUser = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0]);

  // If no mentioned user, extract the name to unregister
  if (!targetUser) {
    let name = text.trim();

    // Check if the user exists in the database
    targetUser = Object.keys(global.db.data.users).find(
      id => global.db.data.users[id].name &&
        typeof global.db.data.users[id].name === 'string' &&
        global.db.data.users[id].name.toLowerCase() === name.toLowerCase()
    );

    if (!targetUser) {
      throw `*أكتب اللقب الي تبيه ينحذف أو قم بعمل منشن للشخص*`;
    }
  }

  // Ensure the target user exists in the database
  if (!global.db.data.users[targetUser]) {
    throw `*المستخدم غير موجود في قاعدة البيانات*`;
  }

  // Unregister the user and clear the data
  global.db.data.users[targetUser].registered = false;
  global.db.data.users[targetUser].name = ''; // Clear the name
  global.db.data.users[targetUser].regTime = 0; // Reset registration time
  global.db.data.users[targetUser].image = null; // Clear the image

  // Respond with a confirmation
  m.reply(`*تم حذف اللقب والصورة من قاعدة البيانات، الآن صار اللقب متوفر*`);
};

// Rest of the handler definition (help, tags, command, etc.) remains the same

handler.help = ['unreg'].map(v => v + ' <الأسم>')
handler.tags = ['rg']
handler.command = ['ازاله', 'ازالة', 'unregister', 'unregistrar'] 
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler;
