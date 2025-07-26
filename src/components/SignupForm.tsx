import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';

interface SignupFormProps {
  onSubmit: (email: string, password: string, displayName: string) => Promise<void>;
  onToggleForm?: () => void;
  isLoading?: boolean;
}

interface FormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ 
  onSubmit, 
  onToggleForm, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setErrors({});
      await onSubmit(formData.email, formData.password, formData.displayName.trim());
    } catch (error) {
      setErrors({ 
        general: error instanceof Error ? error.message : 'Registration failed. Please try again.' 
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

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { strength: 33, label: 'Weak', color: '#dc2626' };
    if (score <= 4) return { strength: 66, label: 'Medium', color: '#d97706' };
    return { strength: 100, label: 'Strong', color: '#059669' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div style={{ width: '100%', maxWidth: '28rem', margin: '0 auto' }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', 
        padding: '2rem' 
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '3rem', 
              height: '3rem', 
              backgroundColor: '#059669', 
              borderRadius: '0.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <UserPlus style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Create Account
          </h2>
          <p style={{ color: '#6b7280' }}>Start tracking your development journey</p>
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
          {/* Display Name Field */}
          <div>
            <label htmlFor="displayName" style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Display Name
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
                <User style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
              </div>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                style={{
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingLeft: '2.5rem',
                  paddingRight: '0.75rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: errors.displayName ? '1px solid #fca5a5' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: errors.displayName ? '#fef2f2' : 'white',
                  fontSize: '1rem',
                  transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                  outline: 'none'
                }}
                placeholder="Enter your display name"
                disabled={isLoading}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = errors.displayName ? '#fca5a5' : '#d1d5db'}
              />
            </div>
            {errors.displayName && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>{errors.displayName}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
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
                onFocus={(e) => e.target.style.borderColor = '#059669'}
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
              marginBottom: '0.5rem' 
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
                  boxSizing: 'border-box',
                  display: 'block',
                  width: '100%',
                  paddingLeft: '2.5rem',
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
                placeholder="Create a password"
                disabled={isLoading}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  marginBottom: '0.25rem' 
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Password strength</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: passwordStrength.color 
                  }}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '9999px', 
                  height: '0.5rem' 
                }}>
                  <div style={{
                    height: '0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: passwordStrength.color,
                    width: `${passwordStrength.strength}%`,
                    transition: 'all 0.3s ease-in-out'
                  }} />
                </div>
              </div>
            )}
            
            {errors.password && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Confirm Password
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
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingLeft: '2.5rem',
                  paddingRight: '3rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: errors.confirmPassword ? '1px solid #fca5a5' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: errors.confirmPassword ? '#fef2f2' : 'white',
                  fontSize: '1rem',
                  transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                  outline: 'none'
                }}
                placeholder="Confirm your password"
                disabled={isLoading}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#fca5a5' : '#d1d5db'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? (
                  <EyeOff style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                ) : (
                  <Eye style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            By creating an account, you agree to our{' '}
            <button 
              type="button" 
              style={{
                color: '#059669',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.875rem'
              }}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.color = '#047857')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.color = '#059669')}
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button 
              type="button" 
              style={{
                color: '#059669',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.875rem'
              }}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.color = '#047857')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.color = '#059669')}
            >
              Privacy Policy
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#9ca3af' : '#059669',
              color: 'white',
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
              if (!isLoading) (e.target as HTMLButtonElement).style.backgroundColor = '#047857';
            }}
            onMouseOut={(e) => {
              if (!isLoading) (e.target as HTMLButtonElement).style.backgroundColor = '#059669';
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
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Toggle to Login */}
        {onToggleForm && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#6b7280' }}>
              Already have an account?{' '}
              <button
                onClick={onToggleForm}
                style={{
                  color: '#059669',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  transition: 'color 0.15s ease-in-out'
                }}
                disabled={isLoading}
                onMouseOver={(e) => ((e.target as HTMLButtonElement).style.color = '#047857')}
                onMouseOut={(e) => ((e.target as HTMLButtonElement).style.color = '#059669')}
              >
                Sign in here
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Add spinner animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SignupForm;