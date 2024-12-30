import { canLevelUp, xpRange } from '../src/libraries/levelling.js'
import Canvacord from 'canvacord'

export async function before(m, { conn }) {
    let user = global.db.data.users[m.sender]
    let name = conn.getName(m.sender)
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => './src/avatar_contact.png')

    // Store the current level
    let before = user.level * 1

    // Automatically level up the user as long as they have enough experience
    while (canLevelUp(user.level, user.exp, global.multiplier)) {
        user.level++
    }

    // Dynamically update the user's role based on the new level
    // This is already handled by your existing logic in handler.before, so we don't need to modify this
    // user.role = global.rpg.role(user.level).name // Not needed here since it's handled elsewhere

    // If the user has leveled up, send a notification with the level-up card
    if (before !== user.level) {
        let { min, xp } = xpRange(user.level, global.multiplier)
        let crxp = user.exp - min
        let requiredXpToLevelUp = xp

        // Generate the rank card with Canvacord
        const card = await new Canvacord.Rank()
            .setAvatar(pp)
            .setLevel(user.level)
            .setCurrentXP(crxp)
            .setRequiredXP(requiredXpToLevelUp)
            .setProgressBar('#e1d4a7', 'COLOR')
            .setDiscriminator(m.sender.substring(3, 7))
            .setCustomStatusColor('#e1d4a7')
            .setLevelColor('#FFFFFF', '#FFFFFF')
            .setOverlay('#000000')
            .setUsername(name)
            .setBackground('IMAGE', './src/assets/rankbg.jpg')
            .setRank(user.level, 'LEVEL', false)
            .renderEmojis(true)
            .build()

        // Level-up message with card
        let message = `*❃ ──────⊰ ❀ ⊱────── ❃*\n
*🎊 ازداد مستواك 🎉*\n
*المستوى :* *${before}* ‣ *${user.level}*\n
*التصنيف :* *${user.role}*\n
*❃ ──────⊰ ❀ ⊱────── ❃*`.trim()

        try {
            // Send the rank card and level-up message
            await conn.sendFile(m.chat, card, 'levelup.jpg', message, m)
        } catch (error) {
            console.error(error)
            m.reply(message)
        }
    }

    return true // Continue with the rest of the handlers
}
