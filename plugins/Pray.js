import axios from 'axios'; // Install axios for API requests
import schedule from 'node-schedule'; // Install this package for scheduling tasks
import { generateWAMessageFromContent } from "baileys";
import moment from 'moment-timezone'; // Import moment-timezone for handling time zones

// Arabic prayer reminders
const prayerMessages = {
  الفجر: '*🌅 حان الآن موعد صلاة الفجر بتوقيت مكة المكرمة. لا تنسَ ذكر الله وأداء الصلاة!*',
  الظهر: '*☀️ حان الآن موعد صلاة الظهر بتوقيت مكة المكرمة. خصّص وقتًا لتتصل بالله.*',
  العصر: '*🏞️ حان الآن موعد صلاة العصر بتوقيت مكة المكرمة. لا تفوّت صلاتك!*',
  المغرب: '*🌇 حان الآن موعد صلاة المغرب بتوقيت مكة المكرمة. أدِّ الصلاة على وقتها.*',
  العشاء: '*🌌 حان الآن موعد صلاة العشاء بتوقيت مكة المكرمة. اختم يومك بالصلاة.*'
};

// Fetch prayer times from API and return only Fajr, Dhuhr, Asr, Maghrib, and Isha
async function fetchPrayerTimes() {
  try {
    const response = await axios.get(
      'https://api.aladhan.com/v1/timingsByCity?city=Mecca&country=Saudi%20Arabia&method=4'
    );
    const timings = response.data.data.timings;

    // Extract only the required prayer times
    const filteredTimings = {
      الفجر: timings.Fajr,
      الظهر: timings.Dhuhr,
      العصر: timings.Asr,
      المغرب: timings.Maghrib,
      العشاء: timings.Isha
    };

    return filteredTimings;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw new Error('Failed to fetch prayer times');
  }
}

// Helper: Calculate the next prayer time
function calculateNextPrayerTime(prayerTime, timezone) {
  const [hour, minute] = prayerTime.split(':').map(Number);
  let time = moment.tz({ hour, minute }, timezone);
  if (time.isBefore(moment())) {
    time.add(1, 'days');
  }
  return time;
}

// Helper: Format remaining time
function calculateRemainingTime(prayerTime) {
  const now = moment();
  const remainingTime = moment.duration(prayerTime.diff(now));
  const days = Math.floor(remainingTime.asDays());
  const hours = remainingTime.hours();
  const minutes = remainingTime.minutes();
  const seconds = remainingTime.seconds();
  return `${days > 0 ? `${days} يوم ` : ''}${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

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

// Function to handle prayer reminders and schedule next prayer
const schedulePrayerReminders = async (m, conn, participants) => {
  const chatId = m.chat;
  const users = participants.map((u) => conn.decodeJid(u.id)); // Decode user IDs
  const timezone = 'Asia/Riyadh'; // Default timezone (Mecca)

  // Fetch prayer times from API
  const prayerTimes = await fetchPrayerTimes();

  if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {};
  global.db.data.chats[chatId].prayerReminderEnabled = true;

  for (const [prayer, time] of Object.entries(prayerTimes)) {
    const nextPrayerTime = calculateNextPrayerTime(time, timezone);

    const schedulePrayer = () => {
      schedule.scheduleJob(nextPrayerTime.toDate(), async () => {
        if (global.db.data.chats[chatId]?.prayerReminderEnabled) {
          const message = prayerMessages[prayer];
          await sendPrayerReminder(chatId, message, users, conn);

          // Reschedule for the next day
          nextPrayerTime.add(1, 'days');
          schedulePrayer();
        }
      });
      console.log(`${prayer} reminder set for: ${nextPrayerTime.format('YYYY-MM-DD HH:mm:ss')}`);
    };

    schedulePrayer();
  }

  await conn.sendMessage(chatId, { text: '*✅ تم تفعيل التذكيرات بالصلوات الخمس لهذه المجموعة.*' });
};

// Test prayer reminders command
const testPrayerReminders = async (m, conn, participants) => {
  const chatId = m.chat;
  const users = participants.map((u) => conn.decodeJid(u.id)); // Decode user IDs
  const timezone = 'Asia/Riyadh';

  if (!global.db.data.chats[chatId]?.prayerReminderEnabled) {
    return conn.sendMessage(chatId, { text: '*⚠️ لم يتم تفعيل التذكيرات في هذه المجموعة. قم بتفعيلها باستخدام الأمر /تذكيرالصلوات.*' });
  }

  // Fetch prayer times from API
  const prayerTimes = await fetchPrayerTimes();

  let testMessage = '*❃ ──────⊰ ❀ ⊱────── ❃*\n\n';
  testMessage += '🕌 *معلومات التذكير بالصلوات:*\n\n';

  for (const [prayer, time] of Object.entries(prayerTimes)) {
    const nextPrayerTime = calculateNextPrayerTime(time, timezone);
    const remainingTimeFormatted = calculateRemainingTime(nextPrayerTime);

    testMessage += `
*${prayer}*
🕒 الوقت: ${nextPrayerTime.format('h:mm A')}
⏳ الوقت المتبقي: ${remainingTimeFormatted}
    `;
  }

  testMessage += '\n*❃ ──────⊰ ❀ ⊱────── ❃*';

  await conn.sendMessage(chatId, { text: testMessage });
};

// Main handler function
const handler = async (m, { conn, participants }) => {
  const command = m.text.toLowerCase();
  const chatId = m.chat;

  if (command.includes('متبقي')) {
    await testPrayerReminders(m, conn, participants);
  } else if (command.includes('تذكيرالصلوات') || command.includes('setprayerreminder')) {
    await schedulePrayerReminders(m, conn, participants);
  } else if (command.includes('إيقاف_الصلوات') || command.includes('stopprayerreminder')) {
    if (global.db.data.chats[chatId]) {
      global.db.data.chats[chatId].prayerReminderEnabled = false;
      await conn.sendMessage(chatId, { text: '*🛑 تم تعطيل التذكيرات بالصلوات لهذه المجموعة.*' });
    } else {
      await conn.sendMessage(chatId, { text: '*⚠️ لم يتم تفعيل التذكيرات لهذه المجموعة.*' });
    }
  }
};

handler.command = /^(تذكيرالصلوات|setprayerreminder|متبقي|إيقاف_الصلوات|stopprayerreminder)$/i;
handler.group = true;
handler.admin = true;

export default handler;
