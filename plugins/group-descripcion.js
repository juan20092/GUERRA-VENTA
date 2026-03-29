const handler = async (m, {conn, args}) => {
  await conn.groupUpdateDescription(m.chat, `${args.join(' ')}`);
  m.reply('> ➤『 𝘓𝘢 𝘥𝘦𝘴𝘤𝘳𝘪𝘱𝘤𝘪ó𝘯 𝘥𝘦𝘭 𝘨𝘳𝘶𝘱𝘰 𝘴𝘦 𝘮𝘰𝘥𝘪𝘧𝘪𝘤𝘰 𝘤𝘰𝘳𝘳𝘦𝘤𝘵𝘢𝘮𝘦𝘯𝘵𝘦 🌟』');
};
handler.help = ['groupdesc <text>'];
handler.tags = ['grupo'];
handler.command = ['gpdesc', 'groupdesc']
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
export default handler;
