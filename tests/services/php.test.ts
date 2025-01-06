import { ComposeBuilder } from '@/utils/compose-builder'
import { EnvBuilder } from '@/utils/env-builder'
import { beforeEach, expect, it } from 'bun:test'
import { PhpService } from '@/services/php-service'
import { AbstractService } from '@/services/abstract-service'
import { Variable } from '@/utils/env/variable'

let composeBuilder: ComposeBuilder
let envBuilder: EnvBuilder
let envLocalBuilder: EnvBuilder
const phpService = new PhpService()

beforeEach(() => {
  composeBuilder = new ComposeBuilder()
  envBuilder = new EnvBuilder()
  envLocalBuilder = new EnvBuilder()
})

it('should add php service to compose', () => {
  phpService.addToCompose(composeBuilder)

  expect(composeBuilder.hasService(phpService.composeKey)).toBeTrue()

  const composeOutput = composeBuilder.toString()

  expect(composeOutput).toContain(
    'volumes:\n  {}\nservices:\n  php:\n    build:\n      context: docker/dev\n      dockerfile: Dockerfile\n      args:\n        PHP_VERSION: ${PHP_VERSION}\n        PHP_EXTENSIONS: ${PHP_EXTENSIONS}\n    volumes:\n      - .:/var/www/html\n    ports:\n      - ${WEB_PORT:-8000}:8000\n',
  )
})

it('should remove php service from compose', () => {
  phpService.addToCompose(composeBuilder)
  expect(composeBuilder.hasService(phpService.composeKey)).toBeTrue()

  phpService.removeToCompose(composeBuilder)

  expect(composeBuilder.hasService(phpService.composeKey)).toBeFalse()

  const composeOutput = composeBuilder.toString()

  expect(composeOutput).not.toContain('php:\n    image: axllent/php:${PHP_VERSION}-fpm\n    volumes:\n      - .:/app\n')
})

it('should add php service to .env', () => {
  expect(envBuilder.hasBlock(phpService.envKey)).toBeFalse()

  phpService.addToEnv(envBuilder)

  expect(envBuilder.hasBlock(phpService.envKey)).toBeTrue()

  const envOutput = envBuilder.toString()

  expect(envOutput).toContain(
    '###> docker/php ###\nPHP_VERSION=8.2\n# https://github.com/mlocati/docker-php-extension-installer\nPHP_EXTENSIONS="xsl pdo pdo_mysql gd imagick zip intl"\n###< docker/php ###\n',
  )
})

it('should remove php service from .env', () => {
  phpService.addToEnv(envBuilder)
  expect(envBuilder.hasBlock(phpService.envKey)).toBeTrue()

  phpService.removeToEnv(envBuilder)

  expect(envBuilder.hasBlock(phpService.envKey)).toBeFalse()
})

it('should add php variables to .env.local', () => {
  expect(envLocalBuilder.getBlock(AbstractService.SYMFONY_DOCKER_ENV_KEY)).toBeUndefined()
  expect(envLocalBuilder.hasBlock(PhpService.CONSTANTS.SYMFONY_ENV_KEY)).toBeFalse()

  phpService.addToEnvLocal(envLocalBuilder)

  // Test WEB_PORT variable
  const symfonyDockerEnvBlock = envLocalBuilder.getBlock(AbstractService.SYMFONY_DOCKER_ENV_KEY)
  expect(symfonyDockerEnvBlock).toBeDefined()
  const webPortVariable = new Variable(PhpService.CONSTANTS.WEB_PORT, '')
  expect(symfonyDockerEnvBlock?.has(webPortVariable)).toBeTrue()

  // Test APP_ENV and APP_DEBUG variables
  expect(envLocalBuilder.hasBlock(PhpService.CONSTANTS.SYMFONY_ENV_KEY)).toBeTrue()

  const envOutput = envLocalBuilder.toString()

  expect(envOutput).toContain(
    '###> symfony/framework-bundle ###\nAPP_ENV=dev\nAPP_DEBUG=1\n###< symfony/framework-bundle ###\n',
  )
})

it('should remove php service from .env.local', () => {
  phpService.addToEnvLocal(envLocalBuilder)
  expect(envLocalBuilder.hasBlock(PhpService.CONSTANTS.SYMFONY_ENV_KEY)).toBeTrue()
  expect(envLocalBuilder.getBlock(AbstractService.SYMFONY_DOCKER_ENV_KEY)).toBeDefined()

  phpService.removeToEnvLocal(envLocalBuilder)

  // Test APP_ENV and APP_DEBUG variables
  expect(envLocalBuilder.hasBlock(PhpService.CONSTANTS.SYMFONY_ENV_KEY)).toBeFalse()
  const symfonyDockerEnvBlock = envLocalBuilder.getBlock(AbstractService.SYMFONY_DOCKER_ENV_KEY)
  expect(symfonyDockerEnvBlock).toBeDefined()

  // Test WEB_PORT variable
  const webPortVariable = new Variable(PhpService.CONSTANTS.WEB_PORT, '')
  expect(symfonyDockerEnvBlock!.has(webPortVariable)).toBeFalse()
})
