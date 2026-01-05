import { useState } from 'react';
import {
  Table,
  IconButton,
  Box,
  useDisclosure,
  Text,
  Spinner,
  Center,
  VStack,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client/react';
import { FaEdit, FaTrash, FaBookOpen } from 'react-icons/fa';
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

  if (loading) {
    return (
      <Center py={12}>
        <VStack gap={3}>
          <Spinner size="lg" color="#646cff" />
          <Text color="#a0a0a0">Loading books...</Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Box
        p={6}
        borderRadius="md"
        bg="#2a1a1a"
        borderWidth="1px"
        borderColor="#ff4444"
      >
        <Text color="#ff6666" fontWeight="medium">
          Error: {error.message}
        </Text>
      </Box>
    );
  }

  if (!data?.books || data.books.length === 0) {
    return (
      <Center py={12}>
        <VStack gap={4}>
          <Box fontSize="4xl" color="#646cff">
            <FaBookOpen />
          </Box>
          <VStack gap={2}>
            <Text fontSize="lg" fontWeight="semibold" color="#e0e0e0">
              No books yet
            </Text>
            <Text color="#a0a0a0" textAlign="center">
              Get started by adding your first book to the collection
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return (
    <>
      <Box overflowX="auto">
        <Table.Root variant="outline" size="md">
          <Table.Header>
            <Table.Row bg="#2a2a2a" borderColor="#333">
              <Table.ColumnHeader fontWeight="semibold" color="#a0a0a0" borderColor="#333" bg="#2a2a2a">
                ID
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="#a0a0a0" borderColor="#333" bg="#2a2a2a">
                Name
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="#a0a0a0" borderColor="#333" bg="#2a2a2a">
                Description
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="#a0a0a0" borderColor="#333" bg="#2a2a2a" textAlign="right">
                Actions
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.books.map((book: Book) => (
              <Table.Row
                key={book.id}
                _hover={{ bg: '#2a2a2a' }}
                transition="background 0.2s"
                borderColor="#333"
              >
                <Table.Cell borderColor="#333">
                  <Badge bg="#646cff" color="white" fontSize="xs" px={2} py={1} borderRadius="sm">
                    #{book.id}
                  </Badge>
                </Table.Cell>
                <Table.Cell borderColor="#333">
                  <Text fontWeight="medium" color="#e0e0e0">
                    {book.name}
                  </Text>
                </Table.Cell>
                <Table.Cell borderColor="#333">
                  <Text
                    color="#a0a0a0"
                    maxW="400px"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {book.description}
                  </Text>
                </Table.Cell>
                <Table.Cell borderColor="#333">
                  <HStack justify="flex-end" gap={2}>
                    <IconButton
                      aria-label="Edit book"
                      size="sm"
                      variant="outline"
                      borderColor="#646cff"
                      color="#646cff"
                      _hover={{ bg: '#646cff', color: 'white' }}
                      onClick={() => handleEdit(book)}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      aria-label="Delete book"
                      size="sm"
                      variant="outline"
                      borderColor="#ff4444"
                      color="#ff4444"
                      _hover={{ bg: '#ff4444', color: 'white' }}
                      onClick={() => handleDelete(book.id)}
                    >
                      <FaTrash />
                    </IconButton>
                  </HStack>
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
