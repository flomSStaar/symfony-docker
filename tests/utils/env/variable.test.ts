import { expect, it } from 'bun:test'
import { Variable } from '@/utils/env/variable'
import { BlockRow } from '@/utils/env/block-row'

it('should create a Variable with the correct key and value', () => {
  const key = 'KEY'
  const value = 'value'

  const variable = new Variable(key, value)

  expect(variable.key).toBe(key)
  expect(variable.value).toBe(value)
})

it('should allow updating the value', () => {
  const key = 'KEY'
  const value = 'value'
  const newValue = 'newValue'
  const variable = new Variable(key, value)

  variable.value = newValue

  expect(variable.value).toBe(newValue)
})

it('should return the correct string representation from toString', () => {
  const key = 'KEY'
  const value = 'value'

  const variable = new Variable(key, value)

  expect(variable.toString()).toBe(`${key}=${value}`)
})

it('should equal another Variable with the same key', () => {
  const key = 'KEY'
  const value1 = 'value1'
  const value2 = 'value2'

  const variable1 = new Variable(key, value1)
  const variable2 = new Variable(key, value2)

  expect(variable1.equals(variable2)).toBe(true)
})

it('should not equal another Variable with a different key', () => {
  const variable1 = new Variable('KEY1', 'value1')
  const variable2 = new Variable('KEY2', 'value2')

  expect(variable1.equals(variable2)).toBe(false)
})

it('should equal even if the value is different', () => {
  const key = 'KEY'
  const variable1 = new Variable(key, 'value1')
  const variable2 = new Variable(key, 'value2')

  expect(variable1.equals(variable2)).toBe(true)
})

it('should not equal a BlockRow of a different type', () => {
  const variable = new Variable('KEY', 'value')

  class BlockRowTest extends BlockRow {
    equals(): boolean {
      return false
    }

    toString(): string {
      return 'Not a variable'
    }
  }

  const blockRowTest = new BlockRowTest()
  expect(variable.equals(blockRowTest)).toBe(false)
})

it('should be instance of BlockRow', () => {
  const variable = new Variable('KEY', 'value')

  expect(variable).toBeInstanceOf(BlockRow)
})
