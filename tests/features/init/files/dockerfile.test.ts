import { expect, it } from 'bun:test'
import { getDockerfile } from '@/features/init/files/dockerfile'

it('should return the dockerfile content', () => {
  const dockerfileString = getDockerfile()

  expect(dockerfileString).toBe(
    'ARG PHP_VERSION=8.2\n\nFROM php:${PHP_VERSION}-alpine3.20\n\nARG PHP_EXTENSIONS=""\n\nRUN apk add --no-cache git bash\n\n# Add PHP extensions\nADD https://github.com/mlocati/docker-php-extension-installer/releases/download/2.5.2/install-php-extensions /usr/local/bin/\nRUN chmod +x /usr/local/bin/install-php-extensions && \\\n    install-php-extensions ${PHP_EXTENSIONS}\n\n# Composer\nRUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer --version 2.8.1\n\n# Symfony CLI\nRUN curl -sS https://get.symfony.com/cli/installer | bash  \\\n    && mv /root/.symfony5/bin/symfony /usr/local/bin/symfony\n\nCOPY --chmod=755 docker-entrypoint.sh /docker-entrypoint.sh\n\nCOPY php.ini /usr/local/etc/php/conf.d/\n\nWORKDIR /var/www/html\n\nENTRYPOINT [ "/docker-entrypoint.sh" ]\n\nCMD [ "symfony", "server:start", "--listen-ip=0.0.0.0" ]\n',
  )
})

it('should not be empty', () => {
  const dockerfileString = getDockerfile()

  expect(dockerfileString).not.toBe('')
})
