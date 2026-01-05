import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async create(name: string, description: string): Promise<Book> {
    const book = this.booksRepository.create({ name, description });
    return this.booksRepository.save(book);
  }

  async update(id: number, name: string, description: string): Promise<Book> {
    await this.booksRepository.update(id, { name, description });
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.booksRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

