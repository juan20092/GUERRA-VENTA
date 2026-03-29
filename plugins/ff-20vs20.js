let versusData = {} // Guarda el estado por mensaje

const aliasesMX = ['mx', 'méxico', 'mexico', 'méx', 'mex']
const aliasesCO = ['co', 'colombia', 'col']

let handler = async (m, { conn, args }) => {
  if (args.length === 0) {
    await conn.sendMessage(m.chat, { text: '𝐓𝐢𝐞𝐧𝐞𝐬 𝐪𝐮𝐞 𝐞𝐬𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚𝐫 𝐥𝐚 𝐡𝐨𝐫𝐚 𝐲 𝐞𝐥 𝐩𝐚𝐢́𝐬 ❇️' })
    return
  }

  let lastArgRaw = args[args.length - 1]
  let lastArg = lastArgRaw.toLowerCase().replace(/,$/, '')

  let zonaInput = null
  if (aliasesMX.includes(lastArg)) {
    zonaInput = 'mx'
    args.pop()
  } else if (aliasesCO.includes(lastArg)) {
    zonaInput = 'co'
    args.pop()
  } else {
    await conn.sendMessage(m.chat, { text: '𝐄𝐬𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚 𝐮𝐧 𝐩𝐚𝐢́𝐬 𝐯𝐚́𝐥𝐢𝐝𝐨.\nEj: 𝟑 𝐩𝐦 𝐦𝐱, 𝟏𝟔 𝐜𝐨, 𝟒 𝐩𝐦 𝐦é𝐱𝐢𝐜𝐨' })
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
    await conn.sendMessage(m.chat, { text: '𝐇𝐨𝐫𝐚 𝐢𝐧𝐯𝐚́𝐥𝐢𝐝𝐚. Ej:\n.12vs12 3 pm mx\n.12vs12 16 co' })
    return
  }

  function format12h(h) {
    let ampm = h >= 12 ? 'PM' : 'AM'
    let hour12 = h % 12
    if (hour12 === 0) hour12 = 12
    return `${hour12} ${ampm}`
  }

  let mexHora, colHora
  if (zonaInput === 'mx') {
    mexHora = horaInput
    colHora = (horaInput + 1) % 24
  } else {
    colHora = horaInput
    mexHora = (horaInput + 23) % 24
  }

  const mexText = format12h(mexHora)
  const colText = format12h(colHora)

  const template = generarVersus([], [], [], [], [], mexText, colText)
  const sent = await conn.sendMessage(m.chat, { text: template, mentions: [] })

  versusData[sent.key.id] = {
    chat: m.chat,
    escuadra1: [],
    escuadra2: [],
    escuadra3: [],
    escuadra4: [],
    suplentes: [],
    mexText,
    colText
  }
}
handler.help = ['20𝗏𝗌20']
handler.tags = ['𝖥𝖱𝖤𝖤 𝖥𝖨𝖱𝖤']
handler.command = /^\.?(20vs20|vs20)$/i
handler.group = true
handler.admin = true
export default handler

function generarVersus(esc1, esc2, esc3, esc4, suplentes, mexText = '  ', colText = '  ') {
  function formatEscuadra(arr) {
    let out = ''
    for (let i = 0; i < 4; i++) {
      let icon = i === 0 ? '👑' : '🥷🏻'
      out += arr[i] ? `${icon} ┇ @${arr[i].split('@')[0]}\n` : `${icon} ┇ \n`
    }
    return out.trimEnd()
  }
  function formatSuplentes(arr) {
    let out = ''
    for (let i = 0; i < 2; i++) {
      out += arr[i] ? `🥷🏻 ┇ @${arr[i].split('@')[0]}\n` : `🥷🏻 ┇ \n`
    }
    return out.trimEnd()
  }

  return `*20 𝐕𝐄𝐑𝐒𝐔𝐒 20*

*𝐇𝐎𝐑𝐀𝐑𝐈𝐎𝐒*;  
*🇲🇽 MEXICO* : ${mexText}  
*🇨🇴 COLOMBIA* : ${colText}

*𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐏𝐑𝐄𝐒𝐄𝐍𝐓𝐄𝐒*;

*𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1*
${formatEscuadra(esc1)}

*𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2*
${formatEscuadra(esc2)}

*𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 3*
${formatEscuadra(esc3)}

*𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 4*
${formatEscuadra(esc4)}

ㅤʚ *𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒*:
${formatSuplentes(suplentes)}


*𝖲𝗈𝗅𝗈 𝗋𝖾𝖺𝖼𝖼𝗂𝗈𝗇𝖺 𝖼𝗈𝗇:*

> 「 ❤️ 」𝐏𝐚𝐫𝐭𝐢𝐜𝐢𝐩𝐚𝐫  
> 「 👍 」𝐒𝐮𝐩𝐥𝐞𝐧𝐭𝐞  
> 「 👎 」𝐒𝐚𝐥𝐢𝐫 𝐃𝐞 𝐋𝐚 𝐋𝐢𝐬𝐭𝐚  
> 「 ❌ 」𝐑𝐞𝐢𝐧𝐢𝐜𝐢𝐚𝐫 𝐋𝐢𝐬𝐭𝐚      
`
}

