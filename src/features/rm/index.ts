import { removeAction } from '@/features/rm/action'
import { CancelledError, configureErrors } from '@/utils/commons'
import { Command } from 'commander'

export const removeCommand = new Command()
  .name('rm')
  .description('Remove docker module of a Symfony Docker project')
  .action(async () => {
    try {
      await removeAction()
    } catch (e) {
      if (e instanceof CancelledError) {
        removeCommand.error(e.message)
      } else if (e instanceof Error) {
        removeCommand.error(e.message)
      } else {
        removeCommand.showHelpAfterError(true)
        removeCommand.error('An error occurred')
      }
    }
  })

configureErrors(removeCommand, 'RM')
