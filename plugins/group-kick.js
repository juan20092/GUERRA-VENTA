var handler = async (m, { conn, participants, usedPrefix, command, rcanal }) => {
	let mentionedJid = await m.mentionedJid;
	let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null;
	if (!user) return conn.reply(m.chat, `> ➤『  𝗠𝗘𝗡𝗖𝗜𝗢𝗡𝗔 𝗔 𝗨𝗡𝗔 𝗣𝗘𝗥𝗦𝗢𝗡𝗔 𝗤𝗨𝗘 𝗗𝗘𝗦𝗘𝗔𝗦 𝗘𝗟𝗜𝗠𝗜𝗡𝗔𝗥 🌟』 `, m, rcanal);
	try {
		const groupInfo = await conn.groupMetadata(m.chat);
		const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
		const ownerBot = global.owner[0][0] + '@s.whatsapp.net';
		if (user === conn.user.jid) return conn.reply(m.chat, `🚫 No puedo eliminar el bot del grupo.`, m, rcanal);
		if (user === ownerGroup) return conn.reply(m.chat, `🚫 No puedo eliminar al propietario del grupo.`, m, rcanal);
		if (user === ownerBot) return conn.reply(m.chat, `🚫 No puedo eliminar al propietario del bot.`, m, rcanal);
		await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
	} catch (e) {
		conn.reply(m.chat, `🚫 Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`, m, rcanal);
	}
}

handler.customPrefix = /^\.?kick/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
export default handler;
