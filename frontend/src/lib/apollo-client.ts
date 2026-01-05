import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

/**
 * Apollo Client configuration for GraphQL communication.
 *
 * Apollo Client is configured with two link chains:
 * 1. Auth link - Attaches JWT token to every request
 * 2. HTTP link - Sends requests to the GraphQL endpoint
 *
 * The links are chained together so that every GraphQL request automatically
 * includes the authentication token in the Authorization header.
 */

// HTTP link that points to the GraphQL API endpoint
// The URL is configurable via environment variables to support different
// deployment environments (development, staging, production)
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',
});

/**
 * Authentication link that intercepts every GraphQL request and adds the
 * JWT token to the Authorization header.
 *
 * This link runs before the HTTP link, allowing us to modify the request
 * headers before the request is sent. We read the token from localStorage
 * (where App.tsx stores it) and attach it as a Bearer token.
 *
 * The Bearer token format is required by the backend's AuthGuard, which
 * expects: "Authorization: Bearer <token>"
 */
const authLink = setContext((_, { headers }) => {
  // Retrieve the access token from localStorage
  // The token is stored by App.tsx after successful Auth0 authentication
  const token = localStorage.getItem('auth0_token');

  if (!token) {
    // Warn in development - this shouldn't happen if authentication flow works correctly
    // In production, requests without tokens will be rejected by the backend
    console.warn('No auth token found in localStorage');
  }

  // Return modified headers with Authorization token
  // The spread operator preserves any existing headers while adding our auth header
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

/**
 * Apollo Client instance configured with authentication and caching.
 *
 * The link chain (authLink.concat(httpLink)) ensures:
 * - Auth link runs first, adding the token
 * - HTTP link runs second, sending the request
 *
 * InMemoryCache provides client-side caching of GraphQL query results,
 * reducing unnecessary network requests and improving performance.
 */
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink), // Chain auth link before HTTP link
  cache: new InMemoryCache(), // Client-side query result caching
});

