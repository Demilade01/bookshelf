import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client/react';
import { Auth0Provider } from '@auth0/auth0-react';
import { apolloClient } from './lib/apollo-client';
import './index.css';
import App from './App.tsx';

const domain = import.meta.env.VITE_AUTH0_DOMAIN || '';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || '';

// Validate Auth0 configuration
if (!domain || !clientId || !audience) {
  console.error('Missing Auth0 environment variables!');
  console.error('Required variables:', {
    VITE_AUTH0_DOMAIN: domain || 'MISSING',
    VITE_AUTH0_CLIENT_ID: clientId || 'MISSING',
    VITE_AUTH0_AUDIENCE: audience || 'MISSING',
  });
  console.error('Please create a .env file in the frontend folder with these values.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: audience,
        }}
        onRedirectCallback={(appState) => {
          // Store token in localStorage after successful auth
          if (appState?.returnTo) {
            window.history.replaceState({}, '', appState.returnTo);
          }
        }}
      >
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </Auth0Provider>
    </ChakraProvider>
  </StrictMode>,
);
