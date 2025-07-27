import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onToggleForm?: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  onToggleForm, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setErrors({});
      await onSubmit(formData.email, formData.password);
    } catch (error) {
      setErrors({ 
        general: error instanceof Error ? error.message : 'Login failed. Please try again.' 
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      {/* Global CSS Reset for HTML and Body */}
      {/* This is like telling the very edges of your webpage to have no extra space */}
      <style>
        {`
          html, body {
            margin: 0; /* No outside space around the page */
            padding: 0; /* No inside space around the page */
            height: 100%; /* Make sure the page itself is 100% tall */
            /* Hide any scrollbars that might try to appear on the main page */
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* This outer div now controls the full height and centers the form vertically */}
      <div style={{ 
        width: '100%', 
        minHeight: '100vh', // Make sure it takes up at least the full screen height
        display: 'flex', // Use flexbox to center its content
        alignItems: 'center', // Center vertically
        justifyContent: 'center', // Center horizontally
        padding: '1rem 0', // Add some vertical padding just in case content slightly overflows
        boxSizing: 'border-box' // Include padding in the total height calculation
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', 
          padding: '2rem',
          maxWidth: '22rem', // Keep the max width for the form itself
          width: '100%', // Ensure it takes full width up to max
          // Removed maxHeight and overflowY from here, as the outer div handles page-level fitting
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                backgroundColor: '#2563eb', 
                borderRadius: '0.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <LogIn style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
              Welcome back
            </h2>
            <p style={{ color: '#6b7280' }}>Sign in to continue your development journey</p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '0.5rem' 
            }}>
              <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.5rem' ,
                marginTop: '-1.0rem'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  inset: '0 auto 0 0', 
                  paddingLeft: '0.75rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  pointerEvents: 'none' 
                }}>
                  <Mail style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    display: 'block',
                    width: '100%', 
                    // Removed maxWidth and margin: '0 auto' to make it full width again
                    boxSizing: 'border-box', 
                    paddingLeft: '2.5rem',
                    paddingRight: '0.75rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    border: errors.email ? '1px solid #fca5a5' : '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    backgroundColor: errors.email ? '#fef2f2' : 'white',
                    fontSize: '1rem',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                    outline: 'none'
                  }}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = errors.email ? '#fca5a5' : '#d1d5db'}
                />
              </div>
              {errors.email && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.5rem' ,
                marginTop: '-0.75rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  inset: '0 auto 0 0', 
                  paddingLeft: '0.75rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  pointerEvents: 'none' 
                }}>
                  <Lock style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    display: 'block',
                    width: '100%', 
                    // Removed maxWidth and margin: '0 auto' to make it full width again
                    paddingLeft: '2.5rem',
                    boxSizing: 'border-box', 
                    paddingRight: '3rem', 
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    border: errors.password ? '1px solid #fca5a5' : '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    backgroundColor: errors.password ? '#fef2f2' : 'white',
                    fontSize: '1rem',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                    outline: 'none'
                  }}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = errors.password ? '#fca5a5' : '#d1d5db'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    inset: '0 0 0 auto',
                    paddingRight: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.15s ease-in-out'
                  }}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                  ) : (
                    <Eye style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link & Remember Me */}
            <div style={{ 
                display: 'flex', // Make it a flexible container
                justifyContent: 'space-between', // Pushes items to far ends (left and right)
                alignItems: 'center', // Centers items vertically within this row
                maxWidth: '22rem', // Keep it aligned with the inputs,
                marginTop: '-0.5rem',
                marginBottom: '-1.5rem' // Space below the row
                
            }}>
              {/* Remember Me Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  style={{ 
                    width: '1rem', 
                    height: '1rem', 
                    borderRadius: '0.25rem', // Slightly rounded corners for the checkbox
                    border: '1px solid #d1d5db', // Light grey border
                    cursor: 'pointer' 
                  }}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" style={{ fontSize: '0.875rem', color: '#374151' }}> {/* Smaller font size and color */}
                  Remember me
                </label>
              </div>

              {/* Forgot Password Button (now part of the flex container) */}
              <button
                type="button"
                style={{
                  fontSize: '0.875rem',
                  color: '#2563eb',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none', // Kept underline as per previous image
                  transition: 'color 0.15s ease-in-out'
                }}
                disabled={isLoading}
                onMouseOver={(e) => (e.target as HTMLButtonElement).style.color = '#1d4ed8'}
                onMouseOut={(e) => (e.target as HTMLButtonElement).style.color = '#2563eb'}
              >
                Forgot password?
              </button>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                color: 'white',
                height: '2.8rem',
                marginTop: '0.5rem',
                marginBottom: '0rem', // Space below the row
                fontWeight: '500',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s ease-in-out',
                fontSize: '1rem'
              }}
              onMouseOver={(e) => {
                if (!isLoading) (e.target as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
              }}
              onMouseOut={(e) => {
                if (!isLoading) (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb';
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '0.5rem'
                  }} />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* OR Separator */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', // Space between line and text
              
              maxWidth: '22rem' // Match form width
            }}>
              <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#e5e7eb' }} /> {/* Left line */}
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>OR</span>
              <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#e5e7eb' }} /> {/* Right line */}
            </div>

            {/* Google Login Button */}
            <button
              type="button" // Important: This is not a submit button for the form
              style={{
                width: '100%',
                height: '2.8rem',
                maxWidth: '22rem', // Match input field width
                margin: '0 auto',   // Center the button
                backgroundColor: 'white',
                color: '#374151', // Dark text color
                fontWeight: '500',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db', // Added border
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out',
                fontSize: '1rem',
                display: 'flex', // To center content and icon
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem' // Space between icon and text
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb';
                  (e.target as HTMLButtonElement).style.borderColor = '#9ca3af';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'white';
                  (e.target as HTMLButtonElement).style.borderColor = '#d1d5db';
                }
              }}
              disabled={isLoading}
            >
              {/* Google Icon SVG - using a simple circle with 'G' as a placeholder */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#374151" strokeWidth="2"/>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#374151">G</text>
              </svg>
              Continue with Google
            </button>
                      </form>

          {/* Toggle to Sign Up */}
          {onToggleForm && (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#6b7280' }}>
                Don't have an account?{' '}
                <button
                  onClick={onToggleForm}
                  style={{
                    color: '#2563eb',
                    fontWeight: '500',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    transition: 'color 0.15s ease-in-out'
                  }}
                  disabled={isLoading}
                  onMouseOver={(e) => (e.target as HTMLButtonElement).style.color = '#1d4ed8'}
                  onMouseOut={(e) => (e.target as HTMLButtonElement).style.color = '#2563eb'}
                >
                  Sign up here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginForm;
