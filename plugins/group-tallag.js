let handler = async (m, { conn, participants, groupMetadata, text }) => {
  if (!m.isGroup) return m.reply('❌ Solo funciona en grupos')

  let usuarios = participants.map(v => v.id)
  let total = participants.length
  let groupName = groupMetadata.subject
  let mensaje = text ? text : 'Atención grupo'

  let teks = `╭━━━〔 ⚡ LLAMADO GLOBAL ⚡ 〕━━━⬣
┃ 🛸 Grupo: ${groupName}
┃ 👥 Miembros: ${total}
┃ 📣 Aviso: ${mensaje}
╰━━━━━━━━━━━━━━━━⬣

┏━━━〔 🔥 INVOCADOS 🔥 〕━━━⬣
`

  for (let user of participants) {
    teks += `┃ ⚔️ @${user.id.split('@')[0]}\n`
  }

  teks += `┗━━━━━━━━━━━━━━━━⬣

👑 GUERRA BOT • ACTIVADO 👑`

  await conn.sendMessage(m.chat, {
    image: { url: 'https://api.dix.lat/media/img_1775195377061_9uFt_bPM2.jpg' },
    caption: teks,
    mentions: usuarios
  }, { quoted: m })
}

handler.command = ['todos']
handler.tags = ['group']

export default handler
