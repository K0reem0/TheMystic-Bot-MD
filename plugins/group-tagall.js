let handler = async (m, { conn, participants }) => {
  if (m.chat.endsWith('120363400371988493@g.us')) {
    // جلب قائمة المشطوفين من قاعدة البيانات
    const excludedMembers = global.db.data.excludedMembers || [];
    
    let teks = "*❃ ─────────⊰ ❀ ⊱───────── ❃*\n\n" +  
               "*مـنشــــــن عـــــــــام لأعــــــضاء ومشرفـــين*\n" +  
               "*✦╎『 ‏𝐒𝐏𝐀𝐑𝐓𝐀 𓆩🛡️𓆪 𝐊𝐈𝐍𝐆𝐃𝐎𝐌』╎✦*\n" +  
               "*المنشن خاص للمشرفين نتأسف على الازعاج*\n\n";

    // إلغاء تسجيل من خرجوا من القروب
    Object.keys(global.db.data.users).forEach(userjid => {
      const user = global.db.data.users[userjid];
      const isInParticipants = participants.some(mem => mem.jid === userjid);
      if (user.registered && !isInParticipants) {
        user.registered = false;
        user.name = '';
        user.regTime = 0;
      }
    });

    // تصفية الأعضاء المستثنين
    const filteredParticipants = participants.filter(mem => 
      !excludedMembers.includes(mem.jid)
    );

    // ترتيب حسب الاسم
    filteredParticipants.sort((a, b) => {
      let userA = global.db.data.users[a.jid] || { registered: false, name: "غير مسجل ⚠️" };
      let userB = global.db.data.users[b.jid] || { registered: false, name: "غير مسجل ⚠️" };
      return userA.name.localeCompare(userB.name, 'ar', { sensitivity: 'base' });
    });

    let currentLetter = '';
    let firstLetterUsed = '';
    let foundRegistered = false;
    let unregisteredList = [];

    for (let mem of filteredParticipants) {
      let user = global.db.data.users[mem.jid] || { registered: false, name: "غير مسجل ⚠️" };

      if (user.registered) {
        foundRegistered = true;
        let firstLetter = user.name.charAt(0);

        if (!firstLetterUsed) {
          firstLetterUsed = firstLetter;
          teks += `*❃ ─────────⊰ ${firstLetter} ⊱───────── ❃*\n\n`;
          currentLetter = firstLetter;
        } else if (firstLetter !== currentLetter) {
          teks += `*❃ ─────────⊰ ${firstLetter} ⊱───────── ❃*\n\n`;
          currentLetter = firstLetter;
        }

        teks += `◍ ${user.name} @${mem.jid.split('@')[0]}\n\n`;
      } else {
        unregisteredList.push(`◍ غير مسجل ⚠️ @${mem.jid.split('@')[0]}`);
      }
    }

    if (!foundRegistered) {
      teks += "*❃ ─────────⊰ ⚠️ ⊱───────── ❃*\n\n";
    }

    if (unregisteredList.length > 0) {
      if (foundRegistered) {
        teks += "*❃ ─────────⊰ ⚠️ ⊱───────── ❃*\n\n";
      }
      teks += unregisteredList.join('\n') + '\n';
    }

    teks += "\n*❃ ─────────⊰ ❀ ⊱───────── ❃*";

    conn.sendMessage(m.chat, { 
      text: teks, 
      mentions: filteredParticipants.map(a => a.jid) 
    });
  }
};

handler.help = ['mentionall'];
handler.tags = ['group'];
handler.command = /^منشن$/i;
handler.group = true;
handler.admin = true;

export default handler;
