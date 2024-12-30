const handler = async (m, { conn, text }) => {
    try {
        const globalData = global.global.db.data.users;

        const numberPattern = /\d+/g;
        let user = '';
        const numberMatches = text?.match(numberPattern);

        // If a number is found in the text, assign the user
        if (numberMatches) {
            const number = numberMatches.join('');
            user = `${number}@s.whatsapp.net`;
        } else if (m.quoted?.sender) {
            // If a quoted message exists, use the sender's number
            const quotedNumberMatches = m.quoted.sender.match(numberPattern);
            if (quotedNumberMatches) {
                const number = quotedNumberMatches.join('');
                user = `${number}@s.whatsapp.net`;
            } else {
                // If no valid user is found in quoted message, send an error
                return conn.sendMessage(m.chat, { text: 'No valid user found in the message.' }, { quoted: m });
            }
        } else {
            // If no valid number or quoted message, ask the user to provide one
            return conn.sendMessage(m.chat, { text: 'Please provide a valid phone number or quoted message.' }, { quoted: m });
        }

        const userNumber = user.split('@')[0];

        // If no user data exists, return an error
        if (!globalData[user] || globalData[user] === '') {
            return conn.sendMessage(
                m.chat,
                { text: `No data found for user @${userNumber}.`, mentions: [user] },
                { quoted: m }
            );
        }

        // Retrieve the user data
        const userData = globalData[user];

        // Format the user data into a readable string, skipping 'language' field
        let dataText = `*User Data for @${userNumber}:*\n\n`;

        // Loop through user data fields, excluding 'language', and add them to the response
        for (const [key, value] of Object.entries(userData)) {
            if (key !== 'language') {  // Skip 'language' field
                dataText += `*${key}:* ${value}\n`;
            }
        }

        // Send the formatted data
        conn.sendMessage(m.chat, { text: dataText, mentions: [user] }, { quoted: m });

    } catch (error) {
        console.error(error);
        // Handle any unexpected errors
        conn.sendMessage(m.chat, { text: 'An unexpected error occurred while retrieving the user data.' }, { quoted: m });
    }
};

handler.tags = ['owner'];
handler.command = /(بيانات|userdata|alluserdata)$/i;
handler.rowner = true;

export default handler;
