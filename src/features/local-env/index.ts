import { localEnvAction } from '@/features/local-env/action'
import { CancelledError, configureErrors } from '@/utils/commons'
import { Command } from 'commander'

export const localEnvCommand = new Command()
  .name('local-env')
  .description('Create local env for a dockerized Symfony project')
  .action(async () => {
    try {
      await localEnvAction()
    } catch (e) {
      if (e instanceof CancelledError) {
        localEnvCommand.error(e.message)
      } else if (e instanceof Error) {
        localEnvCommand.error(e.message)
      } else {
        localEnvCommand.showHelpAfterError(true)
        localEnvCommand.error('An error occurred')
      }
    }
  })

configureErrors(localEnvCommand, 'LOCAL_ENV')
