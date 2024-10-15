import { PhpService } from '@/services/php-service'
import { MariadbService } from '@/services/mariadb-service'
import { NodeService } from '@/services/node-service'
import { MailhogService } from '@/services/mailhog-service'
import { MinioService } from '@/services/minio-service'
import { InfluxdbService } from '@/services/influxdb-service'
import { GotenbergService } from '@/services/gotenberg-service'
import { MailpitService } from '@/services/mailpit-service'
import { PostgresqlService } from '@/services/postgresql-service'

export const AVAILABLE_SYMFONY_SERVICES = [
  new PhpService(),
  new MariadbService(),
  new NodeService(),
  new MailhogService(),
  new MinioService(),
  new InfluxdbService(),
  new GotenbergService(),
  new MailpitService(),
  new PostgresqlService(),
]
