import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { Book } from './books/book.entity';

/**
 * Root application module that configures all core dependencies.
 *
 * This module follows NestJS's modular architecture pattern, where each feature
 * is organized into its own module (BooksModule, AuthModule). This approach
 * promotes separation of concerns and makes the codebase more maintainable.
 */
@Module({
  imports: [
    // Global configuration module for environment variables
    // Making it global allows us to inject ConfigService anywhere without
    // explicitly importing ConfigModule in each feature module.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeORM configuration for database access
    // Using SQLite for simplicity - it's file-based and requires no separate
    // database server, making it ideal for development and testing.
    // synchronize: true auto-creates/updates the schema based on entities,
    // but should be disabled in production for safety.
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Book],
      synchronize: true, // ⚠️ Set to false in production - use migrations instead
    }),

    // GraphQL module configuration using Apollo Server
    // autoSchemaFile generates the GraphQL schema automatically from decorators
    // in our entities and resolvers, eliminating the need to manually write SDL.
    // The context function makes the Express request object available to resolvers,
    // which is essential for accessing the Authorization header in our AuthGuard.
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true, // Ensures consistent schema output
      context: ({ req }) => ({ req }), // Pass request to resolvers for auth
    }),

    // Feature modules
    BooksModule, // Handles all book-related operations
    AuthModule,   // Provides authentication guard
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
