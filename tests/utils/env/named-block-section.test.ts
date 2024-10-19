import { expect, it } from 'bun:test'
import { NamedBlockSection } from '@/utils/env/named-block-section'
import { TestBlockRow } from './test-block-row'

it('should create a named block section with the correct name', () => {
  const name = 'section'
  const section = new NamedBlockSection(name)

  expect(section.key).toBe(name)
})

it('should add one item to the named block section', () => {
  const section = new NamedBlockSection('section')
  const item = new TestBlockRow('Hello')

  section.add(item)

  expect(section.has(item)).toBe(true)
})

it('should add multiple items to the named block section', () => {
  const section = new NamedBlockSection('section')
  const item1 = new TestBlockRow('Hello')
  const item2 = new TestBlockRow('World')

  section.add(item1)
  section.add(item2)

  expect(section.has(item1)).toBe(true)
  expect(section.has(item2)).toBe(true)
})

it('should remove an item from the named block section', () => {
  const section = new NamedBlockSection('section')
  const item = new TestBlockRow('Hello')

  section.add(item)
  section.remove(item)

  expect(section.has(item)).toBe(false)
})

it('should remove multiple items from the named block section', () => {
  const section = new NamedBlockSection('section')
  const item1 = new TestBlockRow('Hello')
  const item2 = new TestBlockRow('World')

  section.add(item1)
  section.add(item2)
  section.remove(item1)
  section.remove(item2)

  expect(section.has(item1)).toBe(false)
  expect(section.has(item2)).toBe(false)
})

it('should return the correct item using get method', () => {
  const section = new NamedBlockSection('section')
  const item = new TestBlockRow('Hello')

  section.add(item)

  expect(section.get(item)).toBe(item)
})

it('should return undefined when getting an item that does not exist', () => {
  const section = new NamedBlockSection('section')
  const item = new TestBlockRow('Hello')

  expect(section.get(item)).not.toBeDefined()
})

it('should return true when checking if the named block section has an item', () => {
  const section = new NamedBlockSection('section')
  const item = new TestBlockRow('Hello')

  section.add(item)

  expect(section.has(item)).toBe(true)
})

it('should return false when checking if the named block section has an item', () => {
  const section = new NamedBlockSection('section')
  const item = new TestBlockRow('Hello')

  expect(section.has(item)).toBe(false)
})

it('should return the correct string representation of the named block section', () => {
  const section = new NamedBlockSection('section')
  const item1 = new TestBlockRow('Hello')
  const item2 = new TestBlockRow('World')

  section.add(item1)
  section.add(item2)

  expect(section.toString()).toBe('###> section ###\nHello\nWorld\n###< section ###')
})
