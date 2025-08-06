const handler = async (m, { conn, args, isROwner, command }) => {
  if (!isROwner) throw '❌ هذا الأمر مخصص للمالك فقط.';

  // تهيئة القائمة إذا لم تكن موجودة
  if (!global.mods) global.mods = [];

  // أمر عرض المشرفين (لائحة)
  if (command === 'لائحة') {
    if (global.mods.length === 0) {
      return m.reply('⚠️ لا يوجد اعضاء مضافين حالياً.');
    }
    let list = '📜 *قائمة الأعضاء*:\n\n';
    global.mods.forEach((mod, index) => {
      list += `${index + 1}. ${mod}\n`;
    });
    return m.reply(list);
  }

  // أمر إضافة مشرف (اضف)
  if (command === 'سماح') {
    if (!args[0]) throw '⚠️ من فضلك أدخل رقم المستخدم.\n\nمثال:\n.اضف 966501234567';

    const number = args[0].replace(/\D/g, '');

    if (!number || number.length < 8) throw '⚠️ الرقم غير صالح. تأكد من إدخاله بالشكل الصحيح.';

    if (global.mods.includes(number)) {
      throw `⚠️ المستخدم ${number} موجود بالفعل في قائمة الأعضاء.`;
    }

    global.mods.push(number);
    return m.reply(`✅ تم إضافة المستخدم ${number} إلى قائمة المشرفين.`);
  }

  // أمر إزالة مشرف (حذف)
  if (command === 'منع') {
    if (!args[0]) throw '⚠️ من فضلك أدخل رقم المستخدم لإزالته.\n\nمثال:\n.حذف 966501234567';

    const number = args[0].replace(/\D/g, '');

    if (!number || number.length < 8) throw '⚠️ الرقم غير صالح. تأكد من إدخاله بالشكل الصحيح.';

    if (!global.mods.includes(number)) {
      throw `⚠️ المستخدم ${number} غير موجود في قائمة الأعضاء.`;
    }

    global.mods = global.mods.filter(mod => mod !== number);
    return m.reply(`✅ تم إزالة المستخدم ${number} من قائمة الأعضاء.`);
  }
};

// الأوامر المنفصلة
handler.help = [
  'اضف <رقم> - إضافة مشرف جديد',
  'حذف <رقم> - إزالة مشرف',
  'لائحة - عرض قائمة المشرفين'
];

handler.tags = ['owner'];
handler.command = ['سماح', 'منع', 'لائحة'];
handler.rowner = true; // فقط المالك الحقيقي

export default handler;
