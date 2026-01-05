import { Box, Heading, Button, HStack } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { BookTable } from '../components/BookTable';
import { BookForm } from '../components/BookForm';
import { AuthButton } from '../components/AuthButton';
import { useState } from 'react';

export const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return <Box p={8}>Loading...</Box>;
  }

  if (!isAuthenticated) {
    return (
      <Box p={8} textAlign="center">
        <Heading mb={4}>Welcome to Bookshelf</Heading>
        <p>Please log in to manage your books.</p>
        <Box mt={4}>
          <AuthButton />
        </Box>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <HStack justify="space-between" align="center" mb={6}>
        <Heading>Bookshelf Dashboard</Heading>
        <HStack gap={4}>
          <Button
            colorPalette="green"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add New Book
          </Button>
          <AuthButton />
        </HStack>
      </HStack>

      <BookTable />

      <BookForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        book={null}
      />
    </Box>
  );
};

