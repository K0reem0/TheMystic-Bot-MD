let handler = async (m, { conn }) => {
  const mainGroupId = '120363400371988493@g.us'; // ID القروب الأساسي
  const adsGroupId = '120363401321960953@g.us';  // ID قروب الإعلانات

  try {
    let mainGroup = await conn.groupMetadata(mainGroupId);
    let adsGroup = await conn.groupMetadata(adsGroupId);

    let mainJIDs = new Set(mainGroup.participants.map(p => p.jid));
    let adsJIDs = new Set(adsGroup.participants.map(p => p.jid));

    let missing = [];
    for (let jid of mainJIDs) {
      if (!adsJIDs.has(jid)) {
        missing.push(jid);
      }
    }

    let teks = "*✦╎『 ‏𝐒𝐏𝐀𝐑𝐓𝐀 🛡️ 』╎✦*\n";
    teks += "✦ الأعضاء في القروب الأساسي ولم يدخلوا قروب الإعلانات:\n\n";

    if (missing.length === 0) {
      teks += "✅ كل الأعضاء موجودين في قروب الإعلانات.";
    } else {
      missing.forEach((jid, index) => {
        teks += `${index + 1}- @${jid.split('@')[0]}\n`;
      });
      teks += `\n📌 *العدد الإجمالي: ${missing.length} عضو*`;
    }

    conn.sendMessage(m.chat, {
      text: teks,
      mentions: missing
    });

  } catch (e) {
    console.error(e);
    m.reply("⚠️ حصل خطأ أثناء فحص القروبات. تأكد إن البوت مشرف في القروبين.");
  }
};

handler.help = ['checkads'];
handler.tags = ['group'];
handler.command = /^مزامنه$/i;
handler.group = true;
handler.admin = true;

export default handler;
