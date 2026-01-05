import { Field, InputType, Int } from '@nestjs/graphql';

/**
 * Input DTO for updating an existing book.
 *
 * This extends the concept of CreateBookInput by adding an id field to identify
 * which book to update. In a more complex system, we might use PartialType
 * from @nestjs/mapped-types to automatically extend CreateBookInput, but for
 * simplicity and clarity, we define it explicitly here.
 *
 * All fields are required in this implementation. In a production system, you
 * might want to make name and description optional to allow partial updates.
 */
@InputType()
export class UpdateBookInput {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;
}

