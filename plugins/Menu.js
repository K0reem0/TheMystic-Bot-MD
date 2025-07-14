import { prepareWAMessageMedia, generateWAMessageFromContent } from 'baileys';
import fs from 'fs';
import axios from 'axios';
import path from 'path';

let handler = async (m, { conn }) => {
    const imageUrl = 'https://files.catbox.moe/hbvmml.jpg';

    // تحميل الصورة من الرابط وحفظها مؤقتًا
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // تحضير الصورة كوسائط
    const imageMessage = await prepareWAMessageMedia(
        { image: imageBuffer },
        { upload: conn.waUploadToServer }
    );

    // إنشاء الرسالة التفاعلية
    const interactiveMessage = {
        header: {
            title: `*❃ ───────⊰ ❀ ⊱─────── ❃*\n\n *اهلا* 👋🏻 『 ${m.pushName} 』 \n *• انا ارثر*\n *• سعيد بخدمتك 😁*`,
            hasMediaAttachment: true,
            imageMessage: imageMessage.imageMessage, // استخدام الصورة
        },
        body: {
            text: '📜 *أختر من الأقسام ما يناسبك*\n *تحت الصيانة ⚠️* \n\n*❃ ───────⊰ ❀ ⊱─────── ❃*\n',
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '❀ اخـتر القـسـم ❀',
                        sections: [
                            {
                                title: 'قسم الاوامر',
                                highlight_label: 'آرثر',
                                rows: [
                                    { header: '❀ قـسـم المشـرفـين ❀', title: '❃ أوامر المشرفين ❃', id: '.قسم-المشرفين' },
                                    { header: '❀ قسم التحميلات ❀', title: '❃ أوامر التحميل ❃', id: '.قسم-التحويل'},
                                    { header: '❀ قسم الـتـرفيـه ❀', title: '❃ أوامر الترفيه ❃', id: '.قسم-الترفيه' },
                                    { header: '❀ قسم الحياة الافتراضية ❀', title: '❃ أوامر الحياة الافتراضية ❃', id: '.قسم-الحياة-الافتراضية' },
                                    { header: '❀ قسم الـتحـويل ❀', title: '❃ أوامر التحويل ❃', id: '.قسم-التحويل' },
                                    { header: '❀ قسم اوامر الدين والأسلام ❀', title: '❃ أوامر الـديـني ❃', id: '.قسم-ديني' },
                                    { header: '❀ آرثر ❀', title: '❃ أوامر آرثر ❃', id: '.قسم-المطور' },
                                    { header: '❀ قسم الألقاب ❀', title: '❃ أوامر الألقاب ❃', id: '.القاب-الاعضاء' },
                                    { header: '❀ كل الاوامر ❀', title: '❃ جميع الأوامر ❃', id: '.كل-الاوامر' },
                                ],
                            },
                        ],
                    }),
                    messageParamsJson: '',
                },
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '❀ معلومات البوت ❀',
                        sections: [
                            {
                                title: '📜معلومات عن البوت📜',
                                highlight_label: 'آرثر : ♡',
                                rows: [
                                    { header: '❀ صانع البوت ❀', title: '❃ الـمطور ❃', id: '.المطور' },
                                    { header: '❀ خصوصية استخدام البوت ❀', title: '❃ الاسـتخدام ❃', id: '.الاستخدام' },
                                    { header: '❀ ابلاغ او ارسال رساله للمطور ❀', title: '❃ طـلـب ابـلاغ ❃', id: '.بلاغ' },
                                    { header: '❀ لتقييم البوت ❀', title: '❃ تقييم البوت ❃', id: '.تقيم' },
                                ],
                            },
                        ],
                    }),
                    messageParamsJson: '',
                },
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "❀ قنـاة الـواتـساب ❀",
                        url: "https://whatsapp.com/channel/0029Vak3oVNISTkBhE5ypj43",
                        merchant_url: "https://whatsapp.com/channel/0029Vak3oVNISTkBhE5ypj43",
                    }),
                },
            ],
        },
    };

    // إنشاء الرسالة
    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    interactiveMessage,
                },
            },
        },
        { userJid: conn.user.jid, quoted: m }
    );

    // إرسال الرسالة
    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ['info'];
handler.tags = ['main'];
handler.command = ['أوامر', 'اوامر'];

export default handler;
