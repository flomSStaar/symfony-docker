import { expect, it } from 'bun:test'
import { CommentBlockSection } from '@/utils/env/comment-block-section'
import { Comment } from '@/utils/env/comment'

it('should create a CommentBlockSection with the correct items', () => {
  const comment1 = new CommentBlockSection()
  const comment2 = new CommentBlockSection()
  expect(comment1.key).not.toBe(comment2.key)
})

it('should add items to the CommentBlockSection', () => {
  const comment = new Comment('Hello')
  const commentBlockSection = new CommentBlockSection()
  commentBlockSection.add(comment)
  expect(commentBlockSection.has(comment)).toBe(true)
})

it('should remove items from the CommentBlockSection', () => {
  const comment = new Comment('Hello')
  const commentBlockSection = new CommentBlockSection(comment)
  commentBlockSection.remove(comment)
  expect(commentBlockSection.has(comment)).toBe(false)
})

it('should return the correct item using get method', () => {
  const comment = new Comment('Hello')
  const commentBlockSection = new CommentBlockSection(comment)
  expect(commentBlockSection.get(comment)).toBe(comment)
})

it('should return undefined when getting an item that does not exist', () => {
  const comment = new Comment('Hello')
  const commentBlockSection = new CommentBlockSection()
  expect(commentBlockSection.get(comment)).not.toBeDefined()
})

it('should return true when checking if the CommentBlockSection has an item', () => {
  const comment = new Comment('Hello')
  const commentBlockSection = new CommentBlockSection(comment)
  expect(commentBlockSection.has(comment)).toBe(true)
})

it('should return false when checking if the CommentBlockSection has an item', () => {
  const comment = new Comment('Hello')
  const commentBlockSection = new CommentBlockSection()
  expect(commentBlockSection.has(comment)).toBe(false)
})

it('should return the correct string representation of the CommentBlockSection', () => {
  const comment1 = new Comment('Hello')
  const comment2 = new Comment('World')
  const commentBlockSection = new CommentBlockSection(comment1, comment2)
  expect(commentBlockSection.toString()).toBe('Hello\nWorld')
})
