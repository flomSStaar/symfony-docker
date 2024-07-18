import { ComposeBuilder } from '@/utils/compose-builder'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'
import { EnvBuilder } from '@/utils/env-builder'
import { AbstractService } from '@/services/abstract-service'

export class NodeService extends AbstractService {
  public static readonly CONSTANTS = {
    COMPOSE_KEY: 'node',
    ENV_KEY: 'docker/node',
    NODE_VERSION: 'NODE_VERSION',
  }

  constructor() {
    super('Node', true, NodeService.CONSTANTS.COMPOSE_KEY, NodeService.CONSTANTS.ENV_KEY)
  }

  addToCompose(builder: ComposeBuilder): void {
    builder.addService(this.composeKey, {
      image: `node:$\{${NodeService.CONSTANTS.NODE_VERSION}}-alpine`,
      command: 'sh -c "yarn install && yarn run watch"',
      working_dir: '/app',
      volumes: ['.:/app'],
    })
  }

  removeToCompose(builder: ComposeBuilder) {
    builder.removeService(this.composeKey)
  }

  addToEnv(builder: EnvBuilder) {
    builder.addBlock(new NamedBlockSection(this.envKey, new Variable(NodeService.CONSTANTS.NODE_VERSION, '20')))
  }

  removeToEnv(builder: EnvBuilder) {
    builder.removeBlock(this.envKey)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToEnvLocal(builder: EnvBuilder) {
    // Nothing
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeToEnvLocal(builder: EnvBuilder) {
    // Nothing
  }
}
