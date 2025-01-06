import { ComposeBuilder } from '@/utils/compose-builder'
import { EnvBuilder } from '@/utils/env-builder'
import { NodeService } from '@/services/node-service'
import { beforeEach, expect, it } from 'bun:test'

let composeBuilder: ComposeBuilder
let envBuilder: EnvBuilder
let envLocalBuilder: EnvBuilder
const nodeService = new NodeService()

beforeEach(() => {
  composeBuilder = new ComposeBuilder()
  envBuilder = new EnvBuilder()
  envLocalBuilder = new EnvBuilder()
})

it('should add node service to compose', () => {
  nodeService.addToCompose(composeBuilder)

  expect(composeBuilder.hasService(nodeService.composeKey)).toBeTrue()

  const composeOutput = composeBuilder.toString()

  expect(composeOutput).toContain(
    'node:\n    image: node:${NODE_VERSION}-alpine\n    command: sh -c "yarn install && yarn run watch"\n    working_dir: /app\n    volumes:\n      - .:/app\n',
  )
})

it('should remove node service from compose', () => {
  nodeService.addToCompose(composeBuilder)
  expect(composeBuilder.hasService(nodeService.composeKey)).toBeTrue()

  nodeService.removeToCompose(composeBuilder)

  expect(composeBuilder.hasService(nodeService.composeKey)).toBeFalse()

  const composeOutput = composeBuilder.toString()

  expect(composeOutput).not.toContain(
    'node:\n    image: node:${NODE_VERSION}-alpine\n    command: sh -c "yarn install && yarn run watch"\n    working_dir: /app\n    volumes:\n      - .:/app\n',
  )
})

it('should add node service to .env', () => {
  expect(envBuilder.hasBlock(nodeService.envKey)).toBeFalse()

  nodeService.addToEnv(envBuilder)

  expect(envBuilder.hasBlock(nodeService.envKey)).toBeTrue()

  const envOutput = envBuilder.toString()

  expect(envOutput).toContain('###> docker/node ###\nNODE_VERSION=20\n###< docker/node ###')
})

it('should remove node service from .env', () => {
  nodeService.addToEnv(envBuilder)
  expect(envBuilder.hasBlock(nodeService.envKey)).toBeTrue()

  nodeService.removeToEnv(envBuilder)

  expect(envBuilder.hasBlock(nodeService.envKey)).toBeFalse()

  const envOutput = envBuilder.toString()

  expect(envOutput).not.toContain('###> docker/node ###\nNODE_VERSION=20\n###< docker/node ###')
})

it('should do nothing while calling addToEnvLocal function', () => {
  nodeService.addToEnvLocal()

  expect(envLocalBuilder.toString()).toStrictEqual('')
})

it('should do nothing while calling removeToEnvLocal function', () => {
  nodeService.removeToEnvLocal()

  expect(envLocalBuilder.toString()).toStrictEqual('')
})
