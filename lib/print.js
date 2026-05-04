import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'

const terminalImage = global.opts['img'] ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

export default async function (m, conn = { user: {} }) {

    if (m.sender === conn.user?.jid) return

    const botNumber = PhoneNumber('+' + conn.user?.jid.replace('@s.whatsapp.net', '')).getNumber('international')
    const senderNumber = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international')

    const senderName = await conn.getName(m.sender)
    const chatName = await conn.getName(m.chat)

    const hora = new Date().toLocaleString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })

    const filesize = (m.msg?.fileLength?.low || m.msg?.fileLength || m.text?.length || 0)

    const tipoMensaje = m.mtype
        ? m.mtype.replace(/message$/i, '')
        .replace('audio', m.msg?.ptt ? 'PTT' : 'Audio')
        .replace(/^./, v => v.toUpperCase())
        : 'Desconocido'

    let img
    try {
        if (global.opts['img'] && /sticker|image/gi.test(m.mtype)) {
            img = await terminalImage.buffer(await m.download())
        }
    } catch (e) {
        console.error(e)
    }

    // ====== DISEÑO NUEVO ESTILO EREN BOT ======

    console.log(
chalk.hex('#00f7ff')(`╭━━━〔 𝙂𝙐𝙀𝙍𝙍𝘼 𝘽𝙊𝙏 〕━━━⬣`) + '\n' +
chalk.white(`┃ ⏰ Hora: `) + chalk.cyanBright(hora) + '\n' +
chalk.white(`┃ 🤖 Bot: `) + chalk.greenBright(botNumber) + '\n' +
chalk.white(`┃ 👤 Usuario: `) + chalk.yellowBright(senderNumber + (senderName ? ` ~${senderName}` : '')) + '\n' +
chalk.white(`┃ 💬 Chat: `) + chalk.magentaBright(m.isGroup ? `Grupo - ${chatName}` : `Privado - ${chatName}`) + '\n' +
chalk.white(`┃ 📦 Tipo: `) + chalk.blueBright(tipoMensaje) + '\n' +
chalk.white(`┃ 📏 Tamaño: `) + chalk.gray(filesize + ' bytes') + '\n' +
chalk.hex('#00f7ff')(`╰━━━━━━━━━━━━━━━━━━━━⬣`)
    )

    if (img) console.log(img.trimEnd())

    if (typeof m.text === 'string' && m.text) {
        let text = m.text.replace(/\u200e+/g, '')

        if (text.length < 4096) {
            text = text.replace(urlRegex, url => chalk.blueBright(url))
        }

        if (m.mentionedJid) {
            for (let user of m.mentionedJid) {
                text = text.replace('@' + user.split`@`[0],
                    chalk.cyanBright('@' + await conn.getName(user)))
            }
        }

        console.log(
chalk.gray('╭─ Mensaje ─⬣\n') +
(m.isCommand ? chalk.yellow(text) :
m.error ? chalk.red(text) :
chalk.white(text)) +
'\n' +
chalk.gray('╰────────────⬣\n')
        )
    }

    if (/document/i.test(m.mtype)) {
        console.log(chalk.green(`📄 Documento: ${m.msg.fileName || m.msg.displayName || 'Archivo'}`))
    }

    if (/audio/i.test(m.mtype)) {
        const duration = m.msg.seconds || 0
        console.log(
chalk.cyan(
`🎧 Audio (${Math.floor(duration / 60)
.toString().padStart(2, 0)}:${(duration % 60)
.toString().padStart(2, 0)})`
)
        )
    }

    console.log()
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
    console.log(chalk.redBright("♻️  Archivo actualizado: lib/print.js"))
})
