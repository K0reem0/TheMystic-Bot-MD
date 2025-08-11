function handler(m, { text }) {
  // إذا ما كتب نص أو ما فيه نص من الرسالة المقتبسة
  if (!text && !(m.quoted && m.quoted.text)) {
    return m.reply('⚠️ يجب كتابة نص بعد الأمر.');
  }

  // تحديد النص
  let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text;

  // إذا النص يحتوي على حروف عربية
  if (/[ء-ي]/.test(teks)) {
    return m.reply('⚠️ يجب أن يكون النص باللغة الإنجليزية فقط.');
  }

  // تحويل الأحرف
  m.reply(teks.replace(/[a-z]/gi, v => {
    return { 
      'a': '𝐴',
      'b': '𝐵',
      'c': '𝐶',
      'd': '𝐷',
      'e': '𝐸',
      'f': '𝐹',
      'g': '𝐺',
      'h': '𝐻',
      'i': '𝐼',
      'j': '𝐽',
      'k': '𝐾',
      'l': '𝐿',
      'm': '𝑀',
      'n': '𝑁',
      'o': '𝛩',
      'p': '𝑃',
      'q': '𝑄',
      'r': '𝑅',
      's': '𝑺',
      't': '𝑇',
      'u': '𝑈',
      'v': '𝑉',
      'w': '𝑊',
      'x': '𝑋',
      'y': '𝑌',
      'z': '𝑍', 
    }[v.toLowerCase()] || v;
  }));
}

handler.help = ['V E N O M'];
handler.tags = ['V E N O M'];
handler.command = /^(خط|كيب)$/i;

export default handler;
