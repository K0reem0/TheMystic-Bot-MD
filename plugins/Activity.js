let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];

  if (!user) {
    throw `✳️ المستخدم غير موجود في قاعدة البيانات`;
  }

  // Initialize fields if missing
  if (user.totalMessages === undefined || user.lastMessageReset === undefined) {
    user.totalMessages = 0;
    user.dailyMessages = 0;
    user.lastMessageReset = new Date().toDateString(); // Save as YYYY-MM-DD string
  }

  // Get the current date and time
  const now = new Date();
  const currentDate = now.toDateString(); // Current date as YYYY-MM-DD
  const currentHour = now.getHours();

  // Reset the daily message count if the date has changed
  if (user.lastMessageReset !== currentDate) {
    user.dailyMessages = 0; // Reset daily messages
    user.lastMessageReset = currentDate; // Update the last reset date
  }

  // Increment the total messages (global count)
  user.totalMessages += 1;

  // Increment daily messages only if within the specified range (12:00 PM to 11:59 PM)
  if (currentHour >= 12) {
    user.dailyMessages += 1;
  }

  // Construct the response
  const response = `
*✉️ الرسائل اليومية من 12:00 ظهراً :* ${user.dailyMessages}
*📅 تاريخ اليوم :* ${currentDate}
*🔢 إجمالي الرسائل المرسلة :* ${user.totalMessages}
  `;

  // Send the response
  m.reply(response);
};

handler.help = ['dailymsg'];
handler.tags = ['statistics'];
handler.command = ['dailymsg', 'تفاعلي'];

export default handler;
