#! /usr/bin/env node

import { Command } from 'commander'
const program = new Command()
import list from './commands/list.js'
import current from './commands/current.js'
import uninstall from './commands/uninstall.js'
import use from './commands/use.js'
import install from './commands/install.js'
import getTFVMVersion from "./util/getTFVMVersion.js"
import config from "./commands/config.js"

program
  .command('uninstall <version>')
  .description('Uninstall a version of terraform')
  .action(uninstall)

program
  .command('list')
  .description('List all downloaded version of terraform')
  .action(list)

program
  .command('current')
  .description('Display current version of terraform. Does the same thing as `terraform -v`')
  .action(current)

program
  .command('use <version>')
  .description('Use a version of terraform')
  .action(use)

program
  .command('config <setting=variable>')
  .description('Change a tfvm setting')
  .action(config)

program
  .command('install <version>')
  .description('Use a version of terraform')
  .action(install)


program.version(await getTFVMVersion(), '-v, --version', 'Output the current version')

program.parse()
