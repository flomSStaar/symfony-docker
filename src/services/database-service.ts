import { AbstractService } from '@/services/abstract-service'
import { ComposeBuilder } from '@/utils/compose-builder'
import { BlockRow } from '@/utils/env/block-row'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'
import { EnvBuilder } from '@/utils/env-builder'
import { PhpService } from '@/services/php-service'

export class DatabaseService extends AbstractService {
  public static readonly CONSTANTS = {
    COMPOSE_KEY: 'db',
    ENV_KEY: 'doctrine/doctrine-bundle',
    DB_PORT: 'DB_PORT',
    DATABASE_URL: 'DATABASE_URL',
  }

  constructor() {
    super('MariaDB', true, DatabaseService.CONSTANTS.COMPOSE_KEY, DatabaseService.CONSTANTS.ENV_KEY)
  }

  private static COMPOSE_VOLUME_KEY: string = 'db-data'

  addToCompose(builder: ComposeBuilder): void {
    builder.addService(this.composeKey, {
      image: 'mariadb:11.2',
      ports: [`$\{${DatabaseService.CONSTANTS.DB_PORT}:-3306}:3306`],
      environment: {
        MARIADB_ROOT_PASSWORD: 'root',
        MARIADB_DATABASE: 'db',
        TZ: 'Europe/Paris',
      },
      volumes: [`${DatabaseService.COMPOSE_VOLUME_KEY}:/var/lib/mysql`],
    })

    builder.addVolume(DatabaseService.COMPOSE_VOLUME_KEY, {
      driver: 'local',
    })

    builder.addDependsOn(PhpService.CONSTANTS.COMPOSE_KEY, this.composeKey)
  }

  removeToCompose(builder: ComposeBuilder) {
    builder.removeService(this.composeKey)
    builder.removeVolume(DatabaseService.COMPOSE_VOLUME_KEY)
    builder.removeDependsOn(PhpService.CONSTANTS.COMPOSE_KEY, this.composeKey)
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
    builder.addVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, DatabaseService.CONSTANTS.DB_PORT, '')
    builder.addBlock(
      new NamedBlockSection<BlockRow>(
        this.envKey,
        new Variable(
          DatabaseService.CONSTANTS.DATABASE_URL,
          '"mysql://root:root@db:3306/db?serverVersion=11.2&charset=utf8mb4"',
        ),
      ),
    )
  }

  removeToEnvLocal(builder: EnvBuilder) {
    builder.removeVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, DatabaseService.CONSTANTS.DB_PORT)
    builder.removeBlock(this.envKey)
  }
}
