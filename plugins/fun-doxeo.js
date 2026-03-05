import { performance } from 'perf_hooks'

const handler = async (m, { conn, text }) => {
  // 1) Sacar JID objetivo (mención o citado)
  const mentionedJid =
    (m.mentionedJid && m.mentionedJid[0]) ||
    (m.msg?.contextInfo?.mentionedJid && m.msg.contextInfo.mentionedJid[0]) ||
    (m.quoted?.sender) ||
    null

  // 2) Nombre a mostrar (si hay jid -> @numero, si no -> texto o Alguien)
  const targetText = (text || '').trim()
  const target =
    mentionedJid
      ? `@${mentionedJid.split('@')[0]}`
      : (targetText || 'Alguien')

  const mentions = mentionedJid ? [mentionedJid] : []

  await conn.sendMessage(m.chat, { react: { text: '🕵️', key: m.key } })

  await conn.sendMessage(
    m.chat,
    { text: `*🕵️ INICIANDO ESCANEO DE:* ${target}`, mentions },
    { quoted: m }
  )

  const old = performance.now()

  const steps = [
    'Conectando a doxeo...',
    'Buscando datos...',
    'Compilando datos en la nube...',
    'Casi listo...'
  ]

  for (let i = 0; i < steps.length; i++) {
    const pct = Math.min(100, Math.floor(((i + 1) / steps.length) * 100))
    await conn.sendMessage(
      m.chat,
      { text: `*${pct}%* — ${steps[i]}`, mentions },
      { quoted: m }
    )
    await delay(700)
  }

  const neww = performance.now()
  const speed = ((neww - old) / 1000).toFixed(2)

  const result =
`*[ ✔ ] ESCANEO COMPLETADO*
*⏳ Tiempo:* ${speed}s

*RESULTADOS (100% FAKE):*
*Nombre:* ${target}
*IP:* 127.0.0.1
*Ubicación:* Internetlandia
*Proveedor:* Unicorn ISP
*Riesgo:* 0 es gay xd`

  await conn.sendMessage(m.chat, { text: result, mentions }, { quoted: m })

  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = ['doxxeo <@user|nombre>']
handler.tags = ['fun']
handler.command = /^doxxeo|doxxear|doxeo|doxear|doxeame|doxxeame/i

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
