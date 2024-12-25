import FormData from 'form-data'
import Jimp from 'jimp'

let handler = async (m, { conn, usedPrefix, command }) => {
  switch (command) {
    case 'ضباب':
      {
        conn.enhancer = conn.enhancer ? conn.enhancer : {}
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        if (!mime) throw `*مرحبا اين هي الصورة الي تود اجراء التعديلات عليها يمكنك استخدام تحسين لتحسين جودة الصورة او تلوين لأضافة الألوان لها او ضباب لإزالة الضباب في الصورة*`
        if (!/image\/(jpe?g|png)/.test(mime)) throw `الصيغة ${mime} غير مدعومة`
        else conn.enhancer[m.sender] = true
        m.reply(wait)
        let img = await q.download?.()
        let error
        try {
          const This = await processing(img, 'dehaze')
          conn.sendFile(m.chat, This, '', 'تفضل...', m)
        } catch (er) {
          error = true
        } finally {
          if (error) {
            m.reply('جارٍ المعالجة :(')
          }
          delete conn.enhancer[m.sender]
        }
      }
      break
    case 'تلوين':
      {
        conn.recolor = conn.recolor ? conn.recolor : {}
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        if (!mime) throw `*مرحبا اين هي الصورة الي تود اجراء التعديلات عليها يمكنك استخدام تحسين لتحسين جودة الصورة او تلوين لأضافة الألوان لها او ضباب لإزالة الضباب في الصورة*`
        if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`
        else conn.recolor[m.sender] = true
        m.reply(wait)
        let img = await q.download?.()
        let error
        try {
          const This = await processing(img, 'recolor')
          conn.sendFile(m.chat, This, '', 'تفضل...', m)
        } catch (er) {
          error = true
        } finally {
          if (error) {
            m.reply('جارٍ المعالجة :(')
          }
          delete conn.recolor[m.chat]
        }
      }
      break
    case 'تحسين':
      {
        conn.hdr = conn.hdr ? conn.hdr : {}
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        if (!mime) throw `*مرحبا اين هي الصورة الي تود اجراء التعديلات عليها يمكنك استخدام تحسين لتحسين جودة الصورة او تلوين لأضافة الألوان لها او ضباب لإزالة الضباب في الصورة*`
        if (!/image\/(jpe?g|png)/.test(mime)) throw `الصغية ${mime} غير مدعومة`
        else conn.hdr[m.sender] = true
        m.reply(wait)
        let img = await q.download?.()
        let error
        try {
          const This = await processing(img, 'enhance')
          conn.sendFile(m.chat, This, '', 'تفضل...', m)
        } catch (er) {
          error = true
        } finally {
          if (error) {
            m.reply('جارٍ المعالجة :(')
          }
          delete conn.hdr[m.sender]
        }
      }
      break
  }
}
handler.help = ['ضباب', 'تلوين', 'توضيح']
handler.tags = ['tools']
handler.command = ['ضباب', 'تلوين', 'تحسين']
export default handler

async function processing(urlPath, method) {
  return new Promise(async (resolve, reject) => {
    let Methods = ['enhance', 'recolor', 'dehaze']
    Methods.includes(method) ? (method = method) : (method = Methods[0])
    let buffer,
      Form = new FormData(),
      scheme = 'https' + '://' + 'inferenceengine' + '.vyro' + '.ai/' + method
    Form.append('model_version', 1, {
      'Content-Transfer-Encoding': 'binary',
      contentType: 'multipart/form-data; charset=uttf-8',
    })
    Form.append('image', Buffer.from(urlPath), {
      filename: 'enhance_image_body.jpg',
      contentType: 'image/jpeg',
    })
    Form.submit(
      {
        url: scheme,
        host: 'inferenceengine' + '.vyro' + '.ai',
        path: '/' + method,
        protocol: 'https:',
        headers: {
          'User-Agent': 'okhttp/4.9.3',
          Connection: 'Keep-Alive',
          'Accept-Encoding': 'gzip',
        },
      },
      function (err, res) {
        if (err) reject()
        let data = []
        res
          .on('data', function (chunk, resp) {
            data.push(chunk)
          })
          .on('end', () => {
            resolve(Buffer.concat(data))
          })
        res.on('error', e => {
          reject()
        })
      }
    )
  })
}
