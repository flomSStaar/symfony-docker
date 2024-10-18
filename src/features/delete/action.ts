import { assertSymfonyProjectPath } from '@/features/functions'
import { logger } from '@/utils/logger'
import { exists } from 'fs/promises'
import { unlink } from 'node:fs/promises'

const DELETE_FILES: string[] = [
  'compose.local.yml',
  '.dockerignore',
  'sf',
  'docker/dev/Dockerfile',
  'docker/dev/docker-entrypoint.sh',
  'docker/dev/php.ini',
]

const FILTER_FILES: { name: string; patterns: string[] }[] = [
  {
    name: '.env',
    patterns: [
      '###> docker ###',
      'NODE_VERSION=',
      'PHP_VERSION=',
      '# https://github.com/mlocati/docker-php-extension-installer',
      'PHP_EXTENSIONS=',
      '###> docker ###',
    ],
  },
  {
    name: '.env.local',
    patterns: [
      'DATABASE_URL=',
      'MAILER_DSN=smtp://mail:1025',
      'MAIL_ADMIN=admin@local.host',
      'WEB_PORT=',
      'DB_PORT=',
      'MAIL_PORT=',
    ],
  },
]

export async function deleteAction() {
  const projectPath = '.'
  await assertSymfonyProjectPath(projectPath)

  const promises = []

  logger.i('Deleting files:')

  for (let i = 0; i < DELETE_FILES.length; i++) {
    const value = DELETE_FILES[i]

    promises.push(
      (async () => {
        const filepath = `${projectPath}/${value}`
        if (await exists(filepath)) {
          await unlink(filepath)
          console.log(`- ${projectPath}/${value}`)
        }
      })(),
    )
  }

  logger.i('Filtering files:')

  for (let i = 0; i < FILTER_FILES.length; i++) {
    const value = FILTER_FILES[i]

    promises.push(
      (async () => {
        try {
          const filepath = `${projectPath}/${value.name}`
          const file = Bun.file(filepath)
          const text = await file.text()
          const patterns = value.patterns

          const filteredString = text
            .split('\n')
            .filter(v => {
              for (let i = 0; i < patterns.length; i++) {
                if (v.includes(patterns[i])) {
                  return false
                }
              }
              return true
            })
            .join('\n')
            .trim()

          await Bun.write(filepath, `${filteredString}\n`)

          console.log(`- ${projectPath}/${value.name}`)
        } catch (e) {
          /* empty */
        }
      })(),
    )
  }

  await Promise.all(promises)
}
