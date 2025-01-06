import { expect, it } from 'bun:test'
import { getPhpIni } from '@/features/init/files/php'

it('should return the php.ini content', () => {
  const phpIni = getPhpIni()

  expect(phpIni).toBe('memory_limit=128M\nexpose_php = off\ndate.timezone=Europe/Paris\n')
})

it('should not be empty', () => {
  const phpIni = getPhpIni()

  expect(phpIni).not.toBe('')
})
