import { Repository } from 'typeorm';
import { Book } from './book.entity';
export declare class BooksService {
    private booksRepository;
    constructor(booksRepository: Repository<Book>);
    findAll(): Promise<Book[]>;
    findOne(id: number): Promise<Book>;
    create(name: string, description: string): Promise<Book>;
    update(id: number, name: string, description: string): Promise<Book>;
    remove(id: number): Promise<boolean>;
}
