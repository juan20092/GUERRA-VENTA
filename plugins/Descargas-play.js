import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) {
    return conn.reply(m.chat, 
`> ⓘ USO INCORRECTO

> ❌ Debes proporcionar el nombre de la canción

> 📝 Ejemplos:
> • ${usedPrefix}play nombre de la canción
> • ${usedPrefix}play artista canción`, m)
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } })

    const search = await yts(text)
    if (!search.videos.length) throw new Error('No encontré resultados')

    const video = search.videos[0]
    const { title, url, thumbnail } = video

    let thumbBuffer = null
    if (thumbnail) {
      try {
        const resp = await fetch(thumbnail)
        thumbBuffer = Buffer.from(await resp.arrayBuffer())
      } catch {}
    }

    
    const apiB64 = 'aHR0cHM6Ly9zbWFzYWNoaWthLmFseWFib3QueHl6L2Rvd25sb2FkX2F1ZGlvP3VybD0='
    const endpoint = Buffer.from(apiB64, 'base64').toString('utf-8') + encodeURIComponent(url)

    const response = await fetch(endpoint)
    if (!response.ok) throw new Error('Error en la respuesta del servidor')

    const data = await response.json()
    const audioUrl = data?.file_url 
    
    if (!audioUrl) throw new Error('La API no devolvió un enlace de descarga válido')

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        ptt: false,
        jpegThumbnail: thumbBuffer,
        fileName: `${title}.mp3`
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    await conn.reply(m.chat, 
`> ⓘ ERROR

> ❌ ${e.message}

> 💡 Intenta con otro nombre o más tarde`, m)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
  }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = ['play']
handler.group = true

export default handler
