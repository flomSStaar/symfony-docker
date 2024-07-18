import { readdir } from 'fs/promises'

type CheckSymfonyDirectoryReturn = 'dir_not_exists' | 'not_symfony_project' | 'ok'

async function checkSymfonyDirectory(value: string): Promise<CheckSymfonyDirectoryReturn> {
  try {
    // Check if the path exists
    const directory = await readdir(value)
    // Check if it is a Symfony project
    if (!directory.some(file => ['composer.json', 'symfony.lock'].includes(file))) {
      return 'not_symfony_project'
    }
    return 'ok'
  } catch (e) {
    // If readdir failed, the path does not exist
    return 'dir_not_exists'
  }
}

export async function assertSymfonyProjectPath(path: string) {
  const checkSymfonyResult = await checkSymfonyDirectory(path)
  switch (checkSymfonyResult) {
    case 'dir_not_exists':
      throw new Error('The current directory does not exists')
    case 'not_symfony_project':
      throw new Error('The current directory is not a Symfony project')
    default:
  }
}
