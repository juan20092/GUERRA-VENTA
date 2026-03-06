const handler = async (m, { conn }) => {
  const usuario = m.sender; // jid, ej: "12345@s.whatsapp.net"
  const tag = `@${usuario.split('@')[0]}`;
  const porcentaje = Math.floor(Math.random() * 100) + 1;

  const mensaje =
    `💫 *CALCULADORA*\n\n` +
    `💅🏻 Los c��lculos han arrojado que ${tag} *${porcentaje}%* mmgvo 🏳️‍🌈\n` +
    `> ✰ La Propia Puta Mamando!\n\n` +
    `➤ ¡Sorpresa!`;

  // Enviar mencionando correctamente al propio usuario
  await conn.sendMessage(
    m.chat,
    { text: mensaje, mentions: [usuario] },
    { quoted: m }
  );
};

handler.command = /^(mamaguevo)$/i;
export default handler;
