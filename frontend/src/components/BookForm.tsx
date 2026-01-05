import { useState, useEffect } from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  Button,
  Field,
  Input,
  Textarea,
  Box,
} from '@chakra-ui/react';
import { useMutation } from '@apollo/client/react';
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
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Book' : 'Create New Book'}</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <Box p={4}>
          <Field.Root mb={4}>
            <Field.Label>Name</Field.Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter book name"
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Description</Field.Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description"
              rows={4}
            />
          </Field.Root>
        </Box>
        <DialogFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorPalette="blue" onClick={handleSubmit}>
            {book ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

