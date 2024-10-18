import { AbstractService } from '@/services/abstract-service'
import { ComposeBuilder } from '@/utils/compose-builder'
import { BlockRow } from '@/utils/env/block-row'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'
import { EnvBuilder } from '@/utils/env-builder'
import { PhpService } from '@/services/php-service'

export class PostgresqlService extends AbstractService {
  public static readonly CONSTANTS = {
    COMPOSE_KEY: "db",
    ENV_KEY: "doctrine/doctrine-bundle",
    DB_PORT: "DB_PORT",
    DATABASE_URL: "DATABASE_URL",
    ENV_PG_USER: "postgres_user",
    ENV_PG_PASSWORD: "postgres_password",
    ENV_PG_DB: "postgres_db",
  };

  constructor() {
    super(
      "PostgreSQL",
      true,
      PostgresqlService.CONSTANTS.COMPOSE_KEY,
      PostgresqlService.CONSTANTS.ENV_KEY,
    );
  }

  private static readonly COMPOSE_VOLUME_KEY: string = "postgres-data";

  addToCompose(builder: ComposeBuilder): void {
    builder.addService(this.composeKey, {
      image: "postgres:17.0-alpine3.20",
      ports: [`$\{${PostgresqlService.CONSTANTS.DB_PORT}:-5432}:5432`],
      environment: {
        POSTGRES_USER: PostgresqlService.CONSTANTS.ENV_PG_USER,
        POSTGRES_PASSWORD: PostgresqlService.CONSTANTS.ENV_PG_PASSWORD,
        POSTGRES_DB: PostgresqlService.CONSTANTS.ENV_PG_DB,
      },
      volumes: [
        `${PostgresqlService.COMPOSE_VOLUME_KEY}:/var/lib/postgresql/data`,
      ],
    });

    builder.addVolume(PostgresqlService.COMPOSE_VOLUME_KEY, {
      driver: "local",
    });

    builder.addDependsOn(PhpService.CONSTANTS.COMPOSE_KEY, this.composeKey);
  }

  removeToCompose(builder: ComposeBuilder) {
    builder.removeService(this.composeKey);
    builder.removeVolume(PostgresqlService.COMPOSE_VOLUME_KEY);
    builder.removeDependsOn(PhpService.CONSTANTS.COMPOSE_KEY, this.composeKey);
  }

  addToEnv() {
    // Nothing
  }

  removeToEnv() {
    // Nothing
  }

  addToEnvLocal(builder: EnvBuilder) {
    builder.addVariable(
      AbstractService.SYMFONY_DOCKER_ENV_KEY,
      PostgresqlService.CONSTANTS.DB_PORT,
      "",
    );
    builder.addBlock(
      new NamedBlockSection<BlockRow>(
        this.envKey,
        new Variable(
          PostgresqlService.CONSTANTS.DATABASE_URL,
          `"postgresql://${PostgresqlService.CONSTANTS.ENV_PG_USER}:${PostgresqlService.CONSTANTS.ENV_PG_PASSWORD}@db:5432/${PostgresqlService.CONSTANTS.ENV_PG_DB}?serverVersion=17&charset=utf8"`,
        ),
      ),
    );
  }

  removeToEnvLocal(builder: EnvBuilder) {
    builder.removeVariable(
      AbstractService.SYMFONY_DOCKER_ENV_KEY,
      PostgresqlService.CONSTANTS.DB_PORT,
    );
    builder.removeBlock(this.envKey);
  }
}
