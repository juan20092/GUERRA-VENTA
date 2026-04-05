let versusData2 = {}

const aliasesMX2 = ['mx', 'méxico', 'mexico', 'méx', 'mex']
const aliasesCO2 = ['co', 'colombia', 'col']

let handler2vs2 = async (m, { conn, args }) => {
  if (!args.length) return conn.sendMessage(m.chat, { text: '❌ Debes especificar la hora y el país. Ej: .2vs2 3 pm mx' })

  let lastArgRaw = args[args.length - 1]
  let lastArg = lastArgRaw.toLowerCase().replace(/,$/, '')

  let zonaInput = null
  if (aliasesMX2.includes(lastArg)) {
    zonaInput = 'mx'
    args.pop()
  } else if (aliasesCO2.includes(lastArg)) {
    zonaInput = 'co'
    args.pop()
  } else {
    return conn.sendMessage(m.chat, { text: '❌ País inválido. Usa: mx o co' })
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

  if (horaInput === null) return conn.sendMessage(m.chat, { text: '❌ Hora inválida. Ej: .2vs2 3 pm mx' })

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

  const template = generarVersus2vs2([], [], mexText, colText)
  const sent = await conn.sendMessage(m.chat, { text: template, mentions: [] })

  versusData2[sent.key.id] = {
    chat: m.chat,
    escuadra: [],
    suplentes: [],
    mexText,
    colText
  }
}

handler2vs2.help = ['2vs2']
handler2vs2.tags = ['Games']
handler2vs2.command = /^\.?(2vs2|vs2)$/i
handler2vs2.group = true
export default handler2vs2

function generarVersus2vs2(escuadra, suplentes, mexText = '  ', colText = '  ') {
  function formatEscuadra(arr) {
    let out = ''
    for (let i = 0; i < 2; i++) {
      let icon = i === 0 ? '👑' : '🥷🏻'
      out += arr[i] ? `${icon} ┇ @${arr[i].split('@')[0]}\n` : `${icon} ┇ \n`
    }
    return out.trimEnd() || '─ ┇ Sin jugadores'
  }

  function formatSuplentes(arr) {
    let out = ''
    for (let i = 0; i < 1; i++) {
      out += arr[i] ? `🥷🏻 ┇ @${arr[i].split('@')[0]}\n` : `🥷🏻 ┇ \n`
    }
    return out.trimEnd() || '─ ┇ Sin suplentes'
  }

  return `2 𝐕𝐒 2

𝐇𝐎𝐑𝐀𝐑𝐈𝐎𝐒;
🇲🇽 MEXICO : ${mexText}
🇨🇴 COLOMBIA : ${colText}

𝐉𝐔𝐆𝐀𝐃𝐎𝗥𝐄𝗦 𝐏𝐑𝐄𝗦𝐄𝗡𝐓𝐄𝗦;

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

// Reacciones
conn.ev.on('messages.upsert', async ({ messages }) => {
  for (let msg of messages) {
    if (!msg.message?.reactionMessage) continue
    let msgID = msg.message.reactionMessage.key.id
    let data = versusData2[msgID]
    if (!data) continue

    let user = msg.key.participant || msg.key.remoteJid
    let emoji = msg.message.reactionMessage.text

    const isInAnyList = data.escuadra.includes(user) || data.suplentes.includes(user)
    if (emoji === '👎' && !isInAnyList) continue

    // Validación admin
    let isAdmin = false
    try {
      let groupMetadata = await conn.groupMetadata(data.chat)
      let participant = groupMetadata.participants.find(p => p.id === user)
      isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin'
    } catch {}

    if (emoji === '❌' && isAdmin) {
      data.escuadra = []
      data.suplentes = []
      let nuevoTexto = generarVersus2vs2(data.escuadra, data.suplentes, data.mexText, data.colText)
      try { await conn.sendMessage(data.chat, { delete: msg.message.reactionMessage.key }) } catch {}
      let sent = await conn.sendMessage(data.chat, { text: nuevoTexto, mentions: [] })
      delete versusData2[msgID]
      versusData2[sent.key.id] = data
      continue
    }

    data.escuadra = data.escuadra.filter(u => u !== user)
    data.suplentes = data.suplentes.filter(u => u !== user)

    if (emoji === '❤️') {
      if (data.escuadra.length < 2) data.escuadra.push(user)
    } else if (emoji === '👍') {
      if (data.suplentes.length < 1) data.suplentes.push(user)
    } else continue

    let nuevoTexto = generarVersus2vs2(data.escuadra, data.suplentes, data.mexText, data.colText)
    let mentions = [...data.escuadra, ...data.suplentes]
    try { await conn.sendMessage(data.chat, { delete: msg.message.reactionMessage.key }) } catch {}
    let sent = await conn.sendMessage(data.chat, { text: nuevoTexto, mentions })
    delete versusData2[msgID]
    versusData2[sent.key.id] = data
  }
})
