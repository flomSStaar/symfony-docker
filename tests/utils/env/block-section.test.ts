import { expect, it } from 'bun:test'
import { TestBlockRow } from './test-block-row'
import { TestBlockSection } from './test-block-section'

it('should create a BlockSection with the correct key and items', () => {
  const key = 'section'
  const row1 = new TestBlockRow('item1')
  const row2 = new TestBlockRow('item2')

  const section = new TestBlockSection(key, row1, row2)

  expect(section.key).toBe(key)
  expect(section.has(row1)).toBe(true)
  expect(section.has(row2)).toBe(true)
})

it('should add items to the BlockSection', () => {
  const key = 'section'
  const section = new TestBlockSection(key)
  const row = new TestBlockRow('item1')

  section.add(row)

  expect(section.has(row)).toBe(true)
})

it('should remove items from the BlockSection', () => {
  const key = 'section'
  const row = new TestBlockRow('item1')
  const section = new TestBlockSection(key, row)

  section.remove(row)

  expect(section.has(row)).toBe(false)
})

it('should return the correct item using get method', () => {
  const key = 'section'
  const row = new TestBlockRow('item1')
  const section = new TestBlockSection(key, row)

  const foundItem = section.get(row)

  expect(foundItem).toBeDefined()
  expect(foundItem?.toString()).toBe(row.toString())
})

it('should return undefined for non-existing item using get method', () => {
  const key = 'section'
  const row = new TestBlockRow('item1')
  const section = new TestBlockSection(key)

  const foundItem = section.get(row)

  expect(foundItem).toBeUndefined()
})

it('should return the correct string representation from toString', () => {
  const key = 'section'
  const row1 = new TestBlockRow('item1')
  const row2 = new TestBlockRow('item2')

  const section = new TestBlockSection(key, row1, row2)

  expect(section.toString()).toBe('item1\nitem2')
})
