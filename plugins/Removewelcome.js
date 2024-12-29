const handler = async (m, { conn }) => {
  // استرجاع بيانات الدردشة
  let chat = global.db.data.chats[m.chat];
  
  // إذا لم تكن بيانات الدردشة كائناً، قم بتهيئتها
  if (typeof chat !== 'object') {
    global.db.data.chats[m.chat] = {};
  }

  // تعريف القيم الافتراضية لكائن "dick"
  const dick = {
    isBanned: false,
    welcome: false,
    detect: false,
    detect2: false,
    sWelcome: false,
    sBye: '',
    sPromote: '',
    sDemote: '',
    antidelete: false,
    modohorny: false,
    autosticker: false,
    audios: true,
    antiLink: false,
    antiLink2: false,
    antiviewonce: false,
    antiToxic: false,
    antiTraba: false,
    antiArab: false,
    antiArab2: false,
    antiporno: false,
    modoadmin: false,
    simi: false,
    game: true,
    expired: 0,
    language: 'ar',
  };

  // تعيين القيم الافتراضية للدردشة
  global.db.data.chats[m.chat] = dick;

  // إرسال رسالة تأكيد للمستخدم
  m.reply("تمت إعادة تعيين إعدادات الدردشة إلى القيم الافتراضية.");
};

handler.help = ['resetchat'];
handler.tags = ['group'];
handler.command = ['رستره'];
handler.admin = true;

export default handler;
