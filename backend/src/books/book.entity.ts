import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * Book entity that serves dual purposes:
 * 1. TypeORM entity for database mapping (SQLite table structure)
 * 2. GraphQL type definition for the API schema
 *
 * This approach uses decorators from both libraries to define a single source
 * of truth for the Book model. The @Entity decorator tells TypeORM how to
 * map this class to a database table, while @ObjectType and @Field decorators
 * define the GraphQL schema. This eliminates the need to maintain separate
 * database models and GraphQL types, reducing duplication and potential inconsistencies.
 */
@ObjectType() // GraphQL: This class represents a GraphQL object type
@Entity('books') // TypeORM: Maps to 'books' table in the database
export class Book {
  @Field(() => Int) // GraphQL: Expose as Int type in schema
  @PrimaryGeneratedColumn() // TypeORM: Auto-incrementing primary key
  id: number;

  @Field() // GraphQL: Expose as String type (default)
  @Column() // TypeORM: Standard varchar column
  name: string;

  @Field() // GraphQL: Expose as String type
  @Column('text') // TypeORM: Text column for longer content
  description: string;
}

