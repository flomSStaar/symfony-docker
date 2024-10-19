import { BlockRow } from '@/utils/env/block-row'
import { expect, it } from 'bun:test'
import { TestBlockRow } from './test-block-row'

it('should create a BlockRow with the correct text', () => {
  const text = 'Hello'
  const row = new TestBlockRow(text)

  expect(row.toString()).toBe(text)
})

it('should return true when comparing two equal BlockRows', () => {
  const row1 = new TestBlockRow('Hello')
  const row2 = new TestBlockRow('Hello')

  expect(row1.equals(row2)).toBe(true)
})

it('should return false when comparing two different BlockRows', () => {
  const row1 = new TestBlockRow('Hello')
  const row2 = new TestBlockRow('World')

  expect(row1.equals(row2)).toBe(false)
})

it('should return false when comparing a BlockRow with another object', () => {
  const row = new TestBlockRow('Hello')

  expect(row.equals({} as BlockRow)).toBe(false)
})

it('should return false when comparing a BlockRow with null', () => {
  const row = new TestBlockRow('Hello')

  expect(row.equals(null as unknown as BlockRow)).toBe(false)
})
