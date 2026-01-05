import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

/**
 * GraphQL resolver for book operations.
 *
 * Resolvers are the entry points for GraphQL queries and mutations. They handle:
 * - Input validation (via DTOs with class-validator decorators)
 * - Argument parsing and type coercion
 * - Delegating business logic to services
 * - Returning properly formatted responses
 *
 * The @UseGuards(AuthGuard) decorator applies authentication to all methods
 * in this resolver, ensuring only authenticated users can access book operations.
 * This is more secure than applying guards at the individual method level,
 * as it prevents accidentally exposing endpoints.
 */
@Resolver(() => Book)
@UseGuards(AuthGuard) // Protect all queries and mutations in this resolver
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  /**
   * Query to fetch all books.
   * GraphQL query name: 'books'
   * Returns: Array of Book objects
   */
  @Query(() => [Book], { name: 'books' })
  findAll() {
    return this.booksService.findAll();
  }

  /**
   * Query to fetch a single book by ID.
   * GraphQL query name: 'book'
   * Returns: Single Book object or null if not found
   */
  @Query(() => Book, { name: 'book' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.findOne(id);
  }

  /**
   * Mutation to create a new book.
   * Uses CreateBookInput DTO for type-safe input validation.
   * Returns: The newly created Book object
   */
  @Mutation(() => Book)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.booksService.create(
      createBookInput.name,
      createBookInput.description,
    );
  }

  /**
   * Mutation to update an existing book.
   * Uses UpdateBookInput DTO which extends CreateBookInput and adds an id field.
   * Returns: The updated Book object
   */
  @Mutation(() => Book)
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.booksService.update(
      updateBookInput.id,
      updateBookInput.name,
      updateBookInput.description,
    );
  }

  /**
   * Mutation to delete a book.
   * Returns: Boolean indicating success (true) or failure (false)
   */
  @Mutation(() => Boolean)
  async removeBook(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.remove(id);
  }
}

