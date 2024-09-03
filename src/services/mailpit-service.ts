import { AbstractService } from '@/services/abstract-service'
import { ComposeBuilder } from '@/utils/compose-builder'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'
import { EnvBuilder } from '@/utils/env-builder'

export class MailpitService extends AbstractService {
  public static readonly CONSTANTS = {
    COMPOSE_KEY: 'mail',
    ENV_KEY: 'symfony/mailer',
    MAIL_PORT: 'MAIL_PORT',
    MAILER_DSN: 'MAILER_DSN',
  }

  private static COMPOSE_VOLUME_KEY: string = 'mail-data'

  constructor() {
    super('Mailpit', true, MailpitService.CONSTANTS.COMPOSE_KEY, MailpitService.CONSTANTS.ENV_KEY)
  }

  addToCompose(builder: ComposeBuilder): void {
    builder.addVolume(MailpitService.COMPOSE_VOLUME_KEY, {
      driver: 'local',
    })
    builder.addService(this.composeKey, {
      image: 'axllent/mailpit:v1.18.3',
      ports: [`$\{${MailpitService.CONSTANTS.MAIL_PORT}:-8025}:8025`],
      volumes: [`${MailpitService.COMPOSE_VOLUME_KEY}:/data`],
    })
  }

  removeToCompose(builder: ComposeBuilder) {
    builder.removeVolume(MailpitService.COMPOSE_VOLUME_KEY)
    builder.removeService(this.composeKey)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToEnv(builder: EnvBuilder) {
    // Nothing
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeToEnv(builder: EnvBuilder) {
    // Nothing
  }

  addToEnvLocal(builder: EnvBuilder) {
    builder.addVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, MailpitService.CONSTANTS.MAIL_PORT, '')
    builder.addBlock(
      new NamedBlockSection(this.envKey, new Variable(MailpitService.CONSTANTS.MAILER_DSN, 'smtp://mail:1025')),
    )
  }

  removeToEnvLocal(builder: EnvBuilder) {
    builder.removeBlock(this.envKey)
    builder.removeVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, MailpitService.CONSTANTS.MAIL_PORT)
  }
}
