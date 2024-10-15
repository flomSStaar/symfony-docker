import { StringBuilder } from '@/utils/string-builder'

export function getDockerfile() {
  const builder = new StringBuilder()

  builder
    .appendLine('ARG PHP_VERSION=8.2')
    .newLine()
    .appendLine('FROM php:${PHP_VERSION}-alpine3.20')
    .newLine()
    .appendLine('ARG PHP_EXTENSIONS=""')
    .newLine()
    .appendLine('RUN apk add --no-cache git bash')
    .newLine()
    .appendLine('# Add PHP extensions')
    .appendLine(
      'ADD https://github.com/mlocati/docker-php-extension-installer/releases/download/2.5.2/install-php-extensions /usr/local/bin/',
    )
    .appendLine('RUN chmod +x /usr/local/bin/install-php-extensions && \\')
    .appendLine('    install-php-extensions ${PHP_EXTENSIONS}')
    .newLine()
    .appendLine('# Composer')
    .appendLine(
      'RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer --version 2.8.1',
    )
    .newLine()
    .appendLine('# Symfony CLI')
    .appendLine('RUN curl -sS https://get.symfony.com/cli/installer | bash  \\')
    .appendLine('    && mv /root/.symfony5/bin/symfony /usr/local/bin/symfony')
    .newLine()
    .appendLine('COPY --chmod=755 docker-entrypoint.sh /docker-entrypoint.sh')
    .newLine()
    .appendLine('COPY php.ini /usr/local/etc/php/conf.d/')
    .newLine()
    .appendLine('WORKDIR /var/www/html')
    .newLine()
    .appendLine('ENTRYPOINT [ "/docker-entrypoint.sh" ]')
    .newLine()
    .appendLine('CMD [ "symfony", "server:start", "--listen-ip=0.0.0.0" ]')

  return builder.toString()
}
