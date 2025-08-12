const roles = {
    'مواطن 👦🏻': 0,
    'شونين⚔️': 3,
    'ساموراي 🗡': 4,
    'شينوبي 🗡': 6,
    'تارتاروس 👹': 8,
    'نينجا⚔️': 12,
    'ملك التنانين 🐉': 13,
    'يونكو 🧛🏻': 14,
    'شينيغامي 💀': 16,
    'ملك قراصنة👒': 20,
    'ملك👑🤴🏻': 24,
    'الأسطورة الخالدة': 28,
    'هاشيرا🔥🗡️': 32,
    'الفارس الأسود 🖤': 36,
    'حاكم الدمار👺': 48,
    'شيطان🥀⚰️': 52,
    'القوت 🐐': 56,
    'العم': 60,
    'العم آرثر': 100,
}

let handler = m => m
handler.before = async function (m, { conn }) {
    let user = db.data.users[m.sender]
    let level = user.level
    let role = (Object.entries(roles)
        .sort((a, b) => b[1] - a[1])
        .find(([, minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0]
    user.role = role
    return !0
}

export default handler
