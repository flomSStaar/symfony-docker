import { expect, it } from 'bun:test'
import { getDockerEntrypoint } from '@/features/init/files/entrypoint'

it('should return the entrypoint content', () => {
  const entrypoint = getDockerEntrypoint()

  expect(entrypoint).toBe('#!/bin/sh\n\nset -e\n\ncomposer install --no-interaction\n\nexec "$@"\n')
})

it('should not be empty', () => {
  const entrypoint = getDockerEntrypoint()

  expect(entrypoint).not.toBe('')
})
