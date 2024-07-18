import { CancelledError, configureErrors } from '@/utils/commons'
import { Command } from 'commander'
import { addAction } from '@/features/add/action'

export const addCommand = new Command()
  .name('add')
  .description('Add docker module in a Symfony Docker project')
  .action(async () => {
    try {
      await addAction()
    } catch (e) {
      if (e instanceof CancelledError) {
        addCommand.error(e.message)
      } else if (e instanceof Error) {
        addCommand.error(e.message)
      } else {
        addCommand.showHelpAfterError(true)
        addCommand.error('An error occurred')
      }
    }
  })

configureErrors(addCommand, 'ADD')
