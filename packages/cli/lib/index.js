#! /usr/bin/env node
import { Command } from 'commander'
import list from './commands/list.js'
import current from './commands/current.js'
import uninstall from './commands/uninstall.js'
import use from './commands/use.js'
import install from './commands/install.js'
import getTFVMVersion from './util/getTFVMVersion.js'
import config from './commands/config.js'
import detect from './commands/detect.js'
import { logger } from './util/logger.js'
import verifySetup from './util/verifySetup.js'
import chalk from 'chalk'

const program = new Command()

program
  .option('-l, --log-level <level>', 'specify log level (default "info")')
  .hook('preAction', async (thisCommand) => {
    const logLevel = thisCommand.opts().logLevel
    logger.level = logLevel || process.env.LOG_LEVEL || 'info'
    logger.debug(`Beginning execution of command "${thisCommand.args.join(' ')}":`)
    logger.trace(`Raw Args: ${JSON.stringify(thisCommand.rawArgs.join(' '))}`)
    if (!await verifySetup()) {
      logger.fatal('failed verifySetup()')
      process.exit(-1)
    }
  })
  .hook('postAction', (thisCommand) => {
    logger.debug(`Execution of "${thisCommand.args.join(' ')}" command finished.\n\n\n`)
  })

program
  .command('detect', { isDefault: true })
  .description('Switch to version specified by local .tf files')
  .action(detect)

program
  .command('uninstall <version>')
  .description('Uninstall a version of terraform')
  .action(uninstall)

program
  .command('list')
  .alias('ls')
  .description('List all downloaded version of terraform')
  .action(list)

program
  .command('current')
  .description('Display current version of terraform. Does the same thing as `terraform -v`')
  .action(current)

program
  .command('use <version>')
  .alias('u')
  .description('Use a version of terraform')
  .action(use)

program
  .command('config')
  .argument('[setting=boolean]')
  .description('Change a tfvm setting')
  .action(config)
  .addHelpText('after', '\nAll settings are either true or false (default is false), and set like this:\n' +
    chalk.cyan('\n  tfvm config <setting>=<true/false>\n\n') +
    'Here are all the available settings:\n' +
    'disableErrors - Disables some recurrent warning messages\n' +
    'disableAWSWarnings - Disables warnings about needing old AWS authentication with tf versions older than 0.14.6\n' +
    'disableSettingsPrompts - Disables prompts to turn off warnings by enabling these settings\n' +
    'useOpenTofu - Uses OpenTofu instead of Terraform\n' +
    'disableTofuWarnings - Disables warnings related to using Tofu (deleting executables, using Tofu instead of Terraform, etc.)')

program
  .command('install <version>')
  .alias('i')
  .description('Install a version of terraform')
  .action(install)
  .addHelpText('after', '\nGet a list of all current terraform versions here: ' + chalk.blue.bold('https://releases.hashicorp.com/terraform/'))

program.version(await getTFVMVersion(), '-v, --version', 'Output the current version of tfvm')

program.parse()
