#! /usr/bin/env node

import { Command } from 'commander';
const program = new Command();
import list from './commands/list.js';

program
  .command('list')
  .description('List all downloaded version of terraform')
  .action(list)

program.parse();
