import pino from 'pino'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs'
const logsPath = resolve(dirname(fileURLToPath(import.meta.url)), './../logs/')
if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath)
const destination = resolve(logsPath, `./${new Date().toISOString().split('T')[0]}.txt`)

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: false,
      destination,
      translateTime: 'SYS:yyyy-mm-dd\' \'HH:MM:ss.l'
    }
  },
  base: { }
})

export function printDebugInfo (err) {
  logger.info(err, 'Printing system information for debugging purposes as a result of this error: ')
  logger.info(`process.env.PROCESSOR_ARCHITECTURE: ${process.env.PROCESSOR_ARCHITECTURE}`)
  logger.info(`process.env.PINO_LOG_LEVEL: ${process.env.PINO_LOG_LEVEL}`)
  logger.info(`process.env.APPDATA: ${process.env.APPDATA}`)
  logger.info(`process.platform: ${process.platform}`)
  logger.info(`process.env.HOME: ${process.env.HOME}`)
  logger.info(`fileURLToPath(import.meta.url): ${fileURLToPath(import.meta.url)}`)
}
