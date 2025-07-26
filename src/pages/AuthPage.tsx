import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
// You'll need to set up Firebase first and import these
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { auth } from './firebase/config';

const AuthPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle login submission
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Firebase login logic (you'll implement this when Firebase is set up)
      console.log('Attempting login with:', email);
      
      // Example Firebase code (uncomment when Firebase is configured):
      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // console.log('Login successful:', userCredential.user);
      
      // For now, just simulate success
      alert('Login successful! (This is just a demo)');
      
      // On successful login, you might redirect to dashboard:
      // navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      // The error will be handled by the LoginForm component
      // You can customize error messages based on Firebase error codes
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup submission
  const handleSignup = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting signup with:', email, displayName);
      
      // Firebase signup logic (you'll implement this when Firebase is set up)
      // Example Firebase code (uncomment when Firebase is configured):
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // 
      // // Update the user's display name
      // await updateProfile(userCredential.user, {
      //   displayName: displayName
      // });
      //
      // console.log('Signup successful:', userCredential.user);
      
      // For now, just simulate success
      alert(`Signup successful! Welcome ${displayName}! (This is just a demo)`);
      
      // On successful signup, you might redirect to dashboard or show welcome message:
      // navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Customize error messages based on Firebase error codes
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email address already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isSignup ? (
          <SignupForm
            onSubmit={handleSignup}
            onToggleForm={() => setIsSignup(false)}
            isLoading={isLoading}
          />
        ) : (
          <LoginForm
            onSubmit={handleLogin}
            onToggleForm={() => setIsSignup(true)}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;