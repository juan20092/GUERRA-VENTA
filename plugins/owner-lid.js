const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid
  const senderId = msg.key.participant || msg.key.remoteJid

  await conn.sendMessage(chatId, {
    react: { text: '🛰️', key: msg.key }
  })

  const context = msg.message?.extendedTextMessage?.contextInfo
  const citado = context?.participant
  const objetivo = citado || senderId

  const esLID = objetivo.endsWith('@lid')
  const tipo = esLID ? 'LID oculto (@lid)' : 'Número visible (@s.whatsapp.net)'
  const numero = objetivo.replace(/[^0-9]/g, '')

  const mensaje = `
📡 *Información del usuario detectado:*
👤 *Identificador:* ${objetivo}
📱 *Número:* +${numero}
🔐 *Tipo de cuenta:* ${tipo}
`.trim()

  await conn.sendMessage(chatId, {
    text: mensaje
  }, { quoted: msg })

  await conn.sendMessage(chatId, { text: `${objetivo}` })
}

handler.help = ["𝖬𝗒𝗅𝗂𝖽"]
handler.tags = ["𝖮𝖶𝖭𝖤𝖱"]
handler.command = ['lid', 'mylid', 'tulid']
handler.group = true
handler.rowner = true

export default handler
