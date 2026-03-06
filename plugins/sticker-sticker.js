import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false
  const emoji = '👟'

  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''

    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime) && (q.msg || q).seconds > 15) {
        return m.reply(`⚠️ *𝖫𝗂́𝗆𝗂𝗍𝖾 𝖤𝗑𝖼𝖾𝖽𝗂𝖽𝗈...*\n\n𝖤𝗅 𝗏𝗂𝖽𝖾𝗈 𝖾𝗌 𝖽𝖾𝗆𝖺𝗌𝗂𝖺𝖽𝗈 𝗅𝖺𝗋𝗀𝗈. 𝖬𝖺́𝗑𝗂𝗆𝗈 15 𝗌𝖾𝗀𝗎𝗇𝖽𝗈𝗌.`)
      }

      let img = await q.download?.()
      if (!img) {
        return conn.reply(m.chat,
          `❌ *𝖥𝖺𝗅𝗅𝗈 𝖺𝗅 𝖼𝗋𝖾𝖺𝗋:* 𝖭𝗈 𝗌𝖾 𝗉𝗎𝖽𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝖺𝗋.`, m)
      }

      let out
      try {
        let userId = m.sender
        let packstickers = global.db.data.users[userId] || {}
        let texto1 = packstickers.text1 || global.packsticker
        let texto2 = packstickers.text2 || global.packsticker2

        stiker = await sticker(img, false, texto1, texto2)
      } catch (e) {
        console.error('Error al crear sticker:', e)
        if (/webp/g.test(mime)) out = await webp2png(img)
        else if (/image/g.test(mime)) out = await uploadImage(img)
        else if (/video/g.test(mime)) out = await uploadFile(img)
        if (typeof out !== 'string') out = await uploadImage(img)
        stiker = await sticker(false, out, global.packsticker, global.packsticker2)
      }
    } else if (args[0]) {
      if (isUrl(args[0])) {
        stiker = await sticker(false, args[0], global.packsticker, global.packsticker2)
      } else {
        return m.reply(`💢 *𝖤𝗋𝗋𝗈𝗋:* 𝖤𝗌𝖺 𝖴𝖱𝖫 𝗇𝗈 𝖾𝗌 𝗏𝖺́𝗅𝗂𝖽𝖺.`)
      }
    }
  } catch (e) {
    console.error('Error general:', e)
    return conn.reply(m.chat, 
      `❌ *Error inesperado al procesar el sticker.*`, m)
  }

  // Moved outside of try-catch to always execute
  if (stiker) {
    conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
  } else {
    return conn.reply(m.chat,
      `⚠️ *Responde a una imagen o video para crear un sticker.*\n\n✳️ Ejemplo:\n${usedPrefix}s (respondiendo a una imagen)`, m)
  }
}

handler.help = ['stiker <img>', 'sticker <url>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
