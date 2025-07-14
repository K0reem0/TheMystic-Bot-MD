let handler = async (m, { conn, args, groupMetadata}) => {
         let who
  if (m.isGroup) {
    who = m.mentionedJid[0] ?
      m.mentionedJid[0] :
      m.quoted ?
      await m?.quoted?.sender : false
  } else who = m.chat
  const user = global.db.data.users[who];
        if (!who) throw `منشن شخص`
       let warn = global.db.data.users[who].warn
       if (warn > 0) {
         global.db.data.users[who].warn -= 1
         m.reply(`
*❃ ──────⊰ ❀ ⊱────── ❃*
        ⚠️ *حذف إنذار* ⚠️
*❃ ──────⊰ ❀ ⊱────── ❃*         
◍ الأنذار : *-1*
◍ إجمالي الإنذارات: *${warn - 1}*
*❃ ──────⊰ ❀ ⊱────── ❃*`)
         m.reply(`*❃ ──────⊰ ❀ ⊱────── ❃* \n\nلقد تم ازالة إنذار منك الإنذارات المتبقية *${warn - 1}* \n\n*❃ ──────⊰ ❀ ⊱────── ❃*`, who)
         } else if (warn == 0) {
            m.reply('لا توجد عليه انذارات')
        }

}
handler.help = ['delwarn @user']
handler.tags = ['group']
handler.command = ['حذف_انذار', 'unwarn'] 
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
