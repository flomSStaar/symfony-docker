import { deleteAction } from '@/features/delete/action'
import { CancelledError, configureErrors } from '@/utils/commons'
import { Command } from 'commander'

export const deleteCommand = new Command()
  .name('delete')
  .description('Delete Docker configuration of a dockerized Symfony project')
  .action(async () => {
    try {
      await deleteAction()
    } catch (e) {
      if (e instanceof CancelledError) {
        deleteCommand.error(e.message)
      } else if (e instanceof Error) {
        deleteCommand.error(e.message)
      } else {
        deleteCommand.showHelpAfterError(true)
        deleteCommand.error('An error occurred')
      }
    }
  })

configureErrors(deleteCommand, 'DELETE')
