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
  onSignInLink: () => void;
};

type Errors = { displayName?: string; email?: string; password?: string; confirm?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen({ onBack, onSignInLink }: Props) {
  const insets = useSafeAreaInsets();
  const fontsLoaded = useAuthFonts();
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  if (!fontsLoaded) return null;

  const clear = (key: keyof Errors) => setErrors((e) => ({ ...e, [key]: undefined }));

  const validate = () => {
    const next: Errors = {};
    if (!displayName.trim()) next.displayName = 'Enter a display name.';
    if (!email.trim()) next.email = 'Enter your email.';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Use a valid email.';
    if (!password) next.password = 'Create a password.';
    else if (password.length < 8) next.password = 'Use at least 8 characters.';
    if (!confirm) next.confirm = 'Confirm your password.';
    else if (confirm !== password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (submitting || !validate()) return;
    setSubmitting(true);
    const { error, needsConfirmation } = await signUp(email, password, displayName);
    setSubmitting(false);
    if (error) {
      setFormError(error);
      return;
    }
    if (needsConfirmation) {
      setConfirmSent(true);
      return;
    }
    // A session was created: the auth gate swaps to the main app automatically.
  };

  if (confirmSent) {
    return (
      <View style={[s.screen, s.centerWrap, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Text style={s.title}>Check your email</Text>
        <Text style={s.body}>
          We sent a confirmation link to {email.trim()}. Tap it to finish creating your account, then sign in.
        </Text>
        <View style={{ alignSelf: 'stretch', marginTop: 24 }}>
          <TouchableOpacity style={s.primaryButton} activeOpacity={0.86} onPress={onSignInLink}>
            <Text style={s.primaryButtonText}>GO TO SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <Text style={s.title}>Create account</Text>
        <Text style={s.subtitle}>Start learning money and building wealth.</Text>

        <Field
          label="DISPLAY NAME"
          value={displayName}
          onChangeText={(t) => { setDisplayName(t); clear('displayName'); }}
          error={errors.displayName}
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
        />
        <Field
          label="EMAIL"
          value={email}
          onChangeText={(t) => { setEmail(t); clear('email'); }}
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
          onChangeText={(t) => { setPassword(t); clear('password'); }}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="next"
        />
        <Field
          label="CONFIRM PASSWORD"
          value={confirm}
          onChangeText={(t) => { setConfirm(t); clear('confirm'); }}
          error={errors.confirm}
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {formError ? <Text style={s.formError}>{formError}</Text> : null}

        <TouchableOpacity
          style={[s.primaryButton, submitting && s.buttonDisabled]}
          activeOpacity={0.86}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color={s.primaryButtonText.color} /> : <Text style={s.primaryButtonText}>CREATE ACCOUNT</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={s.linkButton} activeOpacity={0.7} onPress={onSignInLink}>
          <Text style={s.linkText}>Already have an account? <Text style={s.linkStrong}>Sign in</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
