import { AbstractService } from '@/services/abstract-service'
import { ComposeBuilder } from '@/utils/compose-builder'
import { BlockRow } from '@/utils/env/block-row'
import { Comment } from '@/utils/env/comment'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'
import { EnvBuilder } from '@/utils/env-builder'

export class PhpService extends AbstractService {
  public static readonly CONSTANTS = {
    COMPOSE_KEY: 'php',
    ENV_KEY: 'docker/php',
    SYMFONY_ENV_KEY: 'symfony/framework-bundle',
    PHP_VERSION: 'PHP_VERSION',
    PHP_EXTENSIONS: 'PHP_EXTENSIONS',
    WEB_PORT: 'WEB_PORT',
    APP_ENV: 'APP_ENV',
    APP_DEBUG: 'APP_DEBUG',
  }

  constructor() {
    super('PHP (Symfony)', false, PhpService.CONSTANTS.COMPOSE_KEY, PhpService.CONSTANTS.ENV_KEY)
  }

  addToCompose(builder: ComposeBuilder): void {
    builder.addService(this.composeKey, {
      build: {
        context: 'docker/dev',
        dockerfile: 'Dockerfile',
        args: {
          [`${PhpService.CONSTANTS.PHP_VERSION}`]: `$\{${PhpService.CONSTANTS.PHP_VERSION}}`,
          [`${PhpService.CONSTANTS.PHP_EXTENSIONS}`]: `$\{${PhpService.CONSTANTS.PHP_EXTENSIONS}}`,
        },
      },
      volumes: ['.:/var/www'],
      ports: [`$\{${PhpService.CONSTANTS.WEB_PORT}:-8000}:80`],
    })
  }

  removeToCompose(builder: ComposeBuilder) {
    builder.removeService(this.composeKey)
  }

  addToEnv(builder: EnvBuilder) {
    builder.addBlock(
      new NamedBlockSection<BlockRow>(
        this.envKey,
        new Variable(PhpService.CONSTANTS.PHP_VERSION, '8.2'),
        new Comment('# https://github.com/mlocati/docker-php-extension-installer'),
        new Variable(PhpService.CONSTANTS.PHP_EXTENSIONS, '"xsl pdo pdo_mysql gd imagick zip intl"'),
      ),
    )
  }

  removeToEnv(builder: EnvBuilder) {
    builder.removeBlock(this.envKey)
  }

  addToEnvLocal(builder: EnvBuilder) {
    builder.addVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, PhpService.CONSTANTS.WEB_PORT, '')
    builder.addBlock(
      new NamedBlockSection(
        PhpService.CONSTANTS.SYMFONY_ENV_KEY,
        new Variable(PhpService.CONSTANTS.APP_ENV, 'dev'),
        new Variable(PhpService.CONSTANTS.APP_DEBUG, '1'),
      ),
    )
  }

  removeToEnvLocal(builder: EnvBuilder) {
    builder.removeVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, PhpService.CONSTANTS.WEB_PORT)
    builder.removeBlock(PhpService.CONSTANTS.SYMFONY_ENV_KEY)
  }
}
