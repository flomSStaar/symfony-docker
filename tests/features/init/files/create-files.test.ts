import { expect, it } from 'bun:test'
import { FILES_TO_CREATE } from '@/features/init/files/create-files'
import { getSymfonyScript } from '@/features/init/files/sf'
import { getDockerIgnore } from '@/features/init/files/docker-ignore'
import { getDockerfile } from '@/features/init/files/dockerfile'
import { getDockerEntrypoint } from '@/features/init/files/entrypoint'
import { getPhpIni } from '@/features/init/files/php'

it('should return the files to create', () => {
  expect(FILES_TO_CREATE).toEqual([
    {
      filename: 'sf',
      action: getSymfonyScript,
      mode: 0o755,
    },
    {
      filename: '.dockerignore',
      action: getDockerIgnore,
    },
    {
      filename: 'docker/dev/Dockerfile',
      action: getDockerfile,
    },
    {
      filename: 'docker/dev/docker-entrypoint.sh',
      action: getDockerEntrypoint,
      mode: 0o755,
    },
    {
      filename: 'docker/dev/php.ini',
      action: getPhpIni,
    },
  ])
})
