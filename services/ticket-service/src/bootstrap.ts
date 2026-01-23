import { NestFactory } from '@nestjs/core';
import { TicketsModule } from './tickets/tickets.module';
import { VaultService } from '../../../shared/src/vault/vault.service';

async function bootstrap() {
  const app = await NestFactory.create(TicketsModule);

  const vault = app.get(VaultService);
  const secrets = await vault.getSecret('ticket-service');

  process.env.JWT_SECRET = secrets.jwt_secret;
  process.env.KAFKA_BROKER = secrets.kafka_broker;

  process.env.DATABASE_URL =
    `postgresql://postgres:${secrets.postgres_password}@postgres:5432/ticketdb`;

  await app.listen(3001);
}
bootstrap();
