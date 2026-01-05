import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function to initialize and start the NestJS application.
 *
 * This is the entry point of the backend server. We configure CORS here to allow
 * the frontend application to communicate with the GraphQL API. The CORS configuration
 * is essential for cross-origin requests from the React SPA.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  // We allow credentials to be sent with requests, which is necessary for
  // authentication tokens to be included in GraphQL requests from the frontend.
  // The origin is configurable via environment variables to support different
  // deployment environments (development, staging, production).
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Required for sending Authorization headers
  });

  // Start the server on the configured port (default: 3000)
  // Using nullish coalescing to provide a sensible default for development
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
