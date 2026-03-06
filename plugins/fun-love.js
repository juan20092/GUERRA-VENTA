let handler = async (m, { conn, text }) => {
  // 1) Aceptar mención real o texto
  const mentioned =
    (m.mentionedJid && m.mentionedJid.length ? m.mentionedJid : []) ||
    (m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []);

  if (!text && !mentioned.length) {
    return m.reply('⚠️ Debes mencionar a un usuario. Ejemplo: .love @usuario');
  }

  // 2) Si hay mención, usar esa para que sea "clickeable"
  const user = mentioned[0];
  const tag = user ? `@${user.split('@')[0]}` : text;

  const porcentaje = Math.floor(Math.random() * 100) + 1;

  const love = `*❤️ MEDIDOR DE AMOR ❤️*
*El amor de ${tag} por ti es de* *${porcentaje}%* *de un 100%*
*Deberías pedirle que sea tu novia/o?*`.trim();

  // 3) Enviar con mentions para que la mención funcione sí o sí
  await conn.sendMessage(
    m.chat,
    { text: love, mentions: user ? [user] : [] },
    { quoted: m }
  );
};

handler.help = ['love @usuario'];
handler.tags = ['fun'];
handler.command = /^(love)$/i;

export default handler;
