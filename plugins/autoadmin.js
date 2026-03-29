const handler = async (m, { conn, isAdmin, groupMetadata }) => {
  if (isAdmin) return m.reply(
`❏ ─ 𝗔𝗨𝗧𝗢 𝗔𝗗𝗠𝗜𝗡 ─ ❏
> ➤ 𝗬𝗔 𝗘𝗥𝗘𝗦 𝗔𝗗𝗠𝗜𝗡 𝗝𝗘𝗙𝗘
❏ ─────────── ❏`
  );

  try {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');

    await m.react('✅');

       m.reply(
`❏ ─ 𝗔𝗨𝗧𝗢 𝗔𝗗𝗠𝗜𝗡 ─ ❏
> ➤ 𝗬𝗔 𝗘𝗥𝗘𝗦 𝗔𝗗𝗠𝗜𝗡 𝗝𝗘𝗙𝗘
❏ ─────────── ❏`
    );

    let nn = conn.getName(m.sender);

    conn.reply(
      '544123989549@s.whatsapp.net',
`❏ ─ 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗖𝗜𝗢́𝗡 ─ ❏
> ➤ 𝗘𝗟 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 *${nn}* 𝗦𝗘 𝗗𝗜𝗢 𝗔𝗨𝗧𝗢 𝗔𝗗𝗠𝗜𝗡 𝗘𝗡:
> ${groupMetadata.subject}
❏ ─────────── ❏`, 
      m
    );

  } catch (err) {
        m.reply(
`❏ ─ 𝗘𝗥𝗥𝗢𝗥 ─ ❏
> ➤ 𝗗𝗲𝗺𝗮𝘀𝗶𝗮𝗱𝗼 𝗕𝘂𝗲𝗻𝗼... 𝗻𝗼 𝗽𝘂𝗱𝗲 𝗿𝗲𝗮𝗹𝗶𝘇𝗮𝗿 𝗹𝗮 𝗮𝗰𝗰𝗶𝗼́𝗻
❏ ─────────── ❏`
    );
    console.error(err);
  }
};

handler.tags = ['owner'];
handler.help = ['autoadmin'];
handler.command = ['autoadmin', 'tenerpoder'];
handler.mods = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
