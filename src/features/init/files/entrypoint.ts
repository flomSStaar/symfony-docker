import { StringBuilder } from '@/utils/string-builder'

export function getDockerEntrypoint() {
  const builder = new StringBuilder()

  builder
    .appendLine('#!/bin/sh')
    .newLine()
    .appendLine('set -e')
    .newLine()
    .appendLine('composer install --no-interaction')
    .newLine()
    .appendLine('exec "$@"')

  return builder.toString()
}
