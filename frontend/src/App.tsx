import { Dashboard } from './pages/Dashboard';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE || '';
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: audience,
            },
          });
          localStorage.setItem('auth0_token', token);
          setTokenReady(true);
          console.log('Token stored successfully');
        } catch (error) {
          console.error('Error getting token:', error);
          localStorage.removeItem('auth0_token');
          setTokenReady(false);
        }
      } else {
        localStorage.removeItem('auth0_token');
        setTokenReady(false);
      }
    };

    if (!isLoading) {
      getToken();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently, audience]);

  if (isLoading || (isAuthenticated && !tokenReady)) {
    return <div>Loading...</div>;
  }

  return <Dashboard />;
}

export default App;
