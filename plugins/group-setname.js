import Presence from '@whiskeysockets/baileys';
const handler = async (m, {conn, args, text}) => {
  if (!text) throw `*👑 𝖨𝖭𝖦𝖱𝖤𝖲𝖤 𝖤𝖫 𝖭𝖮𝖬𝖡𝖱𝖤 𝖰𝖴𝖤 𝖣𝖤𝖲𝖤𝖠 𝖰𝖴𝖤 𝖲𝖤𝖠 𝖤𝖫 𝖭𝖴𝖤𝖵𝖮 𝖭𝖮𝖬𝖡𝖱𝖤 𝖣𝖤𝖫 𝖦𝖱𝖴𝖯𝖮*`;
  try {
    const text = args.join` `;
    if (!args || !args[0]) {
    } else {
      conn.groupUpdateSubject(m.chat, text);
    }
  } catch (e) {
    throw '*[🛠 𝗜𝗡𝗙𝗢🛠] 𝖫𝖮 𝖲𝖨𝖤𝖭𝖳𝖮 𝖧𝖴𝖡𝖮 𝖴𝖭 𝖤𝖱𝖱𝖮𝖱， 𝖤𝖫 𝖭𝖮𝖬𝖡𝖱𝖤 𝖭𝖮 𝖯𝖴𝖤𝖣𝖤 𝖲𝖤𝖱 𝖬𝖠𝖲 𝖣𝖤 𝟤𝟧 𝖢𝖠𝖱𝖠𝖢𝖳𝖤𝖱𝖤𝖲*';
  }
};
handler.help = ['𝖲𝖾𝗍𝗇𝖺𝗆𝖾 <𝖳𝖾𝗑𝗍𝗈>']
handler.tags = ['𝖦𝖱𝖴𝖯𝖮𝖲'];
handler.command = /^(setname)$/i;
handler.group = true;
handler.admin = true;
export default handler;
