import { expect, it } from 'bun:test'
import { Comment } from '@/utils/env/comment'
import { BlockRow } from '@/utils/env/block-row'

it('should create a Comment with the correct text', () => {
  const text = 'This is a comment'
  const comment = new Comment(text)

  expect(comment.text).toBe(text)
})

it('should return the correct text from toString', () => {
  const text = 'This is a comment'
  const comment = new Comment(text)

  expect(comment.toString()).toBe(text)
})

it('should equal another Comment with the same text', () => {
  const text = 'This is a comment'
  const comment1 = new Comment(text)
  const comment2 = new Comment(text)

  expect(comment1.equals(comment2)).toBe(true)
})

it('should not equal another Comment with different text', () => {
  const comment1 = new Comment('This is a comment')
  const comment2 = new Comment('This is another comment')

  expect(comment1.equals(comment2)).toBe(false)
})

it('should not equal a BlockRow of a different type', () => {
  const comment = new Comment('This is a comment')

  class BlockRowTest extends BlockRow {
    equals(): boolean {
      return false
    }

    toString(): string {
      return 'Not a comment'
    }
  }

  const blockRowTest = new BlockRowTest()

  expect(comment.equals(blockRowTest)).toBe(false)
})

it('should be instance of BlockRow', () => {
  const comment = new Comment('This is a comment')

  expect(comment).toBeInstanceOf(BlockRow)
})
