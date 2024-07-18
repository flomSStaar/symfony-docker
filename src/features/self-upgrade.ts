import { configureErrors } from '@/utils/commons'
import { $ } from 'bun'
import { Command } from 'commander'

export const upgradeCommand = new Command()
  .name('self-upgrade')
  .description('Upgrade to latest version of sfd')
  .action(async () => {
    const sfdPath = process.env.SFD_PATH

    if(!sfdPath) {
      upgradeCommand.error('Cannot find SFD_PATH env variable')
      return
    }

    const result = await $`git pull`.cwd(sfdPath)

    if (result.exitCode !== 0) {
      upgradeCommand.error('An error occurred while upgrading sfd command')
    }
  })

configureErrors(upgradeCommand, 'UPGRADE')
