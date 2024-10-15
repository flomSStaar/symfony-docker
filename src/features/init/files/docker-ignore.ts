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
    .appendLine('sf')
    .appendLine('README.md')
    .appendLine('.idea')
    .appendLine('.vscode')
    .appendLine('.php-cs-fixer.dist.php')
    .appendLine('phpstan.dist.neon')

  return builder.toString()
}
