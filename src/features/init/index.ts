import { CancelledError, configureErrors } from '@/utils/commons'
import { Command } from 'commander'
import { initAction } from '@/features/init/action'

export const initCommand = new Command()
  .name('init')
  .description('Initialize a Symfony project with Docker')
  .action(async () => {
    try {
      await initAction()
    } catch (e) {
      if (e instanceof CancelledError) {
        initCommand.error(e.message)
      } else if (e instanceof Error) {
        initCommand.error(e.message)
      } else {
        initCommand.showHelpAfterError(true)
        initCommand.error('An error occurred')
      }
    }
  })

configureErrors(initCommand, 'INIT')
