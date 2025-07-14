import fs from 'fs'

let handler = async (m, { conn }) => {
    let menu = `
*❃ ────────⊰ ❀ ⊱──────── ❃*
                          *الـتـرفـيـه*
*❃ ────────⊰ ❀ ⊱──────── ❃* 

> *◍ اكس او*
> *◍ تحدي*
> *◍ لعبة*
> *◍ صراحه*
> *◍ بوت*
> *◍ باتشيرا*
> *◍ دحيح*
> *◍ قتل*
> *◍ فزوره*
> *◍ تطقيم*
> *◍ ايدت*
> *◍ عمري*
> *◍ موت*
> *◍ وفاتي*
> *◍ الغموض*
> *◍ ألغام*
> *◍ تف*
> *◍ لاعب*
> *◍ علم*
> *◍ اسئلني*
> *◍ رياضه*
> *◍ سيلفي*
> *◍ خمن*
> *◍ كت*
> *◍ شخصيه*
> *◍ فيك*
> *◍ ميمز*
> *◍ اختبرني*
> *◍ خروف*
> *◍ شش*
> *◍ صوت_ش*
> *◍ حرب*
> *◍ اتحداك*
> *◍ عين*
> *◍ قلب*
> *◍ تهكير*
> *◍ لو*
> *◍ ايموجي*
> *◍ صداقه*
> *◍ بيحبني*
> *◍ بيكرهني*
> *◍ حب*
> *◍ حساب*
> *◍ هل*
> *◍ ترت*
> *◍ ترجم*
> *◍ اقتباس*
> *◍ زواج*
> *◍ انطق*
> *◍ رونالدو*
> *◍ ميسي*
> *◍ تاج*
> *◍ حكمه*
> *◍ سؤال*
> *◍ متفجرات*
> *◍ غزة*

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
handler.command = /^(قسم-الترفيه)$/i 

export default handler
