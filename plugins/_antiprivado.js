export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  const text = typeof m.text === 'string' ? m.text : '';
  if (text.includes('PIEDRA') || text.includes('PAPEL') || text.includes('TIJERA') || text.includes('serbot') || text.includes('jadibot')) return !0;
  const bot = global.db.data.settings[conn.user.jid] || {};
  if (bot.antiPrivate && !isOwner && !isROwner) {
    const target = normalizeBlockJid(m.sender || m.chat);
    if (!target || target === conn.user.jid) return !1;

    try {
      await conn.updateBlockStatus(target, 'block');
    } catch (error) {
      console.error('antiprivado:block-failed', target, error?.data || error?.message || error);
    }
  }
  return !1;
}

function normalizeBlockJid(jid) {
  if (!jid || typeof jid !== 'string') return null;
  if (jid === 'status@broadcast' || jid.endsWith('@newsletter') || jid.endsWith('@g.us')) return null;
  if (jid.endsWith('@s.whatsapp.net')) return jid;
  return null;
}
