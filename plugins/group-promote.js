var handler = async (m, { conn,usedPrefix, command, text }) => {

    var done = '✅'; 

        if (text && text.includes('@')) {
            // Extrae el número después de @ si el texto es tipo "@12345678901"
            const match = text.match(/@(\d{7,})/);
            if (match) {
                var number = match[1];
            } else {
                var number = text.replace(/[^0-9]/g, '');
            }
    } else if (!isNaN(text)) {
        var number = text;
    }

    if (!text && !m.quoted && !(m.mentionedJid && m.mentionedJid[0])) return conn.reply(m.chat, `> ➤『  𝗠𝗘𝗡𝗖𝗜𝗢𝗡𝗔 𝗔 𝗨𝗡𝗔 𝗣𝗘𝗥𝗦𝗢𝗡𝗔 𝗤𝗨𝗘 𝗗𝗘𝗦𝗘𝗔𝗦 𝗣𝗥𝗢𝗠𝗢𝗩𝗘𝗥 👑 』 `, m,rcanal);
    
    if (number && (number.length > 13 || (number.length < 11 && number.length > 0))) return conn.reply(m.chat, `> ➤『  𝗠𝗘𝗡𝗖𝗜𝗢𝗡𝗔 𝗔 𝗨𝗡𝗔 𝗣𝗘𝗥𝗦𝗢𝗡𝗔 𝗤𝗨𝗘 𝗗𝗘𝗦𝗘𝗔𝗦 𝗣𝗥𝗢𝗠𝗢𝗩𝗘𝗥 👑 』 `, m,rcanal);

    try {
        var user;
        if (m.mentionedJid && m.mentionedJid[0]) {
            user = m.mentionedJid[0];
        } else if (text) {
            user = number + '@s.whatsapp.net';
        } else if (m.quoted && m.quoted.sender) {
            user = m.quoted.sender;
        }
    } catch (e) {
        console.error("Error determining user:", e);
        return conn.reply(m.chat, `🚫 𝐄𝐑𝐑𝐎𝐑 𝐈𝐃𝐄𝐍𝐓𝐈𝐅𝐈𝐂𝐀𝐑 𝐀𝐃𝐌𝐈𝐍`, m);
    } finally {
        if (user) {
            await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
            conn.reply(m.chat, `${done} 𝐔𝐒𝐄𝐑 𝐄𝐒 𝐀𝐃𝐌𝐈𝐍 𝐂𝐎𝐍 𝐄𝐗𝐈𝐓𝐎`, m,rcanal);
        } else {
            conn.reply(m.chat, `🚫 𝐄𝐑𝐑𝐎𝐑 𝐈𝐃𝐄𝐍𝐓𝐈𝐅𝐈𝐂𝐀𝐑 𝐀𝐃𝐌𝐈𝐍`, m,rcanal);
        }
    }
}

handler.customPrefix = /^\.?promote/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
export default handler;
