const MAX_MENTIONS = 40 // evita límite de WhatsApp

let handler = async (m, { conn, participants, groupMetadata, text }) => {
  if (!m.isGroup) {
    return m.reply('❌ Este comando solo funciona en grupos')
  }

  // =========================
  // FILTRO DE USUARIOS
  // =========================
  let users = participants
    .map(u => u.id)
    .filter(v => v && v.endsWith('@s.whatsapp.net'))

  let total = users.length
  let groupName = groupMetadata.subject || 'Grupo'
  let mensaje = text?.trim() || '⚠️ Atención general'

  // =========================
  // LIMITAR MENCIONES
  // =========================
  let chunk = users.slice(0, MAX_MENTIONS)

  // =========================
  // HEADER PRO
  // =========================
  let teks = `╭━━━〔 ⚡ LLAMADO GLOBAL ⚡ 〕━━━⬣
┃ 🛸 Grupo: ${groupName}
┃ 👥 Miembros: ${total}
┃ 📣 Mensaje:
┃ ➤ ${mensaje}
╰━━━━━━━━━━━━━━━━⬣

┏━━━〔 🔥 INVOCADOS 🔥 〕━━━⬣
`

  // =========================
  // LISTA DE MENCIONES
  // =========================
  for (let user of chunk) {
    teks += `┃ ⚔️ @${user.split('@')[0]}\n`
  }

  // =========================
  // FOOTER DINÁMICO
  // =========================
  teks += `┗━━━━━━━━━━━━━━━━⬣

${total > MAX_MENTIONS ? `⚠️ Mostrando ${MAX_MENTIONS}/${total} usuarios\n` : ''}
👑 *GUERRA BOT* • ACTIVADO`

  // =========================
  // ENVÍO
  // =========================
  await conn.sendMessage(m.chat, {
    image: {
      url: 'https://api.dix.lat/media2/1777431085383.jpg'
    },
    caption: teks.slice(0, 4096), // evita corte de WhatsApp
    mentions: chunk
  }, { quoted: m })
}

handler.command = ['todos', 'tagall', 'invocar']
handler.tags = ['group']

export default handler
