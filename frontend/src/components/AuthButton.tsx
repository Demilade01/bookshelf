import { Button } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

export const AuthButton = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if (isAuthenticated) {
    return (
      <Button
        colorPalette="red"
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      >
        Logout
      </Button>
    );
  }

  return (
    <Button colorPalette="blue" onClick={() => loginWithRedirect()}>
      Login
    </Button>
  );
};

