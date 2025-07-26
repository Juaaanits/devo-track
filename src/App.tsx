import AuthPage from './pages/AuthPage';

function App() {
  // You'll probably want to check if user is already logged in
  const isAuthenticated = false; // Check Firebase auth state
  
  return (
    <div className="App">
      {isAuthenticated ? (
        // Show your main app/dashboard
        <div>Welcome to DevoTrack!</div>
      ) : (
        // Show authentication page
        <AuthPage />
      )}
    </div>
  );
}

export default App
