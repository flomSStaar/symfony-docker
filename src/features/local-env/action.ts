import { assertSymfonyProjectPath } from '@/features/functions'
import { AVAILABLE_SYMFONY_SERVICES } from 'services'
import { ComposeBuilder } from '@/utils/compose-builder'
import { EnvBuilder } from '@/utils/env-builder'

export async function localEnvAction() {
  const projectPath = '.'
  await assertSymfonyProjectPath(projectPath)

  const composeFile = Bun.file(`${projectPath}/compose.local.yml`)
  if (!(await composeFile.exists())) {
    throw new Error('The project is not initialized with Docker, try to run `sfd init` first.')
  }
  const composeBuilder = ComposeBuilder.from(await composeFile.text())

  const services = AVAILABLE_SYMFONY_SERVICES.filter(service => composeBuilder.hasService(service.composeKey))

  const envLocalFilename = `${projectPath}/.env.local`
  const envLocalBuilder = (await Bun.file(envLocalFilename).exists())
    ? EnvBuilder.from(await Bun.file(envLocalFilename).text())
    : new EnvBuilder()

  services.forEach(service => service.addToEnvLocal(envLocalBuilder))

  await Bun.write(envLocalFilename, envLocalBuilder.toString())
}
