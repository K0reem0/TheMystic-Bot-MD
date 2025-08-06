const linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
let enviando;

const handler = async (m, { conn, text, isMods, isOwner, isPrems }) => {
  if (enviando) return;
  enviando = true;

  try {
    const link = text;
    if (!link || !link.match(linkRegex)) throw '❌ الرجاء إدخال رابط مجموعة واتساب صالح.';

    const [_, code] = link.match(linkRegex) || [];

    if (isPrems || isMods || isOwner || m.fromMe) {
      const res = await conn.groupAcceptInvite(code);
      await conn.sendMessage(m.chat, { text: '✅ تم الانضمام إلى المجموعة بنجاح.' }, { quoted: m });
    } else {
      conn.sendMessage(m.chat, { text: '📩 تم إرسال الطلب إلى المالك. سيتم الانضمام إذا تمت الموافقة.' }, { quoted: m });

      const data = global.owner.filter(([id]) => id)[0];
      const dataArray = Array.isArray(data) ? data : [data];

      for (const entry of dataArray) {
        await conn.sendMessage(
          entry + '@s.whatsapp.net',
          {
            text: `💬 طلب انضمام من @${m.sender.split('@')[0]}\n🔗 *رابط المجموعة:* ${link}`,
            mentions: [m.sender],
            contextInfo: {
              forwardingScore: 9999999,
              isForwarded: true,
              mentionedJid: [m.sender],
              externalAdReply: {
                showAdAttribution: true,
                containsAutoReply: true,
                renderLargerThumbnail: true,
                title: global.titulowm2,
                mediaType: 1,
                thumbnail: imagen6,
                mediaUrl: `${link}`,
                sourceUrl: `${link}`
              }
            }
          },
          { quoted: m }
        );
      }
    }
  } catch {
    throw '⚠️ حدث خطأ أثناء محاولة الانضمام للمجموعة.';
  } finally {
    enviando = false;
  }
};

handler.help = ['join [chat.whatsapp.com]'];
handler.tags = ['premium'];
handler.command = /^ادخل|nuevogrupo$/i;
handler.private = true;

export default handler;
