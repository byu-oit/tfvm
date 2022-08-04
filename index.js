#! /usr/bin/env node

import { Command } from 'commander';
const program = new Command();
import list from './commands/list.js';
import uninstall from './commands/uninstall.js';

program
  .command('uninstall <version>')
  .description('List all downloaded version of terraform')
  .action(uninstall)

program
  .command('list')
  .description('List all downloaded version of terraform')
  .action(list)
program.parse();
