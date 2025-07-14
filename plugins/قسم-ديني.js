import fs from 'fs'

let handler = async (m, { conn }) => {
    let menu = `
*❃ ────────⊰ ❀ ⊱──────── ❃*
                          *الــدــيــن*
*❃ ────────⊰ ❀ ⊱──────── ❃* 

> *◍ آيه*
> *◍ حديث*
> *◍ دين*
> *◍ قران*
> *◍ تلاوة*
> *◍ سوره*
> *◍ الله* 

*❃ ────────⊰ ❀ ⊱──────── ❃*`

    let imgUrl = 'https://files.catbox.moe/hbvmml.jpg'

    try {
        await conn.sendMessage(m.chat, { 
            image: { url: imgUrl }, 
            caption: menu 
        }, { quoted: m })

        console.log('Image sent successfully')
    } catch (e) {
        console.error(e)
        conn.reply(m.chat, '❌ Failed to send image', m)
    }
}

handler.help = ['main']
handler.tags = ['group']
handler.command = /^(قسم-ديني)$/i 

export default handler
