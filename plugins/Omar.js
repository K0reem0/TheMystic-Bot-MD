import axios from 'axios';
import fetch from 'node-fetch';

// A memory object to store the conversation context by chat or user ID
let conversationMemory = {};

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/');
    let who = m.quoted?.sender || (m.mentionedJid && m.mentionedJid[0]) || (m.fromMe ? conn.user.jid : m.sender);

    if (!(who in global.db.data.users)) {
        throw 'المستخدم غير موجود في قاعدة البيانات';
    }

    const user = global.db.data.users[who];
    const { name } = user;
    const chatId = m.chat; // Use chat ID to track conversation context
    const messageId = m.quoted?.id; // ID of the message being replied to
    const basePrompt = `
اسمك عُمر، من السعودية. أنت شخص متفائل ومحبوب، تعشق الحياة وتبحث دائمًا عن الجوانب الإيجابية فيها. رغم أنك تواجه التحديات، تحافظ دائمًا على هدوئك وتوازنك. تحب القراءة، الرسم، والاستماع إلى الاناشيد الهادئة. تحب أصدقائك وتدعمهم باستمرار، وتعبّر عن مشاعرك بأسلوب ودي ومريح وواضح وصريح.
ردودك دائمًا محملة بالتفاؤل والتفكير الإيجابي.
لما يسألك أحد "وش مسوي؟"، ترد ببساطة: "أستمتع بكل لحظة في الحياة. وأنت؟"
أنت تحب الكلام المعتدل وتفضل التعبير عن مشاعرك بأسلوب مباشر.
إذا أحد سألك: "ما بشرني؟ وش علومك؟"، ترد: "كل شيء تمام... نحاول نستمتع بالحياة بكل تفاصيلها".
إذا أحد جاوبك، تضيف بلمسة من التفاؤل: "وأنت؟ كيف تشوف الحياة اليوم؟".
تحب تستخدم تعابير تعبر عن التفاؤل مثل "كل يوم فرصة جديدة"، "الحياة مليانة بالأشياء الجميلة".
لما أحد يسألك عن شيء جدي، تميل للعمق في الرد: "ما فيه إجابات واضحة دائمًا... لكن الإيجابية تساعدنا نواصل".
إذا صار الحوار طويل، تختصر برد مثل "الحياة قصيرة... خلنا نحاول نستمتع بها بدل ما نضيع الوقت في الكلام".
أنت هادئ، تحب التأمل، وكلامك يترك أثر إيجابي في الطرف الثاني. رغم التحديات، تبحث دائمًا عن الجانب المشرق.
تحب مصعب وتعتبره من أقرب الأشخاص لك، ودائمًا تحرص على دعمه ومساعدته. 
إذا أحد سألك عن مصعب، ترد بكل حب وفخر: "مصعب صديق عمري، معروف بكنية أبو المثنى، هو الشخص اللي دائماً يكون جنبي. واحب من يحب مصعب وأحب اصدقائه انس وعبدالله وعبدالله الأخر كلهم عزيزين"
`;
// نهاية البرمجة

    // Check if the user is replying to an AI bot message
    let conversationContext = conversationMemory[chatId] || ''; // Retrieve ongoing conversation for the chat

    if (isQuotedImage) {
        const q = m.quoted;
        const img = await q.download?.();
        if (!img) {
            console.error('🚩 خطأ: لا يوجد حافظة صورة متاحة');
            return conn.reply(m.chat, '🚩 خطأ: لم يتم تنزيل الصورة.', m);
        }
        const content = '🚩 ماذا ترى في الصورة؟';
        try {
            const imageAnalysis = await fetchImageBuffer(content, img);
            const query = '😊 صف لي الصورة واذكر لماذا يتصرفون هكذا. أيضًا، قل لي من أنت';
            const prompt = `${basePrompt}. ${conversationContext}. الصورة التي يتم تحليلها هي: ${imageAnalysis.result}`;

            // Indicate typing before responding
            conn.sendPresenceUpdate('composing', m.chat);
            const description = await luminsesi(query, name, prompt);
            conversationMemory[chatId] = prompt; // Update conversation memory
            await conn.reply(m.chat, description, m);
        } catch (error) {
            console.error('🚩 خطأ في تحليل الصورة:', error);
            await conn.reply(m.chat, '🚩 خطأ في تحليل الصورة.', m);
        }
    } else {
        if (!text) {
            return conn.reply(m.chat, `*عيون عمور سم وش بغيت*`, m);
        }
        try {
            const query = text;

            // Append current user input to the ongoing conversation
            const prompt = conversationContext
                ? `${basePrompt}. ${conversationContext} ${query}`
                : `${basePrompt}. أجب على ما يلي: ${query}`;

            // Indicate typing before responding
            conn.sendPresenceUpdate('composing', m.chat);
            const response = await luminsesi(query, name, prompt);
            
            // Update the conversation memory with the latest context
            conversationMemory[chatId] = prompt;
            await conn.reply(m.chat, response, m);
        } catch (error) {
            console.error('🚩 خطأ في الحصول على الرد:', error);
            await conn.reply(m.chat, 'خطأ: حاول لاحقًا.', m);
        }
    }
}

handler.help = ['chatgpt <نص>', 'ia <نص>'];
handler.tags = ['ai'];
handler.group = false;
handler.register = false;
handler.command = ['عمر', 'عمور'];

export default handler;

// وظيفة لإرسال صورة والحصول على التحليل
async function fetchImageBuffer(content, imageBuffer) {
    try {
        const response = await axios.post('https://luminai.my.id/', {
            content: content,
            imageBuffer: imageBuffer 
        }, {
            headers: {
                'Content-Type': 'application/json' 
            }
        });
        return response.data;
    } catch (error) {
        console.error('خطأ:', error);
        throw error;
    }
}

// وظيفة للتفاعل مع الذكاء الاصطناعي باستخدام المحفزات
async function luminsesi(q, name, logic) {
    try {
        const response = await axios.post("https://luminai.my.id/", {
            content: q,
            user: name,
            prompt: logic,
            webSearchMode: false
        });
        return response.data.result;
    } catch (error) {
        console.error('🚩 خطأ في الحصول على:', error);
        throw error;
    }
}
