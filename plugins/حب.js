let handler = async (m, { conn, command, text }) => {
let love = `*✨💜 نسبه الحب 💜✨*
*نسبة حب ${text} ليك ✨💜* *${Math.floor(Math.random() * 100)}%* *من 100%*
*اطلب منها ان تكون صديقه لك ؟*
`.trim()
m.reply(love, null, { mentions: conn.parseMention(love) })}
handler.help = ['love']
handler.tags = ['fun']
handler.command = /^(حب)$/i
export default handler
