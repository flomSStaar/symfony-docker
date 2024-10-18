import { AbstractService } from '@/services/abstract-service'
import { ComposeBuilder } from '@/utils/compose-builder'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'
import { EnvBuilder } from '@/utils/env-builder'

export class MailhogService extends AbstractService {
  public static readonly CONSTANTS = {
    COMPOSE_KEY: 'mail',
    ENV_KEY: 'symfony/mailer',
    MAIL_PORT: 'MAIL_PORT',
    MAILER_DSN: 'MAILER_DSN',
  }

  constructor() {
    super('[DEPRECATED] - MailHog', true, MailhogService.CONSTANTS.COMPOSE_KEY, MailhogService.CONSTANTS.ENV_KEY)
  }

  addToCompose(builder: ComposeBuilder): void {
    builder.addService(this.composeKey, {
      image: 'mailhog/mailhog:latest',
      ports: [`$\{${MailhogService.CONSTANTS.MAIL_PORT}:-8025}:8025`],
    })
  }

  removeToCompose(builder: ComposeBuilder) {
    builder.removeService(this.composeKey)
  }

  addToEnv() {
    // Nothing
  }

  removeToEnv() {
    // Nothing
  }

  addToEnvLocal(builder: EnvBuilder) {
    builder.addVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, MailhogService.CONSTANTS.MAIL_PORT, '')
    builder.addBlock(
      new NamedBlockSection(this.envKey, new Variable(MailhogService.CONSTANTS.MAILER_DSN, 'smtp://mail:1025')),
    )
  }

  removeToEnvLocal(builder: EnvBuilder) {
    builder.removeBlock(this.envKey)
    builder.removeVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, MailhogService.CONSTANTS.MAIL_PORT)
  }
}
