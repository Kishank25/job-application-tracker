import { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserId = localStorage.getItem('userId');
    
    if (savedToken && savedUserId) {
      setIsLoggedIn(true);
      setToken(savedToken);
      setUserId(savedUserId);
    }
  }, []);

  const handleLoginSuccess = (token, userId) => {
    setToken(token);
    setUserId(userId);
    setIsLoggedIn(true);
    
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setCurrentPage('login');
  };

  if (isLoggedIn) {
    return <Dashboard token={token} userId={userId} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {currentPage === 'login' ? (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setCurrentPage('signup')}
        />
      ) : (
        <Signup 
          onSignupSuccess={() => setCurrentPage('login')}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      )}
    </div>
  );
}

export default App;