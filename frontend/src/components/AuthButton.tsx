import { Button, HStack, Text } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

/**
 * Authentication button component that handles login and logout.
 *
 * This component uses Auth0's React SDK hooks to manage authentication state.
 * It conditionally renders either a login or logout button based on the user's
 * authentication status.
 *
 * Design decisions:
 * - Login button uses primary color (#646cff) to encourage action
 * - Logout button uses warning color (#ff4444) to indicate destructive action
 * - Icons provide visual clarity and improve UX
 * - returnTo parameter ensures users return to the app after logout
 */
export const AuthButton = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  // Render logout button if user is authenticated
  if (isAuthenticated) {
    return (
      <Button
        variant="outline"
        borderColor="#ff4444"
        color="#ff4444"
        _hover={{ bg: '#ff4444', color: 'white' }}
        onClick={() =>
          logout({
            logoutParams: { returnTo: window.location.origin }
          })
        }
        size="md"
        fontWeight="medium"
      >
        <HStack gap={2}>
          <FaSignOutAlt />
          <Text>Logout</Text>
        </HStack>
      </Button>
    );
  }

  // Render login button if user is not authenticated
  return (
    <Button
      bg="#646cff"
      color="white"
      _hover={{ bg: '#747bff' }}
      onClick={() => loginWithRedirect()}
      size="md"
      fontWeight="semibold"
    >
      <HStack gap={2}>
        <FaSignInAlt />
        <Text>Login</Text>
      </HStack>
    </Button>
  );
};

