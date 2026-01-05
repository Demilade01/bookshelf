import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

/**
 * Service class that handles all business logic for book operations.
 *
 * This service follows the Repository pattern, which separates data access
 * logic from business logic. The service methods are called by resolvers,
 * keeping resolvers thin and focused on GraphQL-specific concerns (input validation,
 * response formatting) while business logic lives here.
 *
 * This separation makes the code more testable and maintainable, as we can
 * test business logic independently of GraphQL concerns.
 */
@Injectable()
export class BooksService {
  constructor(
    // Inject the TypeORM repository for Book entity
    // This provides type-safe database operations without writing raw SQL
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  /**
   * Retrieve all books from the database.
   * Returns an empty array if no books exist.
   */
  async findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  /**
   * Find a single book by ID.
   * Throws NotFoundException if the book doesn't exist, which GraphQL
   * will automatically convert to an appropriate error response.
   */
  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  /**
   * Create a new book in the database.
   *
   * We use repository.create() followed by save() rather than save() directly
   * because create() validates the entity structure before saving, providing
   * better type safety and error messages.
   */
  async create(name: string, description: string): Promise<Book> {
    const book = this.booksRepository.create({ name, description });
    return this.booksRepository.save(book);
  }

  /**
   * Update an existing book.
   *
   * We use update() for the database operation (more efficient for partial updates)
   * then fetch the updated record using findOne() to return the complete entity.
   * This ensures we return the full updated object, not just the update result.
   */
  async update(id: number, name: string, description: string): Promise<Book> {
    await this.booksRepository.update(id, { name, description });
    return this.findOne(id); // Fetch and return the updated entity
  }

  /**
   * Delete a book by ID.
   * Returns true if the book was deleted, false if it didn't exist.
   *
   * We use nullish coalescing (??) to handle the case where affected might be
   * null or undefined, defaulting to 0 for comparison.
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.booksRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

