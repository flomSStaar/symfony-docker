import { StringBuilder } from '@/utils/string-builder'

export function getDockerIgnore() {
  const builder = new StringBuilder()

  builder
    .appendLine('assets/vendor')
    .appendLine('compose.?*.yml')
    .appendLine('Dockerfile')
    .appendLine('.dockerignore')
    .appendLine('.git')
    .appendLine('node_modules')
    .appendLine('var')
    .appendLine('vendor')
    .appendLine('.env.*')
    .appendLine('public/build')
    .appendLine('public/bundles')

  return builder.toString()
}
