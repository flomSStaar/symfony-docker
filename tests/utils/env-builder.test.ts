import { EnvBuilder } from '@/utils/env-builder'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { Variable } from '@/utils/env/variable'
import { beforeEach, describe, expect, it } from 'bun:test'

describe('EnvBuilder', () => {
  let envBuilder: EnvBuilder

  beforeEach(() => {
    envBuilder = new EnvBuilder()
  })

  it('should create an instance of EnvBuilder', () => {
    expect(envBuilder).toBeInstanceOf(EnvBuilder)
  })

  it('should add a block', () => {
    const block = new NamedBlockSection('BLOCK')

    envBuilder.addBlock(block)

    expect(envBuilder.hasBlock('BLOCK')).toBe(true)
  })

  it('should remove a block', () => {
    const block = new NamedBlockSection('BLOCK')
    envBuilder.addBlock(block)

    envBuilder.removeBlock('BLOCK')

    expect(envBuilder.hasBlock('BLOCK')).toBe(false)
  })

  it('should add a variable to a block', () => {
    envBuilder.addVariable('BLOCK', 'KEY', 'value')

    const block = envBuilder.getBlock('BLOCK')

    expect(block).toBeDefined()
    expect(block!.get(new Variable('KEY', 'value'))).toBeDefined()
  })

  it('should remove a variable from a block', () => {
    envBuilder.addVariable('BLOCK', 'KEY', 'value')
    envBuilder.removeVariable('BLOCK', 'KEY')

    const block = envBuilder.getBlock('BLOCK')

    expect(block).toBeDefined()
    expect(block!.get(new Variable('KEY', ''))).toBeUndefined()
  })

  it('should return the correct string representation with one block', () => {
    envBuilder.addVariable('BLOCK', 'KEY', 'value')

    expect(envBuilder.toString()).toBe('###> BLOCK ###\nKEY=value\n###< BLOCK ###\n')
  })

  it('should return the correct string representation with multiple block', () => {
    envBuilder.addVariable('BLOCK', 'KEY', 'value')
    envBuilder.addVariable('BLOCK2', 'KEY2', 'value')

    expect(envBuilder.toString()).toBe(
      '###> BLOCK ###\nKEY=value\n###< BLOCK ###\n\n###> BLOCK2 ###\nKEY2=value\n###< BLOCK2 ###\n',
    )
  })

  it('should create an EnvBuilder from text', () => {
    const text = '###> BLOCK ###\nKEY=value\n###< BLOCK ###\n'
    const builder = EnvBuilder.from(text)

    expect(builder.toString()).toBe(text)
  })
})
