import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';
import { X, User, Lock, Eye, EyeOff, Mail } from 'lucide-react';

function AuthModal({ mode, onClose, onSuccess, onSwitchMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const isSignUp = mode === 'signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (needsConfirmation) {
        // Handle email confirmation
        // console.log('Attempting email confirmation for:', username);
        await confirmSignUp({
          username,
          confirmationCode
        });
        
        setError('Email verified successfully! You can now sign in.');
        setNeedsConfirmation(false);
        onSwitchMode('signin');
        
      } else if (isSignUp) {
        // console.log('Attempting signup with:', { username, email });
        
        const result = await signUp({
          username,
          password,
          options: {
            userAttributes: {
              email: email
            }
          }
        });
        
        // console.log('Signup result:', result);
        
        if (result.isSignUpComplete) {
          setError('Account created successfully! Signing you in...');
          setTimeout(async () => {
            try {
              const signInResult = await signIn({ username, password });
            //   console.log('Auto sign-in successful:', signInResult);
              onSuccess();
            } catch (signInError) {
              console.error('Auto sign-in failed:', signInError);
              onSwitchMode('signin');
              setError('Account created! Please sign in manually.');
            }
          }, 1000);
        } else if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
          setError('Please check your email and enter the verification code below.');
          setNeedsConfirmation(true);
        } else {
          setError('Account created! Please sign in.');
          onSwitchMode('signin');
        }
      } else {
        // console.log('Attempting signin with:', { username });
        const result = await signIn({ username, password });
        // console.log('Signin result:', result);
        
        if (result.isSignedIn) {
          onSuccess();
        } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
          setError('Please verify your email first. Enter your verification code below.');
          setNeedsConfirmation(true);
        } else {
          setError('Sign in incomplete. Please try again.');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      let errorMessage = 'Authentication failed';
      
      if (error.name === 'UsernameExistsException') {
        errorMessage = 'Username already exists. Try a different username.';
      } else if (error.name === 'InvalidPasswordException') {
        errorMessage = 'Password must be at least 8 characters long.';
      } else if (error.name === 'UserNotFoundException') {
        errorMessage = 'User not found. Please check your username.';
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Incorrect username or password.';
      } else if (error.name === 'UserNotConfirmedException') {
        setError('Please verify your email first. Enter your verification code below.');
        setNeedsConfirmation(true);
        return;
      } else if (error.name === 'CodeMismatchException') {
        errorMessage = 'Invalid verification code. Please check and try again.';
      } else if (error.name === 'ExpiredCodeException') {
        errorMessage = 'Verification code expired. Please request a new one.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md border border-gray-700 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {needsConfirmation 
              ? 'Verify Your Email' 
              : (isSignUp ? 'Create your account' : 'Sign into your account')
            }
          </h2>
          <p className="text-gray-400 text-sm">
            {needsConfirmation 
              ? 'Enter the verification code sent to your email' 
              : (isSignUp ? 'Start sharing your music today' : 'Welcome back to SoundWave')
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4 text-sm">
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {needsConfirmation ? (
            /* Confirmation Code Input */
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
              </div>
              
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Enter verification code"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
              </div>
            </>
          ) : (
            <>
              {/* Username */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Email (Sign Up Only) */}
              {isSignUp && (
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password (min 8 characters)"
                  required
                  minLength="8"
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-gray-900 rounded font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? 'Loading...' 
              : needsConfirmation 
                ? 'Verify Email' 
                : (isSignUp ? 'Create account' : 'Sign in')
            }
          </button>
        </form>

        {/* Divider - Only show when not in confirmation mode */}
        {!needsConfirmation && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="px-3 text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>

            {/* Social Login */}
            <button 
              type="button"
              onClick={() => setError('Google sign-in not implemented yet')}
              className="w-full py-3 bg-gray-700 text-white border border-gray-600 rounded hover:bg-gray-600 flex items-center justify-center gap-2 mb-4"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        {/* Toggle Sign In/Up - Only show when not in confirmation mode */}
        {!needsConfirmation && (
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => onSwitchMode(isSignUp ? 'signin' : 'signup')}
                className="text-white underline hover:text-gray-300"
              >
                {isSignUp ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;