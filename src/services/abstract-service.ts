import { ComposeBuilder } from '@/utils/compose-builder'
import type { EnvBuilder } from '@/utils/env-builder'

export abstract class AbstractService {
  public static readonly SYMFONY_DOCKER_ENV_KEY = 'symfony/docker'

  public readonly name: string
  public readonly removable: boolean
  public readonly composeKey: string
  public readonly envKey: string

  protected constructor(name: string, removable: boolean, composeKey: string, envKey: string) {
    this.name = name
    this.removable = removable
    this.composeKey = composeKey
    this.envKey = envKey
  }

  abstract addToCompose(builder: ComposeBuilder): void

  abstract removeToCompose(builder: ComposeBuilder): void

  abstract addToEnv(builder: EnvBuilder): void

  abstract removeToEnv(builder: EnvBuilder): void

  abstract addToEnvLocal(builder: EnvBuilder): void

  abstract removeToEnvLocal(builder: EnvBuilder): void
}
