import { assertSymfonyProjectPath } from '@/features/functions'
import { AVAILABLE_SYMFONY_SERVICES } from 'services'
import { AbstractService } from '@/services/abstract-service'
import { logger } from '@/utils/logger'
import { onCommandCancel } from '@/utils/commons'
import { ComposeBuilder } from '@/utils/compose-builder'
import { EnvBuilder } from '@/utils/env-builder'
import { writeFile } from 'fs/promises'
import prompts from 'prompts'

export async function removeAction() {
  const projectPath = '.'
  await assertSymfonyProjectPath(projectPath)

  const composeFilename = `${projectPath}/compose.yml`
  const envFilename = `${projectPath}/.env`
  const envLocalFilename = `${projectPath}/.env.local`

  const composeFile = Bun.file(composeFilename)
  if (!(await composeFile.exists())) {
    throw new Error('The project is not initialized with Docker, try to run `sfd init` first.')
  }
  const envFile = Bun.file(envFilename)
  const envLocalFile = Bun.file(envLocalFilename)

  const composeBuilder = ComposeBuilder.from(await composeFile.text())
  const envBuilder = EnvBuilder.from(await envFile.text())
  const envLocalBuilder = EnvBuilder.from(await envLocalFile.text())

  const removableServices = AVAILABLE_SYMFONY_SERVICES.filter(service => {
    return service.removable && composeBuilder.hasService(service.composeKey)
  }).map(service => ({
    title: service.name,
    value: service,
  }))

  if (removableServices.length === 0) {
    logger.i('No service to remove')
    return
  }

  const serviceResult = await prompts(
    {
      message: 'Which service do you want to remove in your project ?',
      type: 'autocomplete',
      name: 'services',
      choices: removableServices,
    },
    { onCancel: onCommandCancel },
  )

  const service = serviceResult.services

  if (!(service instanceof AbstractService)) {
    throw new Error('Invalid class')
  }

  logger.i(`Removing ${service.name} service to project`)
  service.removeToCompose(composeBuilder)
  service.removeToEnv(envBuilder)
  service.removeToEnvLocal(envLocalBuilder)

  await writeFile(composeFilename, composeBuilder.toString())
  await writeFile(envFilename, envBuilder.toString())
  await writeFile(envLocalFilename, envLocalBuilder.toString())
  logger.success(`Service ${service.name} removed successfully`)
}
