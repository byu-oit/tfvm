import pino from 'pino'
import { fileURLToPath } from 'url'
import { TfvmFS } from './getDirectoriesObj.js'
import fs from 'node:fs'

// today's date in YYYY-MM-DD format
const date = new Date().toISOString().split('T')[0]

// before creating a log file, make sure the logs folder exists (and its parent tfvm folder)
if (!fs.existsSync(TfvmFS.tfvmDir)) fs.mkdirSync(TfvmFS.tfvmDir)
if (!fs.existsSync(TfvmFS.otfvmDir)) fs.mkdirSync(TfvmFS.otfvmDir)
if (!fs.existsSync(TfvmFS.logsDir)) fs.mkdirSync(TfvmFS.logsDir)

// store logs in AppData so that they are maintained when switching node versions
// at most one log file is created per day
const todaysLogFile = TfvmFS.getPath(TfvmFS.logsDir, date + '.log')

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: false,
      destination: todaysLogFile,
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
  logger.info(`TfvmFS.getDirectoriesObj(): ${JSON.stringify(TfvmFS.getDirectoriesObj())}`)
}
