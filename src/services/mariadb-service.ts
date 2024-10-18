import { AbstractService } from '@/services/abstract-service'
import { ComposeBuilder } from '@/utils/compose-builder'
import { BlockRow } from '@/utils/env/block-row'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'
import { EnvBuilder } from '@/utils/env-builder'
import { PhpService } from '@/services/php-service'

export class MariadbService extends AbstractService {
  public static readonly CONSTANTS = {
    COMPOSE_KEY: 'db',
    ENV_KEY: 'doctrine/doctrine-bundle',
    DB_PORT: 'DB_PORT',
    DATABASE_URL: 'DATABASE_URL',
    ENV_MARIADB_USER: 'root',
    ENV_MARIADB_PASSWORD: 'root',
    ENV_MARIADB_DB: 'db',
  }

  constructor() {
    super('MariaDB', true, MariadbService.CONSTANTS.COMPOSE_KEY, MariadbService.CONSTANTS.ENV_KEY)
  }

  private static readonly COMPOSE_VOLUME_KEY: string = 'mariadb-data'

  addToCompose(builder: ComposeBuilder): void {
    builder.addService(this.composeKey, {
      image: 'mariadb:11.5.2',
      ports: [`$\{${MariadbService.CONSTANTS.DB_PORT}:-3306}:3306`],
      environment: {
        MARIADB_ROOT_PASSWORD: MariadbService.CONSTANTS.ENV_MARIADB_PASSWORD,
        MARIADB_DATABASE: MariadbService.CONSTANTS.ENV_MARIADB_DB,
        TZ: 'Europe/Paris',
      },
      volumes: [`${MariadbService.COMPOSE_VOLUME_KEY}:/var/lib/mysql`],
    })

    builder.addVolume(MariadbService.COMPOSE_VOLUME_KEY, {
      driver: 'local',
    })

    builder.addDependsOn(PhpService.CONSTANTS.COMPOSE_KEY, this.composeKey)
  }

  removeToCompose(builder: ComposeBuilder) {
    builder.removeService(this.composeKey)
    builder.removeVolume(MariadbService.COMPOSE_VOLUME_KEY)
    builder.removeDependsOn(PhpService.CONSTANTS.COMPOSE_KEY, this.composeKey)
  }

  addToEnv() {
    // Nothing
  }

  removeToEnv() {
    // Nothing
  }

  addToEnvLocal(builder: EnvBuilder) {
    builder.addVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, MariadbService.CONSTANTS.DB_PORT, '')
    builder.addBlock(
      new NamedBlockSection<BlockRow>(
        this.envKey,
        new Variable(
          MariadbService.CONSTANTS.DATABASE_URL,
          `"mysql://${MariadbService.CONSTANTS.ENV_MARIADB_USER}:${MariadbService.CONSTANTS.ENV_MARIADB_PASSWORD}@db:3306/${MariadbService.CONSTANTS.ENV_MARIADB_DB}?serverVersion=11.5.2&charset=utf8mb4"`,
        ),
      ),
    )
  }

  removeToEnvLocal(builder: EnvBuilder) {
    builder.removeVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, MariadbService.CONSTANTS.DB_PORT)
    builder.removeBlock(this.envKey)
  }
}
