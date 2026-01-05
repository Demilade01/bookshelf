import { Button, HStack, Text } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

export const AuthButton = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if (isAuthenticated) {
    return (
      <Button
        variant="outline"
        borderColor="#ff4444"
        color="#ff4444"
        _hover={{ bg: '#ff4444', color: 'white' }}
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
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

