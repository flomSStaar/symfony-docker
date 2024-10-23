import { beforeEach, expect, it } from 'bun:test'
import { MailpitService } from '@/services/mailpit-service'
import { ComposeBuilder } from '@/utils/compose-builder'
import { EnvBuilder } from '@/utils/env-builder'
import { AbstractService } from '@/services/abstract-service'
import { Variable } from '@/utils/env/variable'
import { NamedBlockSection } from '@/utils/env/named-block-section'

let composeBuilder: ComposeBuilder
let envBuilder: EnvBuilder
let envLocalBuilder: EnvBuilder
const mailpitService = new MailpitService()

beforeEach(() => {
  composeBuilder = new ComposeBuilder()
  envBuilder = new EnvBuilder()
  envLocalBuilder = new EnvBuilder()
})

it('should add mailpit service to compose', () => {
  mailpitService.addToCompose(composeBuilder)

  expect(composeBuilder.hasService(mailpitService.composeKey)).toBeTrue()

  const composeOutput = composeBuilder.toString()

  // Expect volume has been added
  expect(composeOutput).toContain('mail-data:\n    driver: local\n')
  // Expect service has been added
  expect(composeOutput).toContain(
    'mail:\n    image: axllent/mailpit:v1.18.3\n    ports:\n      - ${MAIL_PORT:-8025}:8025\n',
  )
  // Expect all components has been added
  expect(composeBuilder.toString()).toStrictEqual(
    'volumes:\n  mail-data:\n    driver: local\nservices:\n  mail:\n    image: axllent/mailpit:v1.18.3\n    ports:\n      - ${MAIL_PORT:-8025}:8025\n    volumes:\n      - mail-data:/data\n    environment:\n      MP_SMTP_AUTH_ACCEPT_ANY: 1\n      MP_SMTP_AUTH_ALLOW_INSECURE: 1\n',
  )
})

it('should remove mailpit service from compose', () => {
  mailpitService.addToCompose(composeBuilder)
  expect(composeBuilder.hasService(mailpitService.composeKey)).toBeTrue()

  mailpitService.removeToCompose(composeBuilder)

  expect(composeBuilder.hasService(mailpitService.composeKey)).toBeFalse()

  const composeOutput = composeBuilder.toString()

  // Expect volume has been removed
  expect(composeOutput).not.toContain('mail-data:\n    driver: local\n')
  // Expect service has been removed
  expect(composeOutput).not.toContain(
    'mail:\n    image: axllent/mailpit:v1.18.3\n    ports:\n      - ${MAIL_PORT:-8025}:8025\n',
  )
  // Expect all components has been removed
  expect(composeBuilder.toString()).toStrictEqual('volumes:\n  {}\nservices:\n  {}\n')
})

it('should add mailpit service to .env', () => {
  expect(envBuilder.hasBlock(mailpitService.envKey)).toBeFalse()

  mailpitService.addToEnv()

  expect(envBuilder.hasBlock(mailpitService.envKey)).toBeFalse()
})

it('should remove mailpit service from .env', () => {
  expect(envBuilder.hasBlock(mailpitService.envKey)).toBeFalse()

  mailpitService.removeToEnv()

  expect(envBuilder.hasBlock(mailpitService.envKey)).toBeFalse()
})

it('should add mailpit variable block to .env.local', () => {
  expect(envLocalBuilder.hasBlock(mailpitService.envKey)).toBeFalse()

  mailpitService.addToEnvLocal(envLocalBuilder)

  expect(envLocalBuilder.hasBlock(mailpitService.envKey)).toBeTrue()

  const envLocalOutput = envLocalBuilder.toString()

  expect(envLocalOutput).toContain('###> symfony/mailer ###\nMAILER_DSN=smtp://mail:1025\n###< symfony/mailer ###')
})

it(`should add ${MailpitService.CONSTANTS.MAIL_PORT} variable to .env.local`, () => {
  let symfonyDockerEnvBlock = envLocalBuilder.getBlock(AbstractService.SYMFONY_DOCKER_ENV_KEY)

  expect(symfonyDockerEnvBlock).toBeUndefined()

  mailpitService.addToEnvLocal(envLocalBuilder)

  symfonyDockerEnvBlock = envLocalBuilder.getBlock(AbstractService.SYMFONY_DOCKER_ENV_KEY)

  expect(symfonyDockerEnvBlock).toBeDefined()

  expect(symfonyDockerEnvBlock!.has(new Variable(MailpitService.CONSTANTS.MAIL_PORT, ''))).toBeTrue()

  const envLocalOutput = envLocalBuilder.toString()

  expect(envLocalOutput).toContain('MAIL_PORT=')
})

it(`should append ${MailpitService.CONSTANTS.MAIL_PORT} variable to .env.local`, () => {
  envLocalBuilder.addBlock(new NamedBlockSection(AbstractService.SYMFONY_DOCKER_ENV_KEY))

  mailpitService.addToEnvLocal(envLocalBuilder)

  const block = envLocalBuilder.getBlock(AbstractService.SYMFONY_DOCKER_ENV_KEY)

  expect(block).toBeDefined()

  expect(block!.has(new Variable(MailpitService.CONSTANTS.MAIL_PORT, ''))).toBeTrue()

  const envLocalOutput = envLocalBuilder.toString()

  expect(envLocalOutput).toContain('MAIL_PORT=')
})

it(`should remove ${MailpitService.CONSTANTS.MAIL_PORT} variable to .env.local`, () => {
  envLocalBuilder.addBlock(new NamedBlockSection(AbstractService.SYMFONY_DOCKER_ENV_KEY))
  envLocalBuilder.addVariable(AbstractService.SYMFONY_DOCKER_ENV_KEY, MailpitService.CONSTANTS.MAIL_PORT, '')

  mailpitService.removeToEnvLocal(envLocalBuilder)

  const block = envLocalBuilder.getBlock(AbstractService.SYMFONY_DOCKER_ENV_KEY)

  expect(block).toBeDefined()

  expect(block!.has(new Variable(MailpitService.CONSTANTS.MAIL_PORT, ''))).toBeFalse()

  const envLocalOutput = envLocalBuilder.toString()

  expect(envLocalOutput).not.toContain('MAIL_PORT=')
})
