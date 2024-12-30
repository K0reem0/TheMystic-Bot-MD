let handler = async (m, { conn }) => {
  const users = global.db.data.users;

  // Check if users database exists and is not empty
  if (!users || Object.keys(users).length === 0) {
    throw `🚫 لا توجد بيانات مستخدمين متوفرة.`;
  }

  // Calculate total messages for each user
  let leaderboard = Object.entries(users)
    .map(([id, user]) => ({
      id,
      totalMessages: user.totalMessages || 0,
    }))
    .sort((a, b) => b.totalMessages - a.totalMessages) // Sort by total messages, descending
    .slice(0, 10); // Get the top 10 users

  // Construct the leaderboard message
  let response = `🏆 *لوحة الصدارة للرسائل (إجمالي):*\n\n`;
  leaderboard.forEach((user, index) => {
    response += `${index + 1}. ${user.id} - *${user.totalMessages}* رسائل\n`;
  });

  // Send the response
  m.reply(response);
};

handler.help = ['msgboard'];
handler.tags = ['statistics'];
handler.command = ['msgboard', 'لوحة_الرسائل'];

export default handler;
