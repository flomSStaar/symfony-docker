import { PhpService } from '@/services/php-service'
import { DatabaseService } from '@/services/database-service'
import { NodeService } from '@/services/node-service'
import { MailhogService } from '@/services/mailhog-service'
import { MinioService } from '@/services/minio-service'
import { InfluxdbService } from '@/services/influxdb-service'
import { GotenbergService } from '@/services/gotenberg-service'

export const AVAILABLE_SYMFONY_SERVICES = [
  new PhpService(),
  new DatabaseService(),
  new NodeService(),
  new MailhogService(),
  new MinioService(),
  new InfluxdbService(),
  new GotenbergService(),
]
