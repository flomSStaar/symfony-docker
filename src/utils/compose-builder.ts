import type { Node } from 'yaml'
import { Document, isMap, isScalar, isSeq, Pair, parseDocument, YAMLMap, YAMLSeq } from 'yaml'

export class ComposeBuilder {
  private readonly compose: Document<Node, true>

  private readonly version: string
  private readonly services: YAMLMap
  private readonly volumes: YAMLMap

  private static readonly CONSTANTS = {
    DEPENDS_ON: 'depends_on',
    ENVIRONMENT: 'environment',
  }

  constructor(document = new Document(), version: string = '3.9') {
    this.compose = document

    if (document.has('version')) {
      this.version = document.get('version') as string
    } else {
      this.version = version
    }
    if (document.has('volumes')) {
      this.volumes = document.get('volumes') as YAMLMap
    } else {
      this.volumes = this.compose.createNode({})
    }
    if (document.has('services')) {
      this.services = document.get('services') as YAMLMap
    } else {
      this.services = this.compose.createNode({})
    }
  }

  static from(text: string): ComposeBuilder {
    return new ComposeBuilder(parseDocument(text))
  }

  hasService(key: string): boolean {
    return !!this.services.get(key)
  }

  getService(key: string): YAMLMap | undefined {
    return this.services.get(key) as YAMLMap
  }

  addService(key: string, value: unknown): void {
    const pair = new Pair(key, this.compose.createNode(value))
    this.services.add(pair)
  }

  removeService(key: string): void {
    this.services.delete(key)
  }

  hasVolume(key: string): boolean {
    return !!this.volumes.get(key)
  }

  addVolume(key: string, value: unknown): void {
    const pair = new Pair(key, value)
    this.volumes.add(pair)
  }

  removeVolume(key: string): void {
    this.volumes.delete(key)
  }

  addDependsOn(serviceKey: string, value: string) {
    const service = this.getService(serviceKey)
    if (!service) return

    this.addInSequence(service, ComposeBuilder.CONSTANTS.DEPENDS_ON, value)
  }

  removeDependsOn(serviceKey: string, value: string) {
    const service = this.getService(serviceKey)
    if (!service) return

    this.removeInSequence(service, ComposeBuilder.CONSTANTS.DEPENDS_ON, value)
  }

  addEnvVariable(serviceKey: string, key: string, value: string): void {
    const service = this.getService(serviceKey)
    if (!service) return

    const envNode = service.get(ComposeBuilder.CONSTANTS.ENVIRONMENT)

    if (!envNode || isMap(envNode)) {
      this.addInMap(service, ComposeBuilder.CONSTANTS.ENVIRONMENT, new Pair(key, value))
    } else if (isSeq(envNode)) {
      this.addInSequence(service, ComposeBuilder.CONSTANTS.ENVIRONMENT, `${key}=${value}`)
    }
  }

  removeEnvVariable(serviceKey: string, key: string, value: string) {
    const service = this.getService(serviceKey)
    if (!service) return

    const envNode = service.get(ComposeBuilder.CONSTANTS.ENVIRONMENT)

    if (!envNode || isMap(envNode)) {
      this.removeInMap(service, ComposeBuilder.CONSTANTS.ENVIRONMENT, key)
    } else if (isSeq(envNode)) {
      this.removeInSequence(service, ComposeBuilder.CONSTANTS.ENVIRONMENT, `${key}=${value}`)
    }
  }

  private addInSequence(service: YAMLMap, nodeKey: string, value: string): void {
    const node = service.get(nodeKey)

    if (node) {
      if (isSeq(node) && !node.has(value)) {
        node.add(value)
      } else {
        // console.warn('cannot add the key to the sequence')
      }
    } else {
      // the key does not exist, so create a new sequence
      const newSequence = new YAMLSeq()
      // add the value
      newSequence.add(value)
      // add the pair in the service
      service.add(new Pair(nodeKey, newSequence))
    }
  }

  private removeInSequence(service: YAMLMap, nodeKey: string, value: string) {
    const node = service.get(nodeKey)
    if (!node) return

    if (node instanceof YAMLSeq) {
      // remove the key to the existing sequence
      const valueIndex = node.items.findIndex(v => isScalar(v) && v.value === value)
      if (valueIndex > -1) {
        node.delete(valueIndex)
      }
    } else {
      // console.warn('cannot remove the key in the sequence')
    }
  }

  private addInMap(service: YAMLMap, nodeKey: string, value: Pair): void {
    const node = service.get(nodeKey)

    if (node) {
      // the key exists
      if (node instanceof YAMLMap) {
        // add the key to the existing map
        node.add(value)
      } else {
        // cannot add the key to the map
        // console.warn('cannot add the key to the map')
      }
    } else {
      // the key does not exist, so create a new map
      const newMap = new YAMLMap()
      // add the value
      newMap.add(value)
      // add the pair in the service
      service.add(new Pair(nodeKey, newMap))
    }
  }

  private removeInMap(service: YAMLMap, nodeKey: string, value: string) {
    const node = service.get(nodeKey)
    if (!node) return

    if (node instanceof YAMLMap) {
      // add the key to the existing map
      node.delete(value)
    } else {
      // console.warn('cannot remove the key in the map')
    }
  }

  toString(): string {
    if (!this.compose.has('version')) {
      this.compose.set('version', this.version)
    }

    this.compose.set('volumes', this.volumes)
    this.compose.set('services', this.services)

    return this.compose.toString({
      collectionStyle: 'block',
      indent: 2,
    })
  }
}
