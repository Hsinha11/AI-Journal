// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import JournalPage from './pages/JournalPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { token } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This useEffect now lives in App and depends on the token
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/entries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch entries.');
        const data = await response.json();
        setEntries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data if the user is logged in (token exists)
    if (token) {
      fetchEntries();
    } else {
      // If there's no token, we're not loading anything.
      setLoading(false);
      setEntries([]); // Clear entries on logout
    }
  }, [token]); // This effect re-runs whenever the token changes

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              {/* Pass all state and handlers down to the page */}
              <JournalPage 
                entries={entries} 
                loading={loading} 
                error={error} 
                setEntries={setEntries} // Pass the setter function
              />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;