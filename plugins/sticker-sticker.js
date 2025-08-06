import {sticker} from '../src/libraries/sticker.js';
import uploadFile from '../src/libraries/uploadFile.js';
import uploadImage from '../src/libraries/uploadImage.js';
import {webp2png} from '../src/libraries/webp2mp4.js';
import fs from 'fs';

let handler = async (m, { conn, args }) => {
  let stiker = false
  let username = conn.getName(m.sender)

  // استخراج packname و author من النص بعد الأمر
  let [packname, author] = args.join(' ').split('|')
  if (!packname) packname = ''
  if (!author) author = ''

  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    
    if (/webp|image|video/g.test(mime)) {
      let img = await q.download?.()
      if (!img) return m.reply('🔍 يرجى الرد على *صورة* أو *فيديو*.')

      let out
      try {
        stiker = await sticker(img, false, packname, author)
      } catch (e) {
        console.error(e)
      } finally {
        if (!stiker) {
          if (/webp/g.test(mime)) out = await webp2png(img)
          else if (/image/g.test(mime)) out = await uploadImage(img)
          else if (/video/g.test(mime)) out = await uploadFile(img)
          if (typeof out !== 'string') out = await uploadImage(img)
          stiker = await sticker(false, out, packname, author)
        }
      }
    } else if (args[0]) {
      if (isUrl(args[0])) stiker = await sticker(false, args[0], packname, author)
      else return m.reply('❌ الرابط غير صالح.')
    }
  } catch (e) {
    console.error(e)
    if (!stiker) stiker = e
  } finally {
    if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
    else return m.reply('✅ يرجى الرد على *صورة* أو *فيديو*.')
  }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'حقوق', 'ملصق']

export default handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
