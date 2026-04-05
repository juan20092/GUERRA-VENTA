let versusData = {}

const aliasesMX = ['mx', 'méxico', 'mexico', 'méx', 'mex']
const aliasesCO = ['co', 'colombia', 'col']

/**
 * Handler único para cualquier modo de versus
 * args: [hora, país]
 * mode: número de jugadores por escuadra (2, 4, 6, 12, 16, 24)
 */
let handlerVersus = (mode) => async (m, { conn, args }) => {
  if (args.length === 0) {
    await conn.sendMessage(m.chat, { text: '❌ Tienes que especificar la hora y el país ❇️' })
    return
  }

  let lastArg = args[args.length - 1].toLowerCase().replace(/,$/, '')
  let zonaInput = null
  if (aliasesMX.includes(lastArg)) {
    zonaInput = 'mx'
    args.pop()
  } else if (aliasesCO.includes(lastArg)) {
    zonaInput = 'co'
    args.pop()
  } else {
    await conn.sendMessage(m.chat, { text: '❌ Especifica un país válido.\nEj: 3 pm mx, 16 co' })
    return
  }

  const timeStr = args.join(' ').toUpperCase().trim()
  const match = timeStr.match(/^(\d{1,2})(?:\s*(AM|PM))?$/i)

  let horaInput = null
  if (match) {
    let hour = parseInt(match[1])
    const ampm = match[2] || null
    if (ampm) {
      if (ampm === 'PM' && hour < 12) hour += 12
      if (ampm === 'AM' && hour === 12) hour = 0
    }
    if (hour >= 0 && hour <= 23) horaInput = hour
  }

  if (horaInput === null) {
    await conn.sendMessage(m.chat, { text: `❌ Hora inválida. Ej:\n.${mode}vs${mode} 3 pm mx\n.${mode}vs${mode} 16 co` })
    return
  }

  const format12h = (h) => {
    let ampm = h >= 12 ? 'PM' : 'AM'
    let hour12 = h % 12
    if (hour12 === 0) hour12 = 12
    return `${hour12} ${ampm}`
  }

  let mexHora = zonaInput === 'mx' ? horaInput : (horaInput + 23) % 24
  let colHora = zonaInput === 'co' ? horaInput : (horaInput + 1) % 24
  const mexText = format12h(mexHora)
  const colText = format12h(colHora)

  const template = generarVersus(mode, [], [], mexText, colText)
  const sent = await conn.sendMessage(m.chat, { text: template, mentions: [] })

  versusData[sent.key.id] = {
    chat: m.chat,
    escuadra: [],
    suplentes: [],
    mexText,
    colText,
    mode
  }
}

// Función generadora de plantilla para cualquier modo
function generarVersus(mode, escuadra, suplentes, mexText = '  ', colText = '  ') {
  function formatEscuadra(arr) {
    let out = ''
    for (let i = 0; i < mode; i++) {
      let icon = i === 0 ? '👑' : '🥷🏻'
      out += arr[i] ? `${icon} ┇ @${arr[i].split('@')[0]}\n` : `${icon} ┇ \n`
    }
    return out.trimEnd() || '─ ┇ Sin jugadores'
  }

  const suplenteCount = Math.floor(mode / 2)
  function formatSuplentes(arr) {
    let out = ''
    for (let i = 0; i < suplenteCount; i++) {
      out += arr[i] ? `🥷🏻 ┇ @${arr[i].split('@')[0]}\n` : `🥷🏻 ┇ \n`
    }
    return out.trimEnd() || '─ ┇ Sin suplentes'
  }

  return `${mode} 𝐕𝐒 ${mode}

𝐇𝐎𝐑𝐀𝐑𝐈𝐎𝐒;
🇲🇽 MEXICO : ${mexText}
🇨🇴 COLOMBIA : ${colText}

𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐏𝐑𝐄𝐒𝐄𝐍𝐓𝐄𝗦;

𝗘𝗦𝗖𝗨𝗔𝗗𝐑𝐀 Ú𝗡𝐈𝗖𝐀
${formatEscuadra(escuadra)}

ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝗦:
${formatSuplentes(suplentes)}

𝖲𝗈𝗅𝗈 𝗋𝖾𝖺𝖼𝖼𝗂𝗈𝗇𝖺 𝖼𝗈𝗇:

> 「 ❤️ 」Participar  
> 「 👍 」Suplente  
> 「 👎 」Salir de la lista  
> 「 ❌ 」Reiniciar lista
`
}

// Listener unificado de reacciones
conn.ev.on('messages.upsert', async ({ messages }) => {
  for (let msg of messages) {
    if (!msg.message?.reactionMessage) continue
    let msgID = msg.message.reactionMessage.key.id
    let data = versusData[msgID]
    if (!data) continue

    let user = msg.key.participant || msg.key.remoteJid
    let emoji = msg.message.reactionMessage.text

    const isInAnyList = data.escuadra.includes(user) || data.suplentes.includes(user)
    if (emoji === '👎' && !isInAnyList) continue

    let isAdmin = false
    try {
      let groupMetadata = await conn.groupMetadata(data.chat)
      let participant = groupMetadata.participants.find(p => p.id === user)
      isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin'
    } catch {}

    if (emoji === '❌' && isAdmin) {
      data.escuadra = []
      data.suplentes = []
      let nuevoTexto = generarVersus(data.mode, data.escuadra, data.suplentes, data.mexText, data.colText)
      try { await conn.sendMessage(data.chat, { delete: msg.message.reactionMessage.key }) } catch {}
      let sent = await conn.sendMessage(data.chat, { text: nuevoTexto, mentions: [] })
      delete versusData[msgID]
      versusData[sent.key.id] = data
      continue
    }

    data.escuadra = data.escuadra.filter(u => u !== user)
    data.suplentes = data.suplentes.filter(u => u !== user)

    if (emoji === '❤️') {
      if (data.escuadra.length < data.mode) data.escuadra.push(user)
    } else if (emoji === '👍') {
      if (data.suplentes.length < Math.floor(data.mode / 2)) data.suplentes.push(user)
    } else continue

    let nuevoTexto = generarVersus(data.mode, data.escuadra, data.suplentes, data.mexText, data.colText)
    let mentions = [...data.escuadra, ...data.suplentes]
    try { await conn.sendMessage(data.chat, { delete: msg.message.reactionMessage.key }) } catch {}
    let sent = await conn.sendMessage(data.chat, { text: nuevoTexto, mentions })
    delete versusData[msgID]
    versusData[sent.key.id] = data
  }
})

// Export handlers por cada modo
export const handler2vs2 = handlerVersus(2)
export const handler4vs4 = handlerVersus(4)
export const handler6vs6 = handlerVersus(6)
export const handler12vs12 = handlerVersus(12)
export const handler16vs16 = handlerVersus(16)
export const handler24vs24 = handlerVersus(24)
