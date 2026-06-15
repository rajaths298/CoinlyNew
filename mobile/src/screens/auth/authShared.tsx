import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { appColors as c } from '../../theme';

/** Shared font loader for the auth screens. */
export function useAuthFonts() {
  const [loaded] = useFonts({ PlayfairDisplay_700Bold, BebasNeue_400Regular });
  return loaded;
}

type FieldProps = TextInputProps & { label: string; error?: string };

/** Labeled text input with inline error, matching the app's bordered card look. */
export function Field({ label, error, style, ...rest }: FieldProps) {
  return (
    <View style={authStyles.field}>
      <Text style={authStyles.label}>{label}</Text>
      <TextInput
        style={[authStyles.input, error ? authStyles.inputError : null, style]}
        placeholderTextColor="rgba(16,36,29,0.4)"
        {...rest}
      />
      {error ? <Text style={authStyles.fieldError}>{error}</Text> : null}
    </View>
  );
}

export const authStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.green },
  content: { paddingHorizontal: 28, flexGrow: 1 },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  back: { color: c.muted, fontFamily: 'BebasNeue_400Regular', fontSize: 18, marginBottom: 8 },
  eyebrow: { color: c.muted, fontFamily: 'BebasNeue_400Regular', fontSize: 20, textAlign: 'center' },
  wordmark: { color: c.black, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 68, textAlign: 'center', includeFontPadding: false },
  tagline: { marginTop: 10, color: c.black, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, textAlign: 'center' },
  title: { color: c.black, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 40, lineHeight: 44 },
  subtitle: { marginTop: 8, marginBottom: 22, color: c.muted, fontSize: 15, lineHeight: 21, fontWeight: '600' },
  body: { marginTop: 12, color: c.muted, fontSize: 15, lineHeight: 22, fontWeight: '600', textAlign: 'center' },
  field: { marginBottom: 14 },
  label: { color: c.muted, fontFamily: 'BebasNeue_400Regular', fontSize: 15, marginBottom: 6 },
  input: {
    minHeight: 52,
    borderWidth: 2,
    borderColor: c.black,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: c.white,
    color: c.black,
    fontSize: 16,
    fontWeight: '700',
  },
  inputError: { borderColor: c.negative },
  fieldError: { marginTop: 5, color: c.negative, fontSize: 13, fontWeight: '700' },
  formError: {
    marginTop: 4,
    marginBottom: 12,
    color: c.negative,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
  },
  notice: {
    marginTop: 4,
    marginBottom: 12,
    color: c.positive,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
  },
  primaryButton: {
    marginTop: 6,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.yellow,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: c.black,
  },
  primaryButtonText: { color: c.buttonText, fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
  secondaryButton: {
    marginTop: 14,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.white,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: c.black,
  },
  secondaryButtonText: { color: c.black, fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
  buttonDisabled: { opacity: 0.6 },
  linkButton: { marginTop: 18, alignItems: 'center' },
  linkText: { color: c.muted, fontSize: 14, fontWeight: '600' },
  linkStrong: { color: c.black, fontWeight: '900' },
  forgot: { marginTop: 12, alignSelf: 'flex-end' },
  forgotText: { color: c.muted, fontFamily: 'BebasNeue_400Regular', fontSize: 16 },
});
