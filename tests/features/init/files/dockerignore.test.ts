import { expect, it } from 'bun:test'
import { getDockerIgnore } from '@/features/init/files/docker-ignore'

it('should return the dockerignore content', () => {
  const dockerIgnoreString = getDockerIgnore()

  expect(dockerIgnoreString).toBe(
    'assets/vendor\ncompose.?*.yml\nDockerfile\n.dockerignore\n.git\nnode_modules\nvar\nvendor\n.env.*\npublic/build\npublic/bundles\nsf\nREADME.md\n.idea\n.vscode\n.php-cs-fixer.dist.php\nphpstan.dist.neon\n',
  )
})

it('should not be empty', () => {
  const dockerIgnoreString = getDockerIgnore()

  expect(dockerIgnoreString).not.toBe('')
})
