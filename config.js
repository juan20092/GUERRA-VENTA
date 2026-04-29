import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
[ '165043362652249', 'JUAN OFC', true ],
[ '34016526909591', 'Ayudante', true ]
  ]
global.mods = []
global.prems = []

global.emoji = '🍡'
global.emoji2 = '🍥'
global.namebot = 'GUERRA BOT👑'
global.botname = 'GUERRA BOT👑'
global.banner = 'https://api.dix.lat/media2/1777431468205.jpg'
global.packname = 'GUERRA BOT👑'
global.author = '© 𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝔍𝒖𝒂𝒏'
global.moneda = 'MayCoins'
global.libreria = 'Baileys'
global.baileys = 'V 6.7.16'
global.vs = '2.2.0'
global.usedPrefix = '#'
global.user2 = '18'
global.sessions = 'VipBot'
global.jadi = 'VipBots'
global.yukiJadibts = true

global.namecanal = 'ꘓ ✧ GUERRA BOT ┆𝖮𝖿𝗂𝖼𝗂𝖺𝗅 𝖢𝗁𝖺𝗇𝗇𝖾𝗅 ❖ 🍷 ꘔ'
global.idcanal = '120363419404216418@newsletter'
global.idcanal2 = '120363419404216418@newsletter'
global.canal = 'https://whatsapp.com/channel/0029VbARAwbEgGfOsCN1T10V'
global.canalreg = '120363419404216418@newsletter'

global.ch = {
  ch1: '120363419404216418@newsletter'
}

global.multiplier = 69
global.maxwarn = 2

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Se actualizo el 'config.js'"))
  import(`file://${file}?update=${Date.now()}`)
})
