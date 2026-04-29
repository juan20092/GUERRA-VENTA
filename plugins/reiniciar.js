import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

// =========================
// UTILIDADES
// =========================
function run(cmd, cwd = ROOT) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd, windowsHide: true, maxBuffer: 1024 * 1024 * 8 }, (err, stdout, stderr) => {
      if (err) return reject(Object.assign(err, { stdout, stderr }))
      resolve({ stdout, stderr })
    })
  })
}

async function hasGit() {
  try {
    await run('git --version')
    return true
  } catch {
    return false
  }
}

function isGitRepo() {
  return fs.existsSync(path.join(ROOT, '.git'))
}

// =========================
// GUARDAR INFO RESTART
// =========================
function saveRestartInfo(chatId) {
  const tempDir = path.join(ROOT, 'temp')
  const restartFile = path.join(tempDir, 'restart_info.json')

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  const info = {
    chatId,
    timestamp: Date.now()
  }

  fs.writeFileSync(restartFile, JSON.stringify(info, null, 2))
}

// =========================
// HANDLER PRINCIPAL
// =========================
let handler = async (m, { conn, isOwner, isROwner }) => {
  if (!(isOwner || isROwner)) return

  // Guardar info para reconexión
  saveRestartInfo(m.chat)

  await m.react('🕑')

  let logs = []
  const pushLog = (title, data) => {
    if (!data) return
    const body = [data.stdout, data.stderr].filter(Boolean).join('\n').trim()
    const trimmed = body.length > 1500 ? body.slice(-1500) : body
    logs.push(`> ${title}:\n\`\`\`${trimmed || '(sin salida)'}\`\`\``)
  }

  // =========================
  // GIT PULL
  // =========================
  try {
    if (isGitRepo() && (await hasGit())) {
      const res = await run('git --no-pager pull --rebase --autostash')
      pushLog('🎄 Git Update', res)
    } else {
      logs.push('> 🎄 Git: omitido')
    }
  } catch (e) {
    pushLog('🎄 Git ERROR', e)
  }

  // =========================
  // NPM INSTALL
  // =========================
  try {
    const res = await run('npm install --no-audit --no-fund')
    pushLog('📦 Dependencias', res)
  } catch (e) {
    pushLog('📦 Dependencias ERROR', e)
  }

  await m.react('✅')

  // ⚠️ NO enviar mensaje aquí
  // el mensaje se envía después del restart real

  setTimeout(() => {
    process.exit(0)
  }, 2000)
}

// =========================
// MENSAJE DE RECONEXIÓN REAL
// =========================
export async function sendReconnectionMessage(conn) {
  const restartFile = path.join(ROOT, 'temp', 'restart_info.json')

  if (!fs.existsSync(restartFile)) return

  try {
    const info = JSON.parse(fs.readFileSync(restartFile, 'utf8'))
    fs.unlinkSync(restartFile)

    const tiempo = Date.now() - info.timestamp

    await conn.sendMessage(info.chatId, {
      text: `> 🤖 *BOT EN LÍNEA NUEVAMENTE 🍃*

> 🌐 Estado: Conectado
> ⚡ Servicios: Activos
> 🎯 Funciones: Operativas
> 🕑 Tiempo de reconexión: ${tiempo}ms
> 🔰 Estado: ✅ Online
> 💾 Servicios: 🟢 OK

> 🚀 *Sistema listo*`
    })

  } catch (error) {
    console.error('❌ Error reconexión:', error)
  }
}

// =========================
// CONFIG
// =========================
handler.help = ['reiniciar', 'restart']
handler.tags = ['owner']
handler.command = /^(fix|reiniciar)$/i
handler.rowner = true

export default handler
