import {
  Box,
  Heading,
  Button,
  HStack,
  VStack,
  Text,
  Card,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { FaBook, FaPlus } from 'react-icons/fa';
import { BookTable } from '../components/BookTable';
import { BookForm } from '../components/BookForm';
import { AuthButton } from '../components/AuthButton';
import { useState } from 'react';

export const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <Center minH="100vh" bg="#1a1a1a">
        <VStack gap={4}>
          <Spinner size="xl" color="#646cff" />
          <Text color="#a0a0a0">Loading...</Text>
        </VStack>
      </Center>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        minH="100vh"
        bg="#1a1a1a"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={8}
      >
        <Card.Root maxW="md" w="full" p={8} bg="#242424" borderColor="#333">
          <VStack gap={6} textAlign="center">
            <VStack gap={2}>
              <HStack gap={3}>
                <FaBook size={32} color="#646cff" />
                <Heading size="2xl" color="#646cff" fontWeight="bold">
                  Bookshelf
                </Heading>
              </HStack>
              <Text fontSize="lg" color="#a0a0a0">
                Your personal book management system
              </Text>
            </VStack>
            <Text color="#888">
              Please log in to manage your books
            </Text>
            <Box mt={4}>
              <AuthButton />
            </Box>
          </VStack>
        </Card.Root>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="#1a1a1a"
      p={{ base: 4, md: 8 }}
    >
      <Box maxW="7xl" mx="auto">
        {/* Header */}
        <Card.Root mb={6} p={6} bg="#242424" borderColor="#333">
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <VStack align="start" gap={1}>
              <HStack gap={3}>
                <FaBook size={24} color="#646cff" />
                <Heading
                  size="xl"
                  color="#646cff"
                  fontWeight="bold"
                >
                  Bookshelf Dashboard
                </Heading>
              </HStack>
              <Text color="#a0a0a0" fontSize="sm">
                Manage your book collection
              </Text>
            </VStack>
            <HStack gap={3} flexWrap="wrap">
              <Button
                bg="#646cff"
                color="white"
                _hover={{ bg: '#747bff' }}
                size="md"
                onClick={() => setIsCreateModalOpen(true)}
                fontWeight="semibold"
              >
                <HStack gap={2}>
                  <FaPlus />
                  <Text>Add New Book</Text>
                </HStack>
              </Button>
              <AuthButton />
            </HStack>
          </HStack>
        </Card.Root>

        {/* Books Table */}
        <Card.Root bg="#242424" borderColor="#333">
          <Card.Header pb={4} borderBottomWidth="1px" borderColor="#333">
            <Heading size="md" color="#e0e0e0">Your Books</Heading>
          </Card.Header>
          <Card.Body>
            <BookTable />
          </Card.Body>
        </Card.Root>

        <BookForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          book={null}
        />
      </Box>
    </Box>
  );
};

