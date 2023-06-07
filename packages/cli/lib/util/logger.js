import pino from 'pino'
import { fileURLToPath } from 'url'
import getDirectoriesObj from './getDirectoriesObj.js'

// today's date in YYYY-MM-DD format
const date = new Date().toISOString().split('T')[0]
// store logs in AppData so that they are maintained when switching node versions
const { logsDir } = getDirectoriesObj()
// at most one log file is created per day
const todaysLogFile = `${logsDir}\\${date}.log`

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
  logger.info(`getDirectoriesObj(): ${JSON.stringify(getDirectoriesObj())}`)
}
