import { Dashboard } from './pages/Dashboard';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import './App.css';

/**
 * Root application component that manages authentication token lifecycle.
 *
 * This component serves as the authentication bridge between Auth0 and Apollo Client.
 * It fetches the access token from Auth0 and stores it in localStorage, where Apollo
 * Client's auth link can retrieve it for GraphQL requests.
 *
 * The tokenReady state ensures we don't render the Dashboard until the token is
 * available, preventing GraphQL requests from failing due to missing authentication.
 *
 * Why localStorage instead of in-memory state?
 * - Tokens persist across page refreshes
 * - Apollo Client's auth link can access it synchronously
 * - Simpler than passing tokens through React context
 */
function App() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE || '';

  // Track whether the token has been successfully fetched and stored
  // This prevents rendering the Dashboard before authentication is ready
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    /**
     * Fetch and store the access token when authentication state changes.
     *
     * This effect runs whenever:
     * - User logs in (isAuthenticated becomes true)
     * - User logs out (isAuthenticated becomes false)
     * - Auth0 finishes loading (isLoading becomes false)
     *
     * We request an access token (not an ID token) because we need it for
     * API authorization. The audience parameter must match the API identifier
     * configured in Auth0 and the backend.
     */
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          // Request access token silently (uses cached token if available)
          // The audience parameter is critical - it must match exactly with
          // the backend's AUTH0_AUDIENCE and the Auth0 API identifier
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: audience,
            },
          });

          // Store token in localStorage for Apollo Client to use
          // Apollo Client's auth link reads from localStorage to attach
          // the token to GraphQL requests
          localStorage.setItem('auth0_token', token);
          setTokenReady(true);
          console.log('Token stored successfully');
        } catch (error) {
          console.error('Error getting token:', error);
          // Clear token on error to prevent using invalid tokens
          localStorage.removeItem('auth0_token');
          setTokenReady(false);
        }
      } else {
        // User logged out - clear stored token
        localStorage.removeItem('auth0_token');
        setTokenReady(false);
      }
    };

    // Only fetch token after Auth0 has finished initializing
    // This prevents race conditions during the initial authentication check
    if (!isLoading) {
      getToken();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently, audience]);

  // Show loading state while Auth0 initializes or while fetching token
  // This prevents the Dashboard from rendering before authentication is ready,
  // which would cause GraphQL requests to fail
  if (isLoading || (isAuthenticated && !tokenReady)) {
    return <div>Loading...</div>;
  }

  return <Dashboard />;
}

export default App;
