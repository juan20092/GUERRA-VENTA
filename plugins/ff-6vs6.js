// === 6vs6 ===
let versusData6 = {}

const aliasesMX6 = ['mx', 'méxico', 'mexico', 'méx', 'mex']
const aliasesCO6 = ['co', 'colombia', 'col']

let handler6vs6 = async (m, { conn, args }) => {
  if (!args.length) return conn.sendMessage(m.chat, { text: '❌ Debes indicar hora y país. Ej: .6vs6 3 pm mx' })

  let lastArg = args[args.length - 1].toLowerCase().replace(/,$/, '')
  let zonaInput = aliasesMX6.includes(lastArg) ? 'mx' : aliasesCO6.includes(lastArg) ? 'co' : null
  if (!zonaInput) return conn.sendMessage(m.chat, { text: '❌ País inválido. Ej: mx o co' })
  args.pop()

  const timeStr = args.join(' ').toUpperCase().trim()
  const match = timeStr.match(/^(\d{1,2})(?:\s*(AM|PM))?$/i)
  if (!match) return conn.sendMessage(m.chat, { text: '❌ Hora inválida. Ej: .6vs6 3 pm mx' })

  let hour = parseInt(match[1])
  const ampm = match[2] || null
  if (ampm) { if (ampm === 'PM' && hour < 12) hour += 12; if (ampm === 'AM' && hour === 12) hour = 0 }
  if (hour < 0 || hour > 23) return conn.sendMessage(m.chat, { text: '❌ Hora inválida.' })

  const format12h = h => `${h % 12 || 12} ${h >= 12 ? 'PM' : 'AM'}`
  let mexHora = zonaInput==='mx'?hour:(hour+23)%24
  let colHora = zonaInput==='co'?hour:(hour+1)%24
  const mexText = format12h(mexHora)
  const colText = format12h(colHora)

  const template = generarVersus6vs6([], [], mexText, colText)
  const sent = await conn.sendMessage(m.chat, { text: template, mentions: [] })

  versusData6[sent.key.id] = {
    chat: m.chat,
    escuadra: [],
    suplentes: [],
    mexText,
    colText
  }
}

handler6vs6.help = ['6vs6']
handler6vs6.tags = ['Games']
handler6vs6.command = /^\.?(6vs6|vs6)$/i
handler6vs6.group = true
export default handler6vs6

function generarVersus6vs6(escuadra, suplentes, mexText='  ', colText='  ') {
  const formatEscuadra = arr => {
    let out=''
    for(let i=0;i<6;i++){
      let icon=i===0?'👑':'🥷🏻'
      out+=arr[i]?`${icon} ┇ @${arr[i].split('@')[0]}\n`:`${icon} ┇ \n`
    }
    return out.trimEnd()||'─ ┇ Sin jugadores'
  }
  const formatSuplentes = arr => {
    let out=''
    for(let i=0;i<3;i++){
      out+=arr[i]?`🥷🏻 ┇ @${arr[i].split('@')[0]}\n`:`🥷🏻 ┇ \n`
    }
    return out.trimEnd()||'─ ┇ Sin suplentes'
  }
  return `6 𝐕𝐒 6

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
> 「 👎 」Salir  
> 「 ❌ 」Reiniciar (Admins)
`
}

// Reacciones
conn.ev.on('messages.upsert', async ({ messages }) => {
  for(let msg of messages){
    if(!msg.message?.reactionMessage) continue
    let msgID = msg.message.reactionMessage.key.id
    let data = versusData6[msgID]
    if(!data) continue

    let user = msg.key.participant || msg.key.remoteJid
    let emoji = msg.message.reactionMessage?.text
    if(!emoji) continue

    const isInAnyList = data.escuadra.includes(user) || data.suplentes.includes(user)
    if(emoji==='👎' && !isInAnyList) continue

    let isAdmin=false
    try{
      let groupMetadata = await conn.groupMetadata(data.chat)
      let participant = groupMetadata.participants.find(p=>p.id===user)
      isAdmin = participant?.admin==='admin'||participant?.admin==='superadmin'
    }catch{}

    if(emoji==='❌' && isAdmin){
      data.escuadra=[]
      data.suplentes=[]
      let nuevoTexto=generarVersus6vs6(data.escuadra,data.suplentes,data.mexText,data.colText)
      try{await conn.sendMessage(data.chat,{delete:msg.message.reactionMessage.key})}catch{}
      let sent = await conn.sendMessage(data.chat,{text:nuevoTexto,mentions:[]})
      delete versusData6[msgID]
      versusData6[sent.key.id]=data
      continue
    }

    data.escuadra = data.escuadra.filter(u=>u!==user)
    data.suplentes = data.suplentes.filter(u=>u!==user)

    if(emoji==='❤️'){ if(data.escuadra.length<6) data.escuadra.push(user) }
    else if(emoji==='👍'){ if(data.suplentes.length<3) data.suplentes.push(user) }
    else continue

    let nuevoTexto = generarVersus6vs6(data.escuadra,data.suplentes,data.mexText,data.colText)
    let mentions=[...data.escuadra,...data.suplentes]
    try{ await conn.sendMessage(data.chat,{delete:msg.message.reactionMessage.key}) }catch{}
    let sent = await conn.sendMessage(data.chat,{text:nuevoTexto,mentions})
    delete versusData6[msgID]
    versusData6[sent.key.id]=data
  }
})
