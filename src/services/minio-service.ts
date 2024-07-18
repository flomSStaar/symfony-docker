import { AbstractService } from '@/services/abstract-service'
import { ComposeBuilder } from '@/utils/compose-builder'
import { BlockRow } from '@/utils/env/block-row'
import { Comment } from '@/utils/env/comment'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'
import { EnvBuilder } from '@/utils/env-builder'

export class MinioService extends AbstractService {
  public static readonly CONSTANTS = {
    COMPOSE_KEY: 'minio',
    ENV_KEY: 'storage/s3',
    COMPOSE_VOLUME_KEY: 'minio-data',
    CONSOLE_PORT: 'MINIO_CONSOLE_PORT',
    API_PORT: 'MINIO_API_PORT',
    S3_REGION: 'S3_REGION',
    S3_BUCKET_NAME: 'S3_BUCKET_NAME',
    S3_KEY_ID: 'S3_KEY_ID',
    S3_SECRET_KEY: 'S3_SECRET_KEY',
    S3_ENDPOINT_URL: 'S3_ENDPOINT_URL',
    S3_USE_PATH_STYLE_ENDPOINT: 'S3_USE_PATH_STYLE_ENDPOINT',
  }

  constructor() {
    super('Minio (S3)', true, MinioService.CONSTANTS.COMPOSE_KEY, MinioService.CONSTANTS.ENV_KEY)
  }

  addToCompose(builder: ComposeBuilder): void {
    builder.addService(this.composeKey, {
      image: 'minio/minio:RELEASE.2024-03-30T09-41-56Z',
      ports: [
        `$\{${MinioService.CONSTANTS.CONSOLE_PORT}:-8900}:8900`,
        `$\{${MinioService.CONSTANTS.API_PORT}:-9000}:9000`,
      ],
      environment: {
        MINIO_ROOT_USER: 'admin',
        MINIO_ROOT_PASSWORD: 'password',
        TZ: 'Europe/Paris',
      },
      volumes: [`${MinioService.CONSTANTS.COMPOSE_VOLUME_KEY}:/data`],
      command: 'minio server /data --console-address ":8900"',
    })

    builder.addVolume(MinioService.CONSTANTS.COMPOSE_VOLUME_KEY, {
      driver: 'local',
    })
  }

  removeToCompose(builder: ComposeBuilder): void {
    builder.removeService(this.composeKey)
    builder.removeVolume(MinioService.CONSTANTS.COMPOSE_VOLUME_KEY)
  }

  addToEnv(builder: EnvBuilder): void {
    builder.addBlock(
      new NamedBlockSection<BlockRow>(
        this.envKey,
        new Variable(MinioService.CONSTANTS.S3_REGION, ''),
        new Variable(MinioService.CONSTANTS.S3_BUCKET_NAME, ''),
        new Variable(MinioService.CONSTANTS.S3_KEY_ID, ''),
        new Variable(MinioService.CONSTANTS.S3_SECRET_KEY, ''),
        new Comment(
          '# In production with AWS S3, you must comment out the two lines below to automatically use the AWS S3 endpoint',
        ),
        new Variable(MinioService.CONSTANTS.S3_ENDPOINT_URL, ''),
        new Variable(MinioService.CONSTANTS.S3_USE_PATH_STYLE_ENDPOINT, ''),
      ),
    )
  }

  removeToEnv(builder: EnvBuilder): void {
    builder.removeBlock(this.envKey)
  }

  addToEnvLocal(builder: EnvBuilder): void {
    builder.addVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, MinioService.CONSTANTS.CONSOLE_PORT, '')
    builder.addVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, MinioService.CONSTANTS.API_PORT, '')
    builder.addBlock(
      new NamedBlockSection<BlockRow>(
        this.envKey,
        new Variable(MinioService.CONSTANTS.S3_REGION, 'eu-west-3'),
        new Variable(MinioService.CONSTANTS.S3_BUCKET_NAME, ''),
        new Variable(MinioService.CONSTANTS.S3_KEY_ID, 'admin'),
        new Variable(MinioService.CONSTANTS.S3_SECRET_KEY, 'password'),
        new Comment(
          '# In production with AWS S3, you must comment out the two lines below to automatically use the AWS S3 endpoint',
        ),
        new Variable(MinioService.CONSTANTS.S3_ENDPOINT_URL, 'http://minio:9000'),
        new Variable(MinioService.CONSTANTS.S3_USE_PATH_STYLE_ENDPOINT, 'true'),
      ),
    )
  }

  removeToEnvLocal(builder: EnvBuilder): void {
    builder.removeVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, MinioService.CONSTANTS.CONSOLE_PORT)
    builder.removeVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, MinioService.CONSTANTS.API_PORT)
    builder.removeBlock(this.envKey)
  }
}
