import { describe, expect, it } from 'bun:test'
import { CancelledError, onCommandCancel } from '@/utils/commons'

describe('commons', () => {
  describe('CancelledError', () => {
    it('should create a CancelledError', () => {
      const error = new CancelledError('test')
      expect(error).toBeInstanceOf(Error)
      expect(error.name).toBe('CancelledError')
      expect(error.message).toBe('test')
    })

    it('should throw a CancelledError', () => {
      expect(() => { throw new CancelledError('test') }).toThrow(CancelledError)
    })
  })

  describe('onCommandCancel', () => {
    it('should throw a CancelledError', () => {
      expect(() => onCommandCancel()).toThrow(CancelledError)
    })

    it('should throw a CancelledError with message "cancelled"', () => {
      expect(() => onCommandCancel()).toThrow('cancelled')
    })
  })
})