import { AbstractService } from '@/services/abstract-service'
import { ComposeBuilder } from '@/utils/compose-builder'
import { BlockRow } from '@/utils/env/block-row'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'
import { EnvBuilder } from '@/utils/env-builder'

export class GotenbergService extends AbstractService {
  public static readonly CONSTANTS = {
    COMPOSE_KEY: 'pdf',
    ENV_KEY: 'gotenberg',
    GOTENBERG_URL: 'GOTENBERG_URL',
  }

  constructor() {
    super(
      'PDF (Gotenberg)',
      true,
      GotenbergService.CONSTANTS.COMPOSE_KEY,
      GotenbergService.CONSTANTS.ENV_KEY,
    )
  }

  addToCompose(builder: ComposeBuilder): void {
    builder.addService(this.composeKey, {
      image: 'gotenberg/gotenberg:8',
    })
  }

  removeToCompose(builder: ComposeBuilder): void {
    builder.removeService(this.composeKey)
  }

  addToEnv(builder: EnvBuilder): void {
    builder.addBlock(
      new NamedBlockSection<BlockRow>(this.envKey, new Variable(GotenbergService.CONSTANTS.GOTENBERG_URL, '')),
    )
  }

  removeToEnv(builder: EnvBuilder): void {
    builder.removeBlock(this.envKey)
  }

  addToEnvLocal(builder: EnvBuilder): void {
    builder.addBlock(
      new NamedBlockSection<BlockRow>(
        this.envKey,
        new Variable(GotenbergService.CONSTANTS.GOTENBERG_URL, 'http://gotenberg:3000'),
      ),
    )
  }

  removeToEnvLocal(builder: EnvBuilder): void {
    builder.removeBlock(this.envKey)
  }
}
