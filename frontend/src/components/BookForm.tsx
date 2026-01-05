import { useState, useEffect } from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  DialogBackdrop,
  Button,
  Field,
  Input,
  Textarea,
  Box,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useMutation } from '@apollo/client/react';
import { FaEdit, FaPlus, FaSave, FaMagic } from 'react-icons/fa';
import { CREATE_BOOK, UPDATE_BOOK } from '../graphql/mutations';
import { GET_BOOKS } from '../graphql/queries';

interface Book {
  id: number;
  name: string;
  description: string;
}

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

export const BookForm = ({ isOpen, onClose, book }: BookFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });
  const [updateBook] = useMutation(UPDATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  useEffect(() => {
    if (book) {
      setName(book.name);
      setDescription(book.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [book, isOpen]);

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      return;
    }

    try {
      if (book) {
        await updateBook({
          variables: {
            updateBookInput: {
              id: book.id,
              name,
              description,
            },
          },
        });
      } else {
        await createBook({
          variables: {
            createBookInput: {
              name,
              description,
            },
          },
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} modal={true}>
      <DialogBackdrop bg="blackAlpha.600" />
      <DialogContent
        maxW="2xl"
        w="90vw"
        bg="#242424"
        borderColor="#333"
        borderRadius="lg"
        boxShadow="xl"
        maxH="90vh"
        overflowY="auto"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      >
        <DialogHeader pb={4} borderBottomWidth="1px" borderColor="#333">
          <HStack gap={2}>
            {book ? <FaEdit color="#646cff" /> : <FaPlus color="#646cff" />}
            <DialogTitle fontSize="xl" fontWeight="bold" color="#e0e0e0">
              {book ? 'Edit Book' : 'Create New Book'}
            </DialogTitle>
          </HStack>
          <DialogCloseTrigger />
        </DialogHeader>
        <Box p={6}>
          <VStack gap={5}>
            <Field.Root>
              <Field.Label fontWeight="medium" mb={2} color="#a0a0a0">
                Book Name
              </Field.Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter book name"
                size="lg"
                bg="#1a1a1a"
                borderColor="#333"
                color="#e0e0e0"
                _placeholder={{ color: '#666' }}
                _focus={{ borderColor: '#646cff' }}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label fontWeight="medium" mb={2} color="#a0a0a0">
                Description
              </Field.Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter book description"
                rows={5}
                size="lg"
                resize="vertical"
                bg="#1a1a1a"
                borderColor="#333"
                color="#e0e0e0"
                _placeholder={{ color: '#666' }}
                _focus={{ borderColor: '#646cff' }}
              />
            </Field.Root>
          </VStack>
        </Box>
        <DialogFooter pt={4} borderTopWidth="1px" borderColor="#333" gap={3}>
          <Button
            variant="outline"
            onClick={onClose}
            size="md"
            borderColor="#333"
            color="#a0a0a0"
            _hover={{ bg: '#2a2a2a', borderColor: '#444' }}
          >
            Cancel
          </Button>
          <Button
            bg="#646cff"
            color="white"
            _hover={{ bg: '#747bff' }}
            _disabled={{ bg: '#444', color: '#666', cursor: 'not-allowed' }}
            onClick={handleSubmit}
            size="md"
            fontWeight="semibold"
            disabled={!name.trim() || !description.trim()}
          >
            <HStack gap={2}>
              {book ? <FaSave /> : <FaMagic />}
              <Text>{book ? 'Update Book' : 'Create Book'}</Text>
            </HStack>
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

