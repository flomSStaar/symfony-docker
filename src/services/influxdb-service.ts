import { AbstractService } from '@/services/abstract-service'
import { ComposeBuilder } from '@/utils/compose-builder'
import { BlockRow } from '@/utils/env/block-row'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'
import { EnvBuilder } from '@/utils/env-builder'

export class InfluxdbService extends AbstractService {
  public static readonly CONSTANTS = {
    COMPOSE_KEY: 'influxdb',
    ENV_KEY: 'influxdb',
    COMPOSE_VOLUME_DATA_KEY: 'influxdb-data',
    COMPOSE_VOLUME_CONFIG_KEY: 'influxdb-config',
    INFLUXDB_PORT: 'INFLUXDB_PORT',
    INFLUXDB_URL: 'INFLUXDB_URL',
    INFLUXDB_USER_TOKEN: 'INFLUXDB_USER_TOKEN',
    INFLUXDB_ORGANIZATION: 'INFLUXDB_ORGANIZATION',
    INFLUXDB_BUCKET_NAME: 'INFLUXDB_BUCKET_NAME',
  }

  constructor() {
    super('InfluxDB', true, InfluxdbService.CONSTANTS.COMPOSE_KEY, InfluxdbService.CONSTANTS.ENV_KEY)
  }

  addToCompose(builder: ComposeBuilder) {
    builder.addService(this.composeKey, {
      image: 'influxdb:2.7-alpine',
      ports: [`$\{${InfluxdbService.CONSTANTS.INFLUXDB_PORT}:-8086}:8086`],
      volumes: [
        `${InfluxdbService.CONSTANTS.COMPOSE_VOLUME_DATA_KEY}:/var/lib/influxdb2`,
        `${InfluxdbService.CONSTANTS.COMPOSE_VOLUME_CONFIG_KEY}:/etc/influxdb2`,
      ],
    })

    builder.addVolume(InfluxdbService.CONSTANTS.COMPOSE_VOLUME_DATA_KEY, {
      driver: 'local',
    })
    builder.addVolume(InfluxdbService.CONSTANTS.COMPOSE_VOLUME_CONFIG_KEY, {
      driver: 'local',
    })
  }

  removeToCompose(builder: ComposeBuilder) {
    builder.removeService(this.composeKey)
    builder.removeVolume(InfluxdbService.CONSTANTS.COMPOSE_VOLUME_DATA_KEY)
    builder.removeVolume(InfluxdbService.CONSTANTS.COMPOSE_VOLUME_CONFIG_KEY)
  }

  addToEnv(builder: EnvBuilder) {
    builder.addBlock(
      new NamedBlockSection<BlockRow>(
        this.envKey,
        new Variable(InfluxdbService.CONSTANTS.INFLUXDB_URL, ''),
        new Variable(InfluxdbService.CONSTANTS.INFLUXDB_USER_TOKEN, ''),
        new Variable(InfluxdbService.CONSTANTS.INFLUXDB_ORGANIZATION, ''),
        new Variable(InfluxdbService.CONSTANTS.INFLUXDB_BUCKET_NAME, ''),
      ),
    )
  }

  removeToEnv(builder: EnvBuilder) {
    builder.removeBlock(this.envKey)
  }

  addToEnvLocal(builder: EnvBuilder) {
    builder.addVariable(
      AbstractService.SYMFONY_DOCKER_ENV_KEY,
      InfluxdbService.CONSTANTS.INFLUXDB_PORT,
      '',
    )
    builder.addBlock(
      new NamedBlockSection<BlockRow>(
        this.envKey,
        new Variable(InfluxdbService.CONSTANTS.INFLUXDB_URL, 'http://influxdb:8086'),
        new Variable(InfluxdbService.CONSTANTS.INFLUXDB_USER_TOKEN, ''),
        new Variable(InfluxdbService.CONSTANTS.INFLUXDB_ORGANIZATION, ''),
        new Variable(InfluxdbService.CONSTANTS.INFLUXDB_BUCKET_NAME, ''),
      ),
    )
  }

  removeToEnvLocal(builder: EnvBuilder) {
    builder.removeVariable(
      AbstractService.SYMFONY_DOCKER_ENV_KEY,
      InfluxdbService.CONSTANTS.INFLUXDB_PORT,
    )
    builder.removeBlock(this.envKey)
  }
}
