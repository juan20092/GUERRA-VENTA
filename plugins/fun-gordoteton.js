let handler = async (m, { conn }) => {
  // Obtener mención (forma típica en Baileys/MD)
  let mentioned = (m.mentionedJid && m.mentionedJid.length) ? m.mentionedJid : [];

  // Fallback si viene por contextInfo
  if (!mentioned.length) {
    mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  }

  if (!mentioned.length) {
    return conn.sendMessage(
      m.chat,
      { text: "⚠️ Debes mencionar a un usuario. Usa el formato: .gordoteton @usuario" },
      { quoted: m }
    );
  }

  const user = mentioned[0];

  // Nombre del usuario
  let name = user;
  try {
    name = (await conn.getName(user)) || user;
  } catch {}

  const porcentaje = Math.floor(Math.random() * 100) + 1;
  const tag = `@${user.split('@')[0]}`;

  const mensaje = `🤣 ${tag} tiene un ${porcentaje}% de ser gordoteton! ¡No te lo tomes a mal!`;

  await conn.sendMessage(
    m.chat,
    { text: mensaje, mentions: [user] },
    { quoted: m }
  );
};

handler.help = ['gordoteton @usuario'];
handler.tags = ['diversión'];
handler.command = ['gordoteton'];

export default handler;
