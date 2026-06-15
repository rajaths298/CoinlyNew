import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Field, authStyles as s, useAuthFonts } from './authShared';
import { useAuth } from '../../contexts/AuthContext';

type Props = {
  onBack: () => void;
  onSignUpLink: () => void;
};

type Errors = { email?: string; password?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInScreen({ onBack, onSignUpLink }: Props) {
  const insets = useSafeAreaInsets();
  const fontsLoaded = useAuthFonts();
  const { signIn, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);

  if (!fontsLoaded) return null;

  const validate = () => {
    const next: Errors = {};
    if (!email.trim()) next.email = 'Enter your email.';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Use a valid email.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setFormError(null);
    setNotice(null);
    if (submitting || !validate()) return;
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) setFormError(error);
    // On success the auth gate swaps to the main app automatically.
  };

  const handleForgot = async () => {
    setFormError(null);
    setNotice(null);
    if (resetting) return;
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      setErrors((e) => ({ ...e, email: 'Enter your email above first.' }));
      return;
    }
    setResetting(true);
    const { error } = await resetPassword(email);
    setResetting(false);
    if (error) setFormError(error);
    else setNotice('If that email has an account, a reset link is on its way.');
  };

  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[s.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Text style={s.back}>BACK</Text>
        </TouchableOpacity>
        <Text style={s.title}>Welcome back</Text>
        <Text style={s.subtitle}>Sign in to pick up where you left off.</Text>

        <Field
          label="EMAIL"
          value={email}
          onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          returnKeyType="next"
        />
        <Field
          label="PASSWORD"
          value={password}
          onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <TouchableOpacity style={s.forgot} activeOpacity={0.7} onPress={handleForgot} disabled={resetting}>
          <Text style={s.forgotText}>{resetting ? 'SENDING...' : 'FORGOT PASSWORD?'}</Text>
        </TouchableOpacity>

        {formError ? <Text style={s.formError}>{formError}</Text> : null}
        {notice ? <Text style={s.notice}>{notice}</Text> : null}

        <TouchableOpacity
          style={[s.primaryButton, submitting && s.buttonDisabled]}
          activeOpacity={0.86}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color={s.primaryButtonText.color} /> : <Text style={s.primaryButtonText}>SIGN IN</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={s.linkButton} activeOpacity={0.7} onPress={onSignUpLink}>
          <Text style={s.linkText}>New here? <Text style={s.linkStrong}>Create an account</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
