import fetch from 'node-fetch';
import similarity from 'similarity';

let timeout = 60000; // 60 seconds timeout
let poin = 10000; // Points reward
const threshold = 0.72; // Similarity threshold

let games = {}; // Global game state storage

// Main game starter
let handler = async (m, { conn, command }) => {
    let id = m.chat;

    // Check if a game is already running in this chat
    if (id in games) {
        conn.reply(m.chat, '*صبر ما تشوف فيه سؤال ؟*', games[id].msg);
        return;
    }

    // Fetch a random country flag
    let src = await (await fetch('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/Flags.json')).json();
    let json = src[Math.floor(Math.random() * src.length)];

    // Send the game message
    let caption = `*❃ ──────⊰ ❀ ⊱────── ❃*\n*ماهي الدولة ؟؟*\n\n*الوقت :* ${(timeout / 1000).toFixed(2)} ثانية\n*الجائزة :* ${poin} خبرة\n*❃ ──────⊰ ❀ ⊱────── ❃*`;
    let msg = await conn.sendFile(m.chat, json.img, '', caption, m);

    // Store game state
    games[id] = {
        json,
        poin,
        msg,
        timeout: setTimeout(() => {
            if (games[id]) {
                conn.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*خلص الوقت*\n*الجواب :* ${json.name}\n*❃ ──────⊰ ❀ ⊱────── ❃*`, msg);
                delete games[id];
            }
        }, timeout),
    };
};

// Recognize replies to the bot's message
handler.all = async function (m) {
    let id = m.chat;

    // Check if there's an active game in this chat
    if (!(id in games)) return;

    let game = games[id];

    // Ensure the reply is to the bot's question message
    if (!m.quoted || m.quoted.id !== game.msg.id) return;

    // Check if the user requested a hint
    if (/^(تلميح)$/i.test(m.text)) {
        let answer = game.json.name;
        let hint = generateHint(answer);
        this.reply(m.chat, `*تلميح:* ${hint}`, m);
        return;
    }

    // Check if the user surrendered
    if (/^(انسحب|surr?ender)$/i.test(m.text)) {
        clearTimeout(game.timeout);
        delete games[id];
        this.reply(m.chat, '*ماااش مافي مستوى*', m);
        return;
    }

    // Check the user's answer
    let answer = m.text.trim().toLowerCase();
    let correct = game.json.name.toLowerCase().trim();

    if (answer === correct) {
        // Correct answer
        global.db.data.users[m.sender].exp += game.poin;
        this.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*❀ شوكولولو ❀*\n\n*◍ الجائزة :* ${game.poin} خبرة\n*❃ ──────⊰ ❀ ⊱────── ❃*`, m);
        clearTimeout(game.timeout);
        delete games[id];
    } else if (similarity(answer, correct) >= threshold) {
        // Close answer
        this.reply(m.chat, '*اوخخ قربتت*', m);
    } else {
        // Wrong answer
        this.reply(m.chat, '*نااه*', m);
    }
};

// Generate a randomized hint for the name
function generateHint(name) {
    let nameArray = name.split('');
    let revealedIndexes = [];

    // Reveal a random 50% of the letters
    while (revealedIndexes.length < Math.ceil(name.length / 2)) {
        let randomIndex = Math.floor(Math.random() * name.length);
        if (!revealedIndexes.includes(randomIndex)) {
            revealedIndexes.push(randomIndex);
        }
    }

    // Generate the hint by replacing unrevealed letters with underscores
    let hint = nameArray
        .map((char, index) => (revealedIndexes.includes(index) ? char : '_'))
        .join('');
    return hint;
}

handler.help = ['guessflag']; // Command help
handler.tags = ['game'];
handler.command = /^علم$/i; // Arabic command for "flag"
export const exp = 10000
export default handler;
