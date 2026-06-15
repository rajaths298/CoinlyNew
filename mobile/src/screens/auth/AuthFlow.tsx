import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

type Mode = 'welcome' | 'signin' | 'signup';

/** Unauthenticated flow: Welcome -> Sign In / Sign Up. */
export default function AuthFlow() {
  const [mode, setMode] = useState<Mode>('welcome');

  if (mode === 'signup') {
    return <SignUpScreen onBack={() => setMode('welcome')} onSignInLink={() => setMode('signin')} />;
  }
  if (mode === 'signin') {
    return <SignInScreen onBack={() => setMode('welcome')} onSignUpLink={() => setMode('signup')} />;
  }
  return <WelcomeScreen onCreateAccount={() => setMode('signup')} onSignIn={() => setMode('signin')} />;
}
