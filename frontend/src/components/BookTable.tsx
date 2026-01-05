import { useState } from 'react';
import {
  Table,
  IconButton,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_BOOKS } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import { BookForm } from './BookForm';

interface Book {
  id: number;
  name: string;
  description: string;
}

export const BookTable = () => {
  const { loading, error, data, refetch } = useQuery<{ books: Book[] }>(GET_BOOKS);
  const [removeBook] = useMutation(REMOVE_BOOK);
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await removeBook({ variables: { id } });
        refetch();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleFormClose = () => {
    setEditingBook(null);
    onClose();
    refetch();
  };

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error.message}</Box>;

  return (
    <>
      <Box overflowX="auto">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Description</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.books.map((book: Book) => (
              <Table.Row key={book.id}>
                <Table.Cell>{book.id}</Table.Cell>
                <Table.Cell>{book.name}</Table.Cell>
                <Table.Cell>{book.description}</Table.Cell>
                <Table.Cell>
                  <IconButton
                    aria-label="Edit book"
                    size="sm"
                    mr={2}
                    onClick={() => handleEdit(book)}
                  >
                    ✏️
                  </IconButton>
                  <IconButton
                    aria-label="Delete book"
                    size="sm"
                    colorPalette="red"
                    onClick={() => handleDelete(book.id)}
                  >
                    🗑️
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <BookForm
        isOpen={isOpen}
        onClose={handleFormClose}
        book={editingBook}
      />
    </>
  );
};