conn.ev.on('messages.upsert', async ({ messages }) => {
  for (let msg of messages) {
    if (!msg.message?.reactionMessage) continue
    let msgID = msg.message.reactionMessage.key.id
    let data = versusData[msgID]
    if (!data) continue

    let user = msg.key.participant || msg.key.remoteJid
    let emoji = msg.message.reactionMessage.text
    const isInAnyList =
      data.escuadra1.includes(user) ||
      data.escuadra2.includes(user) ||
      data.escuadra3.includes(user) ||
      data.escuadra4.includes(user) ||
      data.suplentes.includes(user)

    if (emoji === '👎' && !isInAnyList) continue

    let isAdmin = false
    try {
      let groupMetadata = await conn.groupMetadata(data.chat)
      let participant = groupMetadata.participants.find(p => p.id === user)
      isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin'
    } catch {}

    if (emoji === '❌' && isAdmin) {
      const hasPlayers =
        data.escuadra1.length + data.escuadra2.length + data.escuadra3.length + data.escuadra4.length + data.suplentes.length > 0
      if (!hasPlayers) continue
      data.escuadra1 = []
      data.escuadra2 = []
      data.escuadra3 = []
      data.escuadra4 = []
      data.suplentes = []
      let nuevoTexto = generarVersus(data.escuadra1, data.escuadra2, data.escuadra3, data.escuadra4, data.suplentes, data.mexText, data.colText)
      try { await conn.sendMessage(data.chat, { delete: msg.message.reactionMessage.key }) } catch {}
      let sent = await conn.sendMessage(data.chat, { text: nuevoTexto, mentions: [] })
      delete versusData[msgID]
      versusData[sent.key.id] = data
      continue
    }

    data.escuadra1 = data.escuadra1.filter(u => u !== user)
    data.escuadra2 = data.escuadra2.filter(u => u !== user)
    data.escuadra3 = data.escuadra3.filter(u => u !== user)
    data.escuadra4 = data.escuadra4.filter(u => u !== user)
    data.suplentes = data.suplentes.filter(u => u !== user)

    if (emoji === '❤️') {
      if (data.escuadra1.length < 4) data.escuadra1.push(user)
      else if (data.escuadra2.length < 4) data.escuadra2.push(user)
      else if (data.escuadra3.length < 4) data.escuadra3.push(user)
      else if (data.escuadra4.length < 4) data.escuadra4.push(user)
    } else if (emoji === '👍') {
      if (data.suplentes.length < 2) data.suplentes.push(user)
    } else if (emoji === '👎') {
      // Ya fue eliminado arriba
    } else continue

    let nuevoTexto = generarVersus(data.escuadra1, data.escuadra2, data.escuadra3, data.escuadra4, data.suplentes, data.mexText, data.colText)
    let mentions = [...data.escuadra1, ...data.escuadra2, ...data.escuadra3, ...data.escuadra4, ...data.suplentes]
    try { await conn.sendMessage(data.chat, { delete: msg.message.reactionMessage.key }) } catch {}
    let sent = await conn.sendMessage(data.chat, { text: nuevoTexto, mentions })
    delete versusData[msgID]
    versusData[sent.key.id] = data
  }
})
