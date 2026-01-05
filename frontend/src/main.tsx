import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client/react';
import { Auth0Provider } from '@auth0/auth0-react';
import { apolloClient } from './lib/apollo-client';
import './index.css';
import App from './App.tsx';

/**
 * Application entry point that sets up all global providers.
 *
 * This file configures the React application with three critical providers:
 * 1. ChakraProvider - Provides theme and styling system
 * 2. Auth0Provider - Handles authentication state and token management
 * 3. ApolloProvider - Enables GraphQL queries and mutations throughout the app
 *
 * The provider hierarchy matters: Auth0Provider wraps ApolloProvider so that
 * Apollo Client can access authentication tokens for API requests.
 */

// Load Auth0 configuration from environment variables
// VITE_ prefix is required for Vite to expose these variables to the client
const domain = import.meta.env.VITE_AUTH0_DOMAIN || '';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || '';

// Validate Auth0 configuration at startup
// This helps catch configuration errors early rather than failing silently
// during authentication attempts
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
    {/* Chakra UI provider for theming and component styling */}
    <ChakraProvider value={defaultSystem}>
      {/* Auth0 provider manages authentication state and provides hooks */}
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin, // Redirect back to app after login
          audience: audience, // API identifier - must match backend configuration
        }}
        onRedirectCallback={(appState) => {
          // Handle post-authentication redirect
          // This allows preserving the intended destination after login
          if (appState?.returnTo) {
            window.history.replaceState({}, '', appState.returnTo);
          }
        }}
      >
        {/* Apollo Client provider enables GraphQL throughout the component tree */}
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </Auth0Provider>
    </ChakraProvider>
  </StrictMode>,
);
