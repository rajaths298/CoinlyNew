import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authStyles as s, useAuthFonts } from './authShared';

type Props = {
  onCreateAccount: () => void;
  onSignIn: () => void;
};

export default function WelcomeScreen({ onCreateAccount, onSignIn }: Props) {
  const insets = useSafeAreaInsets();
  const fontsLoaded = useAuthFonts();
  if (!fontsLoaded) return null;

  return (
    <View style={[s.screen, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <View style={s.centerWrap}>
        <Text style={s.eyebrow}>WELCOME TO</Text>
        <Text style={s.wordmark}>Coinly</Text>
        <Text style={s.tagline}>Learn money. Build wealth.</Text>
      </View>
      <View style={{ paddingHorizontal: 28 }}>
        <TouchableOpacity style={s.primaryButton} activeOpacity={0.86} onPress={onCreateAccount}>
          <Text style={s.primaryButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondaryButton} activeOpacity={0.82} onPress={onSignIn}>
          <Text style={s.secondaryButtonText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
