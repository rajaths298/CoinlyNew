import React, { useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  View,
} from 'react-native';
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSizes } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const REFERENCE_WIDTH = 648;
const REFERENCE_HEIGHT = 1140;
const designWidth = Math.min(SCREEN_WIDTH, REFERENCE_WIDTH);
const scale = Math.min(designWidth / REFERENCE_WIDTH, SCREEN_HEIGHT / REFERENCE_HEIGHT);

type Props = {
  aiHeaderButton?: React.ReactNode;
  onGetStarted: () => void;
  onLogIn: () => void;
  onDevSkip?: (target: 'dashboard' | 'lesson') => void;
};

export default function StartScreen({ aiHeaderButton, onGetStarted, onLogIn, onDevSkip }: Props) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    BebasNeue_400Regular,
  });
  const [devCode, setDevCode] = useState('');
  const [showDevCode, setShowDevCode] = useState(false);
  const devInputRef = useRef<TextInput>(null);

  if (!fontsLoaded) return null;

  const handleDevCodeChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/\s/g, '').slice(-3);
    setDevCode(normalized);

    if (normalized === '10g') {
      setDevCode('');
      onDevSkip?.('dashboard');
    }

    if (normalized === '10l') {
      setDevCode('');
      onDevSkip?.('lesson');
    }
  };

  const openDevCode = () => {
    // Dev-only escape hatch: only available when the host wires onDevSkip (gated
    // behind __DEV__ in App.tsx), so it never opens in a production build.
    if (!onDevSkip) return;
    setShowDevCode(true);
    setTimeout(() => devInputRef.current?.focus(), 60);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden backgroundColor={colors.green} />

      <Text style={[styles.welcomeLabel, { top: insets.top + 16 * scale }]}>
        WELCOME TO
      </Text>
      {aiHeaderButton ? (
        <View style={[styles.aiHeaderSlot, { top: insets.top + 12 }]}>
          {aiHeaderButton}
        </View>
      ) : null}

      <View style={styles.centerBlock}>
        <TouchableOpacity
          activeOpacity={0.95}
          onLongPress={openDevCode}
          onPress={openDevCode}
        >
          <Text style={styles.wordmark}>Coinly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={onGetStarted}
          activeOpacity={0.85}
        >
          <Text style={styles.getStartedText}>GET STARTED</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogIn} activeOpacity={0.7}>
          <Text style={styles.logInText}>LOG IN</Text>
        </TouchableOpacity>
      </View>

      {showDevCode ? (
        <View style={[styles.devCodePanel, { bottom: insets.bottom + 24 }]}>
          <Text style={styles.devCodeLabel}>DEV CODE</Text>
          <TextInput
            ref={devInputRef}
            value={devCode}
            onChangeText={handleDevCodeChange}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            placeholder="10g or 10l"
            placeholderTextColor="rgba(0, 0, 0, 0.45)"
            style={styles.devCodeInput}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green,
  },
  devCodePanel: {
    position: 'absolute',
    left: 40,
    right: 40,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.yellow,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  devCodeLabel: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  devCodeInput: {
    marginTop: 4,
    color: colors.black,
    fontSize: 18,
    fontWeight: '800',
    padding: 0,
  },
  welcomeLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: fontSizes.label * scale,
    includeFontPadding: false,
  },
  aiHeaderSlot: {
    position: 'absolute',
    right: 20,
    zIndex: 5,
  },
  centerBlock: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.389,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  wordmark: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: fontSizes.display * scale,
    color: colors.black,
    lineHeight: fontSizes.display * scale * 1.02,
    includeFontPadding: false,
  },
  getStartedButton: {
    backgroundColor: colors.yellow,
    borderRadius: 25 * scale,
    height: 50 * scale,
    width: 245 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 66 * scale,
  },
  getStartedText: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: fontSizes.button * scale,
    includeFontPadding: false,
  },
  logInText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: fontSizes.label * scale,
    includeFontPadding: false,
    marginTop: 27 * scale,
  },
});
