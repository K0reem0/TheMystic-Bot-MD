const handler = async (m, { conn, participants }) => {
  const user = global.db.data.users[m.sender];
  const isAdmin = participants?.some(p => p.jid === m.sender && p.admin);

  // إذا لم يكن مشرفًا، تأكّد من وجود صلاحية avtarol
  if (!isAdmin && !user.avtarol) {
    return m.reply('❌ ليس لديك صلاحية تغيير أفتار الجروب. يمكنك شراء هذه الميزة من المتجر.');
  }

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || '';
  
  if (/image/.test(mime)) {
    let img = await q.download();
    if (!img) return m.reply(`❌ يرجى إرفاق صورة لتغيير صورة المجموعة`);

    try {
      await conn.updateProfilePicture(m.chat, img);

      // إذا كان المستخدم غير مشرف، احذف الصلاحية بعد الاستخدام
      if (!isAdmin) user.avtarol = false;

      m.reply(`✅ تم تغيير صورة المجموعة بنجاح${!isAdmin ? '، انتهت صلاحيتك لهذا الأمر.' : ''}`);
    } catch (e) {
      m.reply(`❌ فشل في تغيير الصورة، قد لا أملك الصلاحيات الكافية.`);
    }
  } else {
    m.reply(`❌ يرجى إرفاق صورة لتغيير صورة المجموعة`);
  }
};

handler.command = ['افتار'];
handler.tags = ['group'];
handler.help = ['افتار'];
handler.group = true;
handler.botAdmin = true;

export default handler;
