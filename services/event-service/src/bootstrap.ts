import { NestFactory } from "@nestjs/core";
import { VaultService } from "../../../shared/src/vault/vault.service";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const vault = app.get(VaultService);
    const secrets = await vault.getSecret('event-service');

    process.env.JWT_SECRET = secrets.jwt_secret;
    process.env.DATABASE_PASSWORD = secrets.postgres_password;

    await app.listen(3002);
}
bootstrap();