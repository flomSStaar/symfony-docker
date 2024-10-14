import { assertSymfonyProjectPath } from '@/features/functions'
import { AVAILABLE_SYMFONY_SERVICES } from 'services'
import { AbstractService } from '@/services/abstract-service'
import { logger } from '@/utils/logger'
import { onCommandCancel } from '@/utils/commons'
import { ComposeBuilder } from '@/utils/compose-builder'
import { EnvBuilder } from '@/utils/env-builder'
import { writeFile } from 'fs/promises'
import prompts from 'prompts'

export async function addAction() {
  const projectPath = '.'
  await assertSymfonyProjectPath(projectPath)

  const composeFilename = `${projectPath}/compose.local.yml`
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

  const addonServices = AVAILABLE_SYMFONY_SERVICES.filter(service => {
    return service.removable && !composeBuilder.hasService(service.composeKey)
  }).map(service => ({
    title: service.name,
    value: service,
  }))

  if (addonServices.length === 0) {
    logger.i('No service to add')
    return
  }

  const serviceResult = await prompts(
    {
      message: 'Which service do you want to add in your project ?',
      type: 'autocomplete',
      name: 'services',
      choices: addonServices,
    },
    { onCancel: onCommandCancel },
  )

  const service = serviceResult.services

  if (!(service instanceof AbstractService)) {
    throw new Error('Invalid class')
  }

  logger.i(`Adding ${service.name} service to project`)
  service.addToCompose(composeBuilder)
  service.addToEnv(envBuilder)
  service.addToEnvLocal(envLocalBuilder)

  await writeFile(composeFilename, composeBuilder.toString())
  await writeFile(envFilename, envBuilder.toString())
  await writeFile(envLocalFilename, envLocalBuilder.toString())
  logger.success(`Service ${service.name} added successfully`)
}
