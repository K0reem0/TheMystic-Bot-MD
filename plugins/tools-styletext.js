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
  
  m.reply(teks.replace(/[a-z]/gi, v => {
      return { 
          'a': '𝐀',
          'b': '𝐁',
          'c': '𝐂',
          'd': '𝐃',
          'e': '𝐄',
          'f': '𝐅',
          'g': '𝐆',
          'h': '𝐇',
          'i': '𝐈',
          'j': '𝐉',
          'k': '𝐊',
          'l': '𝐋',
          'm': '𝐌',
          'n': '𝐍',
          'o': '𝐎',
          'p': '𝐏',
          'q': '𝐐',
          'r': '𝐑',
          's': '𝐒',
          't': '𝐓',
          'u': '𝐔',
          'v': '𝐕',
          'w': '𝐖',
          'x': '𝐗',
          'y': '𝐘',
          'z': '𝐙', 
      }[v.toLowerCase()] || v
  }))
}
handler.help = ['H A R L E Y']
handler.tags = ['H A R L E Y']
handler.command =  /^(زخرفة)$/i

export default handler
