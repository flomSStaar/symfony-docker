import { describe, expect, it } from 'bun:test'
import { StringBuilder } from '@/utils/string-builder'

describe('StringBuilder', () => {

  describe('append', () => {
    it('should append a string to the builder', () => {
      const builder = new StringBuilder()

      builder.append('Hello')

      expect(builder.toString()).toBe('Hello')
    })

    it('should append multiple strings to the builder', () => {
      const builder = new StringBuilder()

      builder.append('Hello').append('World')

      expect(builder.toString()).toBe('HelloWorld')
    })
  })

  describe('appendLine', () => {
    it('should append a string and a new line to the builder', () => {
      const builder = new StringBuilder()

      builder.appendLine('Hello')

      expect(builder.toString()).toBe('Hello\n')
    })

    it('should append multiple strings and new lines to the builder', () => {
      const builder = new StringBuilder()

      builder.appendLine('Hello').appendLine('World')

      expect(builder.toString()).toBe('Hello\nWorld\n')
    })
  })

  describe('newLine', () => {
    it('should append a new line to the builder', () => {
      const builder = new StringBuilder()

      builder.newLine()

      expect(builder.toString()).toBe('\n')
    })

    it('should append multiple new lines to the builder', () => {
      const builder = new StringBuilder()

      builder.newLine().newLine().newLine()

      expect(builder.toString()).toBe('\n\n\n')
    })
  })

  describe('toString', () => {
    it('should return an empty string', () => {
      const builder = new StringBuilder()

      const result = builder.toString()

      expect(result).toBe('')
      expect(result).toHaveLength(0)
    })

    it('should return the built string', () => {
      // Arrange
      const builder = new StringBuilder()

      // Act
      builder.append('Hello').newLine().append('World')

      // Assert
      expect(builder.toString()).toBe('Hello\nWorld')
    })
  })

  it('should chain multiple methods', () => {
    const builder = new StringBuilder()

    builder.append('Hello').appendLine('World').newLine().append('!')

    expect(builder.toString()).toBe('HelloWorld\n\n!')
  })
})

