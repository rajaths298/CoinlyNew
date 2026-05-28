import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import type { SignupProfile } from '../types/onboarding';

type Props = {
  aiHeaderButton?: React.ReactNode;
  onBack: () => void;
  onComplete: (profile: SignupProfile) => void;
};

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
};

export default function SignupScreen({ aiHeaderButton, onBack, onComplete }: Props) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    BebasNeue_400Regular,
  });
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  if (!fontsLoaded) return null;

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

    if (!form.name.trim()) nextErrors.name = 'Enter your name.';
    if (!form.email.trim()) nextErrors.email = 'Enter your email.';
    else if (!emailIsValid) nextErrors.email = 'Use a valid email.';
    if (!form.password) nextErrors.password = 'Create a password.';
    else if (form.password.length < 6) nextErrors.password = 'Use at least 6 characters.';
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Confirm your password.';
    else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!form.acceptedTerms) nextErrors.acceptedTerms = 'Accept the terms to continue.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onComplete({
      name: form.name.trim(),
      email: form.email.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.75}>
            <Text style={styles.headerAction}>BACK</Text>
          </TouchableOpacity>
          <Text style={styles.wordmark}>Coinly</Text>
          <View style={styles.headerRightActions}>
            <Text style={styles.headerAction}>SAVE</Text>
            {aiHeaderButton}
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>SIGN UP</Text>
          <Text style={styles.title}>Save your Coinly setup</Text>
          <Text style={styles.body}>
            Create your account so your quiz picks can become a personalized dashboard.
          </Text>
        </View>

        <View style={styles.form}>
          <Field
            label="Name"
            value={form.name}
            error={errors.name}
            onChangeText={(value) => updateField('name', value)}
            autoCapitalize="words"
            textContentType="name"
          />
          <Field
            label="Email"
            value={form.email}
            error={errors.email}
            onChangeText={(value) => updateField('email', value)}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <Field
            label="Password"
            value={form.password}
            error={errors.password}
            onChangeText={(value) => updateField('password', value)}
            secureTextEntry
            textContentType="newPassword"
          />
          <Field
            label="Confirm Password"
            value={form.confirmPassword}
            error={errors.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            secureTextEntry
            textContentType="newPassword"
          />

          <TouchableOpacity
            style={styles.termsRow}
            activeOpacity={0.78}
            onPress={() => updateField('acceptedTerms', !form.acceptedTerms)}
          >
            <View style={[styles.checkbox, form.acceptedTerms && styles.checkboxSelected]}>
              {form.acceptedTerms ? <Text style={styles.checkboxMark}>X</Text> : null}
            </View>
            <Text style={styles.termsText}>I agree to Coinly's terms and privacy policy.</Text>
          </TouchableOpacity>
          {errors.acceptedTerms ? <Text style={styles.errorText}>{errors.acceptedTerms}</Text> : null}
        </View>

        <TouchableOpacity style={styles.submitButton} activeOpacity={0.86} onPress={submit}>
          <Text style={styles.submitText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  error?: string;
  onChangeText: (value: string) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  secureTextEntry?: boolean;
  textContentType?: 'name' | 'emailAddress' | 'newPassword';
};

function Field({
  label,
  value,
  error,
  onChangeText,
  autoCapitalize,
  keyboardType,
  secureTextEntry,
  textContentType,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="rgba(0, 0, 0, 0.42)"
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        textContentType={textContentType}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.green,
  },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerAction: {
    width: 58,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  headerRightActions: {
    minWidth: 170,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  wordmark: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 30,
    includeFontPadding: false,
  },
  hero: {
    marginTop: 54,
  },
  eyebrow: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  title: {
    marginTop: 12,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 44,
    lineHeight: 49,
    includeFontPadding: false,
  },
  body: {
    marginTop: 18,
    color: colors.black,
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    marginTop: 34,
    gap: 15,
  },
  field: {
    gap: 7,
  },
  fieldLabel: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  input: {
    minHeight: 54,
    borderWidth: 2,
    borderColor: colors.black,
    paddingHorizontal: 16,
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
  },
  inputError: {
    borderColor: '#7A1212',
  },
  errorText: {
    color: '#7A1212',
    fontSize: 13,
    fontWeight: '700',
  },
  termsRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.black,
  },
  checkboxMark: {
    color: colors.yellow,
    fontSize: 18,
    fontWeight: '900',
  },
  termsText: {
    flex: 1,
    color: colors.black,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  submitButton: {
    marginTop: 30,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 28,
  },
  submitText: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 23,
  },
});
