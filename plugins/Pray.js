import schedule from 'node-schedule'; // Install this package for scheduling tasks
import { generateWAMessageFromContent } from "baileys";

// Arabic prayer reminders
const prayerMessages = {
  fajr: '*🌅 حان الآن موعد صلاة الفجر بتوقيت مكة المكرمة. لا تنسَ ذكر الله وأداء الصلاة!*',
  dhuhr: '*☀️ حان الآن موعد صلاة الظهر بتوقيت مكة المكرمة. خصّص وقتًا لتتصل بالله.*',
  asr: '*🏞️ حان الآن موعد صلاة العصر بتوقيت مكة المكرمة. لا تفوّت صلاتك!*',
  maghrib: '*🌇 حان الآن موعد صلاة المغرب بتوقيت مكة المكرمة. أدِّ الصلاة على وقتها.*',
  isha: '*🌌 حان الآن موعد صلاة العشاء بتوقيت مكة المكرمة. اختم يومك بالصلاة.*'
};

// Prayer times in 12-hour format
const prayerTimes = {
  fajr: '5:00 AM',
  dhuhr: '12:00 PM',
  asr: '3:00 PM',
  maghrib: '5:20 PM',
  isha: '6:50 PM'
};

// Function to send a hidden mention
const sendPrayerReminder = async (chatId, message, users, conn) => {
  const hiddenText = '\u200E'.repeat(500); // Hidden characters for "hidden" effect
  const content = {
    extendedTextMessage: {
      text: `${hiddenText}\n${message}`,
      contextInfo: {
        mentionedJid: users // Mention all users
      }
    }
  };
  const msg = generateWAMessageFromContent(chatId, content, {});
  await conn.relayMessage(chatId, msg.message, { messageId: msg.key.id });
};

// Schedule reminders for the five prayers
const schedulePrayerReminders = async (m, conn, participants) => {
  const chatId = m.chat;
  const users = participants.map((u) => conn.decodeJid(u.id)); // Decode user IDs

  // Save chat as enabled in the database
  if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {};
  global.db.data.chats[chatId].prayerReminderEnabled = true;

  for (const [prayer, time] of Object.entries(prayerTimes)) {
    const [rawTime, period] = time.split(' '); // Split time and period (AM/PM)
    const [hour, minute] = rawTime.split(':').map(Number);
    const isPM = period.toUpperCase() === 'PM';
    const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour); // Convert to 24-hour format

    schedule.scheduleJob({ hour: hour24, minute }, async () => {
      // Check if the reminder is still enabled for this chat
      if (global.db.data.chats[chatId]?.prayerReminderEnabled) {
        const message = prayerMessages[prayer];
        await sendPrayerReminder(chatId, message, users, conn);
      }
    });
  }

  // Confirm to admin
  await conn.sendMessage(chatId, { text: '✅ تم تفعيل التذكيرات بالصلوات الخمس لهذه المجموعة.' });
};

// Test prayer reminders command
const testPrayerReminders = async (m, conn, participants) => {
  const chatId = m.chat;
  const users = participants.map((u) => conn.decodeJid(u.id)); // Decode user IDs

  // Check if reminders are enabled for this chat
  if (!global.db.data.chats[chatId]?.prayerReminderEnabled) {
    return conn.sendMessage(chatId, { text: '⚠️ لم يتم تفعيل التذكيرات في هذه المجموعة. قم بتفعيلها باستخدام الأمر /تذكيرالصلوات.' });
  }

  for (const [prayer, message] of Object.entries(prayerMessages)) {
    await sendPrayerReminder(chatId, message, users, conn);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
  }

  // Confirm test completion
  await conn.sendMessage(chatId, { text: '✅ انتهى اختبار التذكير بالصلوات.' });
};

// Main handler function
const handler = async (m, { conn, participants }) => {
  const command = m.text.toLowerCase();
  const chatId = m.chat;

  if (command.includes('تست_صلوات')) {
    await testPrayerReminders(m, conn, participants); // Run test reminders
  } else if (command.includes('تذكيرالصلوات') || command.includes('setprayerreminder')) {
    await schedulePrayerReminders(m, conn, participants); // Schedule regular reminders
  } else if (command.includes('إيقاف_الصلوات') || command.includes('stopprayerreminder')) {
    // Disable reminders for this chat
    if (global.db.data.chats[chatId]) {
      global.db.data.chats[chatId].prayerReminderEnabled = false;
      await conn.sendMessage(chatId, { text: '🛑 تم تعطيل التذكيرات بالصلوات لهذه المجموعة.' });
    } else {
      await conn.sendMessage(chatId, { text: '⚠️ لم يتم تفعيل التذكيرات لهذه المجموعة.' });
    }
  }
};

handler.command = /^(تذكيرالصلوات|setprayerreminder|تست_صلوات|إيقاف_الصلوات|stopprayerreminder)$/i; // Arabic and English commands
handler.group = true; // Only works in groups
handler.admin = true; // Only group admins can activate it

export default handler;
