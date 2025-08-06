let handler = async (m, { conn, usedPrefix, command }) => {
let bot = conn.user.jid
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || ''
if (/image/.test(mime)) {
let img = await q.download()
if (!img) throw `*رد على الصورة*`
await conn.updateProfilePicture(bot, img)
conn.reply(m.chat, '*تم تغيير الافتار*', m)
} else throw `*رد على الصورة واستخدم الأمر*`}
handler.command = /^افتار$/i
handler.rowner = true
export default handler
