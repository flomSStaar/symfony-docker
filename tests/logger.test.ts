import { logger } from '@/utils/logger'
import { describe, expect, it, spyOn } from 'bun:test'

describe('Logger', () => {
  it('should have the methods i, success, e', () => {
    expect(logger.i).toBeDefined()
    expect(logger.success).toBeDefined()
    expect(logger.e).toBeDefined()
  })

  it('should log info message', () => {
    const spy = spyOn(console, 'log')
    const loggerSpy = spyOn(logger, 'i')


    logger.i('info message')

    expect(loggerSpy).toHaveBeenCalledTimes(1)
    expect(loggerSpy).toHaveBeenCalledWith('info message')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith("\u001b[1m\u001b[37minfo message\u001b[39m\u001b[22m")

    spy.mockRestore()
  })

  it('should log info message with bold false', () => {
    const spy = spyOn(console, 'log')

    logger.i('info message', false)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith("\u001b[37minfo message\u001b[39m")

    spy.mockRestore()
  })

  it('should log success message', () => {
    const spy = spyOn(console, 'log')
    const loggerSpy = spyOn(logger, 'success')

    logger.success('success message')

    expect(loggerSpy).toHaveBeenCalledTimes(1)
    expect(loggerSpy).toHaveBeenCalledWith('success message')

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith("\u001b[1m\u001b[32msuccess message\u001b[39m\u001b[22m")

    spy.mockRestore()
  })

  it('should log success message with bold false', () => {
    const spy = spyOn(console, 'log')

    logger.success('success message', false)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith("\u001b[32msuccess message\u001b[39m")

    spy.mockRestore()
  })

  it('should log error message', () => {
    const spy = spyOn(console, 'log')
    const loggerSpy = spyOn(logger, 'e')

    logger.e('error message')

    expect(loggerSpy).toHaveBeenCalledTimes(1)
    expect(loggerSpy).toHaveBeenCalledWith('error message')

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith("\u001b[1m\u001b[31merror message\u001b[39m\u001b[22m")

    spy.mockRestore()
  })

  it('should log error message with bold false', () => {
    const spy = spyOn(console, 'log')

    logger.e('error message', false)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith("\u001b[31merror message\u001b[39m")

    spy.mockRestore()
  })
})