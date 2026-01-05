import { Field, InputType } from '@nestjs/graphql';

/**
 * Input DTO (Data Transfer Object) for creating a new book.
 *
 * DTOs serve multiple purposes:
 * 1. Type safety - Ensures GraphQL mutations receive correctly typed inputs
 * 2. Validation - Can be extended with class-validator decorators for input validation
 * 3. Documentation - GraphQL schema automatically includes these types
 * 4. Separation of concerns - Keeps input structure separate from entity structure
 *
 * This input type is used by the createBook mutation in the GraphQL API.
 */
@InputType()
export class CreateBookInput {
  @Field()
  name: string;

  @Field()
  description: string;
}

