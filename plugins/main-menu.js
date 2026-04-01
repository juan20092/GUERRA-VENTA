import moment from 'moment-timezone'

const handler = async (m, { conn, usedPrefix }) => {
  try {
    // Datos previos necesarios (puedes declarar/obtener arriba si no existen en tu contexto)
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let userData = global.db?.data?.users?.[userId] || {}
    let exp = userData.exp || 0
    let coins = userData.coin || 0
    let level = userData.level || 0
    let rango = userData.role || "Sin rango"
    let name = await conn.getName(userId)

    let uptime = clockString(process.uptime() * 1000)
    let totalreg = Object.keys(global.db?.data?.users || {}).length
    let totalCommands = Object.keys(global.plugins || {}).length

    let fechaObj = new Date()
    let zona = 'America/Lima'
    let hora = new Date().toLocaleTimeString('es-PE', { timeZone: zona })
    let fecha = fechaObj.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: zona })
    let dia = fechaObj.toLocaleDateString('es-PE', { weekday: 'long', timeZone: zona })

    // Puedes cambiar estos videos por los de tu preferencia o los que usas normalmente.
    const videos = [
      'https://api.dix.lat/media2/1775087333113.mp4',
    ]
    let video = videos[Math.floor(Math.random() * videos.length)]

    // banner, botname, dev, channelRD son variables que deben existir en tu contexto/bot principal
    // Si no existen, puedes sustituirlas, inicializarlas aquí o arriba, o poner valores por defecto

    let menuText =  `🪙 𝐌 𝐔 𝐋 𝐓 𝐈 - 𝐌 𝐄 𝐍 𝐔́ 

・✧「 𝗙𝗥𝗘𝗙𝗜𝗥𝗘 💣 」
┃
✩  ꯭⚔️˙⋆｡.𝟒𝐯𝐬𝟒
✩  ꯭⚔️˙⋆｡.𝟔𝐯𝐬𝟔
✩  ꯭⚔️˙⋆｡.𝟐𝟒𝐯𝐬𝟐𝟒
✩  ꯭⚔️˙⋆｡.𝟐𝟎𝐯𝐬𝟐𝟎
✩  ꯭⚔️˙⋆｡.𝟏𝟔𝐯𝐬𝟏𝟔
✩  ꯭⚔️˙⋆｡.𝟏𝟐𝐯𝐬𝟏𝟐
┃
✧・―・―・―・―・✧

・✧「 🏘️ 𝗚𝗥𝗨𝗣𝗢 」
┃
✩  ꯭🔗˙⋆｡.𝗹𝗶𝗻𝗸
✩  ꯭👢˙⋆｡.𝗸𝗶𝗰𝗸 @𝘂𝘀𝗲𝗿
✩  ꯭🔇˙⋆｡.𝗺𝘂𝘁𝗲
✩  ꯭🔊˙⋆｡.𝘂𝗻𝗺𝘂𝘁𝗲
✩  ꯭📢˙⋆｡𝘁𝗼𝗱𝗼𝘀
✩  ꯭✅˙⋆｡.𝘀𝗲𝘁𝗻𝗮𝗺𝗲
✩  ꯭🕒˙⋆｡.𝗵𝗼𝗿𝗮𝗿𝗶𝗼
✩  ꯭🤐˙⋆｡𝗡
✩  ꯭🥶˙⋆｡.𝘀𝗲𝘁𝗻𝗮𝗺𝗲𝗯𝗼𝘁
✩  ꯭🔒˙⋆｡. 𝗰𝗲𝗿𝗿𝗮𝗿
✩  ꯭🔓˙⋆｡. 𝗮𝗯𝗿𝗶𝗿
✩  ꯭⬆️˙⋆｡.𝗽𝗿𝗼𝗺𝗼𝘁𝗲 
✩  ꯭⬇️˙⋆｡.𝗱𝗲𝗺𝗼𝘁𝗲
✩  ꯭💥˙⋆｡.𝗱𝗲𝗹
✩  ꯭🍭˙⋆｡.𝗲𝗻𝗰𝘂𝗲𝘀𝘁𝗮
✩  ꯭😶‍🌫️˙⋆｡.𝗳𝗮𝗻𝘁𝗮𝗺𝗮𝘀
✩  ꯭⛓️‍💥˙⋆｡.𝗿𝗲𝘀𝗲𝘁𝗹𝗶𝗻𝗸
✩  ꯭💥˙⋆｡.𝘀𝗲𝘁𝗯𝘆𝗲
✩  ꯭🍫˙⋆｡.𝘀𝗲𝘁𝘄𝗲𝗹𝗰𝗼𝗺𝗲
✩  ꯭🍭˙⋆｡.𝗽𝗶𝗻𝗴
┃
✧・―・―・―・―・✧

・✧「 ⬇️ 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦 」
┃
✩  ꯭🎶˙⋆｡.𝗽𝗹𝗮𝘆 
✩  ꯭🎶˙⋆｡.𝘀𝗽𝗼𝘁𝗶𝗳𝘆 
┃
✧・―・―・―・―・✧

・✧「 ⚙️ 𝗘𝗦𝗧𝗔𝗗𝗢 𝗕𝗢𝗧 」
┃
✩  ꯭🟢˙⋆｡.𝗼𝗻
✩  ꯭🔴˙⋆｡.𝗼𝗳𝗳
✩  ꯭🔪˙⋆｡.𝗮𝗻𝘁𝗶𝗽𝗿𝗶𝘃𝗮𝗱𝗼
✩  ꯭🔪˙⋆｡.𝗮𝗻𝘁𝗶𝗹𝗶𝗻𝗸
✩  ꯭🔪˙⋆｡.𝘄𝗲𝗹𝗰𝗼𝗺𝗲
✩  ꯭🔪˙⋆｡.𝗺𝗼𝗱𝗼𝗮𝗱𝗺𝗶𝗻
┃
✧・―・―・―・―・✧

・✧「 🌟 𝗢𝗪𝗡𝗘𝗥 」
┃
✩  ꯭👑˙⋆｡ .𝗿𝗲𝗶𝗻𝗶𝗰𝗶𝗮𝗿
✩  ꯭👑˙⋆｡ .𝗮𝘂𝘁𝗼𝗮𝗱𝗺𝗶𝗻
✩  ꯭👑˙⋆｡ .𝗹𝗶𝗱
✩  ꯭👑˙⋆｡ .𝘀𝗲𝘁𝗻𝗮𝗺𝗲𝗯𝗼𝘁
  
✧・―・―・―・―・✧

・✧「 🎭 𝗗𝗜𝗩𝗘𝗥𝗦𝗜𝗢𝗡 」
┃
✩  ꯭🌈˙⋆｡ .𝗴𝗮𝘆 @𝘁𝗮𝗴
✩  ꯭❤️˙⋆｡.𝗳𝗼𝗿𝗺𝗮𝗿𝗽𝗮𝗿𝗲𝗷𝗮
✩  ꯭😁˙⋆｡.𝗮𝗱𝗼𝗰𝘁𝗮𝗱𝗼
✩  ꯭💄˙⋆｡.𝗮𝗱𝗼𝗰𝘁𝗮𝗱𝗮
✩  ꯭👽˙⋆｡.𝗮𝗹𝗶𝗲𝗻𝗶𝗴𝗲𝗻𝗮
✩  ꯭🛸˙⋆｡.𝗮𝗹𝗶𝗲𝗻𝘀
✩  ꯭😈˙⋆｡.𝗳𝗼𝗹𝗹𝗮𝗿
✩  ꯭🔥˙⋆｡.𝗽𝗲𝗻𝗲𝘁𝗿𝗮𝗿
✩  ꯭😈˙⋆｡.𝗽𝗮𝗰𝗸
✩  ꯭😈˙⋆｡.𝘃𝗶𝗱𝗲𝗼𝘅𝘅𝘅
✩  ꯭🤺˙⋆｡.𝗮𝗺𝗶𝗴𝗼𝗿𝗮𝗻𝗱𝗼𝗺
✩  ꯭👹˙⋆｡.𝗮𝘀𝘂𝘀𝘁𝗮𝗿
✩  ꯭👨‍🦯˙⋆｡.𝗰𝗮𝗿𝗿𝗲𝗿𝗮
✩  ꯭🤹˙⋆｡.𝗰𝗵𝗶𝘀𝘁𝗲𝘀
✩  ꯭😈˙⋆｡.𝗰𝗼𝗻𝘀𝗲𝗷𝗼
✩  ꯭🤯˙⋆｡.𝗱𝗼𝘅𝗲𝗼
✩  ꯭🎃˙⋆｡.𝗳𝗮𝗰𝘁𝗼
✩  ꯭🔥˙⋆｡.𝗳𝗼𝗺𝗮𝗿𝘁𝗿𝗶𝗼𝘀
✩  ꯭🌮˙⋆｡.𝗴𝗼𝗿𝗱𝗼𝗽𝗮𝗻𝘁𝗲𝗻𝗲
✩  ꯭😂˙⋆｡.𝗴𝗼𝗿𝗱𝗼𝘁𝗲𝘁𝗼𝗻
✩  ꯭🏞️˙⋆｡.𝗸𝗶𝘀𝘀
✩  ꯭❤️˙⋆｡.𝗹𝗼𝘃𝗲
✩  ꯭🎃˙⋆｡.𝗺𝗮𝗺𝗮𝗴𝘂𝗲𝘃𝗼
✩  ꯭👏˙⋆｡.𝗼𝗿𝗮𝗰𝗶𝗼𝗻
✩  ꯭😈˙⋆｡.𝗽𝗮𝗷𝗮
✩  ꯭🦦˙⋆｡.𝗽𝗶𝗿𝗼𝗽𝗼𝘀
✩  ꯭🎭˙⋆｡ .𝗺𝗲𝗺𝗲
✩  ꯭🥵˙⋆｡ .𝗰𝗼𝗴𝗲𝗿
┃
✧・―・―・―・―・✧

・✧「 🎨 𝗦𝗧𝗜𝗖𝗞𝗘𝗥𝗦 」
┃
✩  ꯭💬˙⋆｡ .𝗾𝗰 <𝘁𝗲𝘅𝘁𝗼>
✩  ꯭🖌️˙⋆｡ .𝘀
✩  ꯭🎭˙⋆｡ .𝗯𝗿𝗮𝘁 <𝘁𝗲𝘅𝘁𝗼>
✩  ꯭🏞️˙⋆｡ .𝘄𝗺
✩  ꯭🍫˙⋆｡ .𝗽𝗳𝗽
✩  ꯭🍡˙⋆｡ .𝘀𝗰𝗮𝘁
✩  ꯭📣˙⋆｡ .𝗴𝗼𝗼𝗴𝗹𝗲𝗶𝗺𝗴
✩  ꯭🖼️˙⋆｡ .𝗵𝗱
✩  ꯭⛓️‍💥˙⋆｡ .𝘁𝗼𝘂𝗿𝗹
✩  ꯭🖼️˙⋆｡ .𝗶𝗾𝗰

┃
✧・―・―・―・―・✧`
    await m.react('🔪')

    await conn.sendMessage(
      m.chat,
      {
        video: { url: 'https://api.dix.lat/media2/1775087333113.mp4' },
        caption: menuText,
        gifPlayback: true,
        contextInfo: {
          mentionedJid: [m.sender],
          isForwarded: true,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: typeof channelRD !== 'undefined' ? channelRD.id : '',
            serverMessageId: 100,
            newsletterName: typeof channelRD !== 'undefined' ? channelRD.name : ''
          },
          externalAdReply: {
            title: typeof botname !== 'undefined' ? botname : '',
            body: typeof dev !== 'undefined' ? dev : '',
            thumbnailUrl: typeof banner !== 'undefined' ? banner : '',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, {
      text: `✘ Error al enviar el menú: ${e.message}`,
      mentions: [m.sender]
    }, { quoted: m })
  }
}

handler.customPrefix = /^\.?(menu|menuall)$/i
handler.command = new RegExp
export default handler

function clockString(ms) {
  let seconds = Math.floor((ms / 1000) % 60)
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  return `${hours}h ${minutes}m ${seconds}s`
}
