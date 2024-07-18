#!/usr/bin/env bun

import { upgradeCommand } from '@/features/self-upgrade'
import { Command } from 'commander'

import packageJSON from '../package.json'
import { localEnvCommand } from 'features/local-env'
import { removeCommand } from 'features/rm'
import { deleteCommand } from 'features/delete'
import { addCommand } from 'features/add'
import { initCommand } from 'features/init'

const sfd = new Command()
  .name('sfd')
  .version(packageJSON.version, '-v, --version')

// Commands
sfd
  .addCommand(initCommand)
  .addCommand(addCommand)
  .addCommand(deleteCommand)
  .addCommand(removeCommand)
  .addCommand(localEnvCommand)
  .addCommand(upgradeCommand)
  .action(() => {
    sfd.help()
  })

sfd.configureOutput({
  writeErr(str: string) {
    console.error(`\x1b[31m[ERR]: ${str}\x1b[0m`)
  },
  outputError(str: string, write: (str: string) => void) {
    write(str)
  },
})

sfd.parse()
