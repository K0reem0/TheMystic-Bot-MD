const handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || '';
  
  if (/image/.test(mime)) {
    let img = await q.download();
    if (!img) return m.reply(`❌ يرجى إرفاق صورة لتغيير صورة المجموعة`);

    try {
      await conn.updateProfilePicture(m.chat, img);
      m.reply(`✅ تم تغيير صورة المجموعة بنجاح`);
    } catch (e) {
      await m.reply(`❌ فشل في تغيير الصورة، قد لا أملك الصلاحيات الكافية\n> إذا كنت تعتقد أن هناك مشكلة، يرجى مراجعة الدعم الفني`);
    }
  } else {
    m.reply(`❌ يرجى إرفاق صورة لتغيير صورة المجموعة`);
  }
}

handler.command = ['افتار'];
handler.tags = ['group'];
handler.help = ['افتار'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
