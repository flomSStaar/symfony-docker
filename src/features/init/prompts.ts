import { onCommandCancel } from '@/utils/commons'
import prompts from 'prompts'

export const promptPhpVersion = () =>
  prompts(
    {
      type: 'text',
      message: 'Which version of PHP do you want ?',
      name: 'phpVersion',
      initial: '8.2',
    },
    { onCancel: onCommandCancel },
  )

export const promptNode = () =>
  prompts(
    [
      {
        type: 'confirm',
        message: 'Do you want to configure Node for this project ?',
        name: 'useNode',
        initial: true,
      },
      {
        type: prev => (prev === true ? 'number' : null),
        message: 'Which version of Node do you want ?',
        name: 'nodeVersion',
        initial: 20,
      },
    ],
    { onCancel: onCommandCancel },
  )

export const promptMailhog = () =>
  prompts(
    {
      type: 'confirm',
      message: 'Do you want to configure MailHog for this project ?',
      name: 'useMail',
      initial: false,
    },
    { onCancel: onCommandCancel },
  )
