const handler = async (m, { conn, args, groupMetadata }) => {
  let who;

  if (m.isGroup) {
    who = m.mentionedJid?.[0] ?? (m.quoted ? await m.quoted.sender : null);
  } else {
    who = m.chat;
  }

  // إذا ما فيه منشن أو اقتباس، نحاول نجيب الاسم من الكتابة
  if (!who && args.length > 0) {
    const nameToDelete = args.join(' ').trim().toLowerCase();

    if (!global.db || !global.db.data || !global.db.data.users) {
      throw '*قاعدة البيانات غير مهيأة.*';
    }

    // نحاول نلقى المستخدم عن طريق الاسم
    who = Object.keys(global.db.data.users).find(id => {
      const user = global.db.data.users[id];
      return user.name && typeof user.name === 'string' && user.name.toLowerCase() === nameToDelete;
    });

    if (!who) {
      throw '*أكتب اللقب الذي تريد حذفه أو قم بعمل منشن أو اقتباس.*';
    }
  }

  if (!who) {
    throw '*أكتب اللقب الذي تريد حذفه أو قم بعمل منشن أو اقتباس.*';
  }

  if (!global.db.data.users[who]) {
    throw '*المستخدم غير موجود في قاعدة البيانات.*';
  }

  // نحذف بيانات التسجيل
  global.db.data.users[who].registered = false;
  global.db.data.users[who].name = '';
  global.db.data.users[who].regTime = 0;
  global.db.data.users[who].image = null;

  m.reply('*✅ تم حذف اللقب والصورة من قاعدة البيانات، الآن صار اللقب متاح للتسجيل.*');
};

handler.help = ['unreg'].map(v => v + ' <الاسم أو منشن>');
handler.tags = ['rg'];
handler.command = ['ازاله', 'ازالة', 'unregister', 'unregistrar'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
