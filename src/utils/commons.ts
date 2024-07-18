import { Command } from 'commander'

export function configureErrors(command: Command, label: string) {
  command.configureOutput({
    outputError(str: string, write: (str: string) => void) {
      write(`\x1b[31m[ERROR-${label}]: ${str}\x1b[0m`)
    },
  })
}

export class CancelledError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CancelledError'
  }
}

export function onCommandCancel() {
  throw new CancelledError('cancelled')
}
