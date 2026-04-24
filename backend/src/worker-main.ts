import { NestFactory } from "@nestjs/core";
import { WorkerModule } from "./worker.module";

async function bootstrap() {
    // Khởi tạo worker context riêng, không chạy HTTP server.
    const app = await NestFactory.createApplicationContext(WorkerModule);
    console.log('Worker is running...');
  }
  bootstrap();