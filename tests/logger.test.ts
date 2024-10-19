import { logger } from '@/utils/logger'
import { afterEach, describe, expect, it, spyOn } from 'bun:test'

describe('Logger', () => {
  const consoleLogSpy = spyOn(console, 'log').mockImplementation(() => {})

  afterEach(() => {
    consoleLogSpy.mockReset()
  })

  it('should have the methods i, success, e', () => {
    expect(logger.i).toBeDefined()
    expect(logger.success).toBeDefined()
    expect(logger.e).toBeDefined()
  })

  it('should log info message', () => {
    const loggerSpy = spyOn(logger, 'i')


    logger.i('info message')

    expect(loggerSpy).toHaveBeenCalledTimes(1)
    expect(loggerSpy).toHaveBeenCalledWith('info message')

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith("\u001b[1m\u001b[37minfo message\u001b[39m\u001b[22m")
  })

  it('should log info message with bold false', () => {
    logger.i('info message', false)

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith("\u001b[37minfo message\u001b[39m")
  })

  it('should log success message', () => {
    const loggerSpy = spyOn(logger, 'success')

    logger.success('success message')

    expect(loggerSpy).toHaveBeenCalledTimes(1)
    expect(loggerSpy).toHaveBeenCalledWith('success message')

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith("\u001b[1m\u001b[32msuccess message\u001b[39m\u001b[22m")

  })

  it('should log success message with bold false', () => {
    logger.success('success message', false)

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith("\u001b[32msuccess message\u001b[39m")
  })

  it('should log error message', () => {
    const loggerSpy = spyOn(logger, 'e')

    logger.e('error message')

    expect(loggerSpy).toHaveBeenCalledTimes(1)
    expect(loggerSpy).toHaveBeenCalledWith('error message')

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith("\u001b[1m\u001b[31merror message\u001b[39m\u001b[22m")
  })

  it('should log error message with bold false', () => {
    logger.e('error message', false)

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith("\u001b[31merror message\u001b[39m")
  })
})