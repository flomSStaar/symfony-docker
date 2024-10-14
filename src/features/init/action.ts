import { FILES_TO_CREATE } from '@/features/init/files/create-files'
import { promptPhpVersion } from '@/features/init/prompts'
import { assertSymfonyProjectPath } from '@/features/functions'
import { PhpService } from '@/services/php-service'
import { logger } from '@/utils/logger'
import { ComposeBuilder } from '@/utils/compose-builder'
import { Variable } from '@/utils/env/variable'
import { EnvBuilder } from '@/utils/env-builder'
import { appendFile, chmod } from 'fs/promises'
import kleur from 'kleur'

export async function initAction() {
  const installPath = '.'
  await assertSymfonyProjectPath(installPath)

  const composeFilename = `${installPath}/compose.local.yml`
  if (await Bun.file(composeFilename).exists()) {
    throw new Error('This project is already configured with docker')
  }

  // .env
  const envFilename = `${installPath}/.env`
  const envBuilder = (await Bun.file(envFilename).exists())
    ? EnvBuilder.from(await Bun.file(envFilename).text())
    : new EnvBuilder()

  // .env.local
  const envLocalFilename = `${installPath}/.env.local`
  const envLocalBuilder = (await Bun.file(envLocalFilename).exists())
    ? EnvBuilder.from(await Bun.file(envLocalFilename).text())
    : new EnvBuilder()

  const composeBuilder = new ComposeBuilder()

  /* PHP Service */
  const phpService = new PhpService()
  phpService.addToCompose(composeBuilder)
  phpService.addToEnv(envBuilder)
  phpService.addToEnvLocal(envLocalBuilder)

  const phpVersionResponse = await promptPhpVersion()
  const phpVersion = phpVersionResponse.phpVersion as string

  const phpBlock = envBuilder.getBlock(PhpService.CONSTANTS.ENV_KEY)
  if (phpBlock) {
    // TODO NEED IMPROVE THIS CODE
    const phpVersionRow = phpBlock.get(new Variable(PhpService.CONSTANTS.PHP_VERSION, ''))
    if (phpVersionRow instanceof Variable) {
      phpVersionRow.value = phpVersion
    }
  }

  // TODO Move into configure service
  // TODO Ask for each module the input and show the output that they need
  // /* Database */
  // const databaseService = new DatabaseSymfonyService()
  // databaseService.addToCompose(composeBuilder)
  // databaseService.addToEnv(envBuilder)
  // databaseService.addToEnvLocal(envLocalBuilder)
  //
  // /* Node Service */
  // const nodeResponse = await promptNode()
  // const useNode = nodeResponse.useNode as boolean
  // const nodeVersion = nodeResponse.nodeVersion as number | undefined
  //
  // if(useNode) {
  //   const nodeService = new NodeSymfonyService()
  //   nodeService.addToCompose(composeBuilder)
  //   nodeService.addToEnv(envBuilder)
  //   nodeService.addToEnvLocal(envLocalBuilder)
  //
  //   const nodeBlock = envBuilder.getBlock(NodeSymfonyService.CONSTANTS.ENV_KEY)
  //   if (nodeBlock) {
  //     // TODO NEED IMPROVE THIS CODE
  //     const nodeVersionRow = nodeBlock.get(new Variable(NodeSymfonyService.CONSTANTS.NODE_VERSION, ''))
  //     if(nodeVersionRow instanceof Variable && nodeVersion) {
  //       nodeVersionRow.value = nodeVersion.toString()
  //     }
  //   }
  // }
  //
  // /* Mailhog Service */
  // const mailResponse = await promptMailhog()
  // const useMail = mailResponse.useMail as boolean
  //
  //
  // if(useMail) {
  //   const mailService = new MailhogSymfonyService()
  //   mailService.addToCompose(composeBuilder)
  //   mailService.addToEnv(envBuilder)
  //   mailService.addToEnvLocal(envLocalBuilder)
  // }

  // Create compose file
  await Bun.write(composeFilename, composeBuilder.toString())

  // Write variables to .env file
  await Bun.write(envFilename, envBuilder.toString())

  // Create .env.local
  if (await Bun.file(envLocalFilename).exists()) {
    await appendFile(envLocalFilename, envLocalBuilder.toString())
  } else {
    await Bun.write(envLocalFilename, envLocalBuilder.toString())
  }

  // Create files
  const promises = FILES_TO_CREATE.map(async ({ filename, action, mode }) => {
    await Bun.write(`${installPath}/${filename}`, action())
    if (mode) {
      await chmod(`${installPath}/${filename}`, mode)
    }
  })

  await Promise.all(promises)

  console.log()

  logger.i('Your Symfony project is configured to use docker !')

  console.log('\n')

  logger.i(`> You can display available commands by running: ${kleur.green('sf')}`)

  console.log()

  logger.i('> You can change the following variables in your .env.local to adapt your environment:')
  logger.i('- WEB_PORT', false)
  // TODO Show output for each module
  // logger.i('- DB_PORT', false)
  // if (useMail) {
  //   logger.i('- MAIL_PORT', false)
  // }

  // console.log()
  //
  // logger.i('> You can connect to your database with the following credentials')
  // logger.i('- Database host: 127.0.0.1', false)
  // logger.i('- Database port: 3306 (or the port defined in DB_PORT)', false)
  // logger.i('- Database name: db', false)
  // logger.i('- Database user: root', false)
  // logger.i('- Database password: root', false)

  console.log()

  // if (useMail) {
  //   logger.i('> You can connect to MailHog with the following url')
  //   logger.i('- Default port: http://localhost:1025', false)
  //   logger.i('- Or with a custom port: http://localhost:${MAIL_PORT}', false)
  //   console.log()
  // }
}
