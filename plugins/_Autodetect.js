export async function before(m, { conn, participants }) {
  if (!m.messageStubType || !m.isGroup) return

  const usuario = `@${m.sender.split('@')[0]}`
  const admins = participants.filter(p => p.admin !== null).map(p => p.id)

  // 📌 Imagen estable 300x300 (perfil o fallback)
  let pp
  try {
    const url = await conn.profilePictureUrl(m.sender, 'image')
      .catch(() => 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png')
    pp = await conn.getFile(url).then(r => r.data)
  } catch {
    pp = await conn.getFile('https://cdn-icons-png.flaticon.com/512/3135/3135715.png')
      .then(r => r.data)
  }

  // 📍 Fake Contact (NO SE DAÑA)
  const fkontak = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'JirenBot'
    },
    message: {
      locationMessage: {
        name: 'Hola, Soy 𝕵𝑰𝑹𝑬𝑵 𝕭𝑶𝑻',
        jpegThumbnail: pp
      }
    },
    participant: '0@s.whatsapp.net'
  }

  const param = m.messageStubParameters?.[0]
  const mentions = [
    m.sender,
    ...(param?.includes('@') ? [param] : []),
    ...admins
  ]

  switch (m.messageStubType) {

    case 21:
      await conn.sendMessage(m.chat, {
        text: `${usuario} \`𝐇𝐀 𝐂𝐀𝐌𝐁𝐈𝐀𝐃𝐎 𝐄𝐋 𝐍𝐎𝐌𝐁𝐑𝐄 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎 𝐀:\`\n\n> *${param}*`,
        mentions
      }, { quoted: fkontak })
      break

    case 22:
      await conn.sendMessage(m.chat, {
        text: `${usuario} \`𝐂𝐀𝐌𝐁𝐈𝐎 𝐋𝐀 𝐅𝐎𝐓𝐎 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎\``,
        mentions
      }, { quoted: fkontak })
      break

    case 24:
      await conn.sendMessage(m.chat, {
        text: `${usuario} \`𝐇𝐀 𝐂𝐀𝐌𝐁𝐈𝐀𝐃𝐎 𝐋𝐀 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎\``,
        mentions
      }, { quoted: fkontak })
      break

    case 25:
      await conn.sendMessage(m.chat, {
        text: `📌 \`𝐀𝐇𝐎𝐑𝐀 ${param === 'on' ? '𝐒𝐎𝐋𝐎 𝐀𝐃𝐌𝐈𝐍𝐒' : '𝐓𝐎𝐃𝐎𝐒'} 𝐏𝐔𝐄𝐃𝐄𝐍 𝐄𝐃𝐈𝐓𝐀𝐑 𝐋𝐀 𝐈𝐍𝐅𝐎\``,
        mentions
      }, { quoted: fkontak })
      break

    case 26:
      await conn.sendMessage(m.chat, {
        text:
          `> 𝐆𝐑𝐔𝐏𝐎 *${param === 'on' ? '𝐂𝐄𝐑𝐑𝐀𝐃𝐎 🔒' : '𝐀𝐁𝐈𝐄𝐑𝐓𝐎 🔓'}*\n\n` +
          `> ${param === 'on'
            ? '𝐒𝐎𝐋𝐎 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐃𝐎𝐑𝐄𝐒 𝐄𝐒𝐂𝐑𝐈𝐁𝐄𝐍'
            : '𝐘𝐀 𝐓𝐎𝐃𝐎𝐒 𝐏𝐔𝐄𝐃𝐄𝐍 𝐄𝐒𝐂𝐑𝐈𝐁𝐈𝐑'}`,
        mentions
      }, { quoted: fkontak })
      break

    case 29:
      await conn.sendMessage(m.chat, {
        text:
          `@${param.split('@')[0]}\n\n` +
          `> 𝐀𝐇𝐎𝐑𝐀 𝐓𝐈𝐄𝐍𝐄 𝐏𝐎𝐃𝐄𝐑𝐄𝐒 🛡️\n\n` +
          `📌 𝐀𝐃𝐌𝐈𝐍: ${usuario}`,
        mentions
      }, { quoted: fkontak })
      break

    case 30:
      await conn.sendMessage(m.chat, {
        text:
          `@${param.split('@')[0]}\n\n` +
          `> 𝐘𝐀 𝐍𝐎 𝐓𝐈𝐄𝐍𝐄 𝐏𝐎𝐃𝐄𝐑𝐄𝐒 🛡️\n\n` +
          `📌 𝐋𝐄 𝐐𝐔𝐈𝐓𝐎 𝐀𝐃𝐌𝐈𝐍: ${usuario}`,
        mentions
      }, { quoted: fkontak })
      break

    case 72:
      await conn.sendMessage(m.chat, {
        text:
          `${usuario}\n\n` +
          `> 𝐂𝐀𝐌𝐁𝐈𝐎 𝐋𝐀 𝐃𝐔𝐑𝐀𝐂𝐈𝐎́𝐍 𝐃𝐄 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 𝐓𝐄𝐌𝐏𝐎𝐑𝐀𝐋𝐄𝐒 A @${param}`,
        mentions
      }, { quoted: fkontak })
      break

    case 123:
      await conn.sendMessage(m.chat, {
        text: `${usuario} 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐎 𝐋𝐎𝐒 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 𝐓𝐄𝐌𝐏𝐎𝐑𝐀𝐋𝐄𝐒`,
        mentions
      }, { quoted: fkontak })
      break
  }
}
