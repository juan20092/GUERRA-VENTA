const handler = async (m, { conn, participants, groupMetadata }) => {
  const total = participants.length;

  // Nombre del grupo (si está disponible)
  const groupName =
    groupMetadata?.subject ||
    (m?.chat ? `Grupo` : `Chat`);

  const titulo = `*╭〔 𝙈𝙀𝙉𝘾𝙄𝙊́𝙉 𝙂𝙀𝙉𝙀𝙍𝘼𝙇 〕╮*`;
  const subtitulo = `*│* *${groupName}*`;
  const info = `*│* *Para ${total} miembros*  🌟`;
  const separador = `*╰───────────╯*\n`;

  // Menciones en formato bonito (en columnas)
  const lines = participants.map((u, i) => {
    const numero = (u.id || '').split('@')[0];
    // Cambia el número por el emoji ❤️
    return `➤ 🌟 @${numero}`;
  });

  // (Opcional) divide el bloque para que no se vea eterno en grupos grandes
  const chunkSize = 35; // ajusta si quieres
  const chunks = [];
  for (let i = 0; i < lines.length; i += chunkSize) {
    chunks.push(lines.slice(i, i + chunkSize).join('\n'));
  }

  await conn.sendMessage(m.chat, { react: { text: '🌟', key: m.key } });

  for (let i = 0; i < chunks.length; i++) {
    const header =
      `${titulo}\n${subtitulo}\n${info}\n${separador}` +
      (chunks.length > 1 ? `*Parte ${i + 1}/${chunks.length}*\n\n` : `\n`);

    await conn.sendMessage(
      m.chat,
      {
        text: header + chunks[i],
        mentions: participants.map(p => p.id)
      },
      { quoted: m }
    );
  }
};

handler.customPrefix = /^\.?(todos|all|tagall)$/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;

export default handler;
