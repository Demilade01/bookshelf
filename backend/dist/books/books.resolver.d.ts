import { BooksService } from './books.service';
import { Book } from './book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
export declare class BooksResolver {
    private readonly booksService;
    constructor(booksService: BooksService);
    findAll(): Promise<Book[]>;
    findOne(id: number): Promise<Book>;
    createBook(createBookInput: CreateBookInput): Promise<Book>;
    updateBook(updateBookInput: UpdateBookInput): Promise<Book>;
    removeBook(id: number): Promise<boolean>;
}
