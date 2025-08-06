//import db from '../lib/database.js'

let handler = async (m, { conn, text }) => {
  let who;
  if (m.isGroup) {
    who = m.mentionedJid?.[0] ? m.mentionedJid[0] : await m?.quoted?.sender;
  } else {
    who = m.chat;
  }
  if (!who) throw '✳️ منشن المستخدم'
  let txt = text.replace('@' + who.split`@`[0], '').trim()
  if (!txt) throw '✳️ كم العدد'
  if (isNaN(txt)) throw ' 🔢 ارقام فقط'
  let xp = parseInt(txt)
  let exp = xp

  if (exp < 1) throw '✳️ الحد الأدنى  *1*'
  let users = global.db.data.users
  users[who].exp += xp

  await m.reply(`≡ *اضافه اكسبي*
┌──────────────
▢  *إجمالي:* ${xp}
└──────────────`)
 conn.fakeReply(m.chat, `▢ لقد حصلت على \n\n *+${xp} اكسبي*`, who, m.text)
}

handler.help = ['addxp <@user>']
handler.tags = ['econ']
handler.command = ['ضيف-اكس-بي'] 
handler.owner = true

export default handler
