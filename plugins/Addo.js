import fs from 'fs';
import path from 'path';
import uploadImage from '../src/libraries/uploadImage.js';

// Define the path for the challenges.json file
const challengesFilePath = path.join('./database', 'challenges.json');

// Ensure the challenges.json file exists or create it with an empty array
if (!fs.existsSync(challengesFilePath)) {
    fs.mkdirSync(path.dirname(challengesFilePath), { recursive: true }); // Ensure the directory exists
    fs.writeFileSync(challengesFilePath, JSON.stringify([]));
}

const handler = async (m, { args }) => {
    // Check if the command is used in reply to an image
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime || !/image\/(png|jpe?g|gif)/.test(mime)) {
        throw 'رد على الصورة واكتب الجواب بعد الأمر مثال : .ادراج ارثر';
    }

    // Ensure a name argument is provided
    const name = args.join(' ');
    if (!name) throw 'لازم تكتب جواب الصورة';

    // Download the image and upload it to get the link
    const media = await q.download();
    const imgLink = await uploadImage(media);

    // Read the current challenges.json file
    const challengesData = JSON.parse(fs.readFileSync(challengesFilePath));

    // Append the new challenge entry
    challengesData.push({ img: imgLink, name });

    // Save the updated challenges.json file
    fs.writeFileSync(challengesFilePath, JSON.stringify(challengesData, null, 4));

    // Confirm the addition
    await m.reply(`تمت اضافتها بنجاح!\n\nالصورة: ${imgLink}\nالجواب: ${name}`);

    // Send the updated challenges.json file as a document
    await m.conn.sendMessage(
        m.chat,
        {
            document: { url: challengesFilePath },
            fileName: 'challenges.json',
            mimetype: 'application/json',
        },
        { quoted: m }
    );
};

handler.help = ['addo <reply to photo> <name>'];
handler.tags = ['database'];
handler.command = /^ادراج$/i;

export default handler;
