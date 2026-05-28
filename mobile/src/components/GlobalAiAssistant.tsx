import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appColors as colors } from '../theme';

export type AiChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

type Props = {
  visible: boolean;
  messages: AiChatMessage[];
  input: string;
  isTyping: boolean;
  onChangeInput: (value: string) => void;
  onClose: () => void;
  onSend: () => void;
};

export default function GlobalAiAssistant({
  visible,
  messages,
  input,
  isTyping,
  onChangeInput,
  onClose,
  onSend,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.shell}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
          <View>
            <Text style={styles.eyebrow}>Coinly AI</Text>
            <Text style={styles.title}>Ask anything</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} activeOpacity={0.78} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.history}
          contentContainerStyle={styles.historyContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => {
            const isUser = message.sender === 'user';
            return (
              <View key={message.id} style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>
                  {message.text}
                </Text>
              </View>
            );
          })}
          {isTyping ? (
            <View style={[styles.bubble, styles.aiBubble]}>
              <Text style={[styles.bubbleText, styles.aiText]}>Thinking...</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.inputRow, { paddingBottom: insets.bottom + 14 }]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={onChangeInput}
            placeholder="Ask Coinly AI..."
            placeholderTextColor="rgba(16,36,29,0.42)"
            multiline
            editable={!isTyping}
            onSubmitEditing={onSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, isTyping && styles.sendButtonDisabled]}
            activeOpacity={0.82}
            onPress={onSend}
            disabled={isTyping}
          >
            <Text style={styles.sendText}>{isTyping ? '...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.green,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.black,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '900',
  },
  title: {
    marginTop: 3,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    includeFontPadding: false,
  },
  closeButton: {
    minHeight: 38,
    borderRadius: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  closeText: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  history: {
    flex: 1,
  },
  historyContent: {
    padding: 16,
    gap: 12,
  },
  bubble: {
    maxWidth: '84%',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.16)',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.yellow,
    borderWidth: 1,
    borderColor: colors.black,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 23,
  },
  aiText: {
    color: colors.black,
  },
  userText: {
    color: colors.black,
    fontWeight: '700',
  },
  inputRow: {
    paddingTop: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderTopWidth: 2,
    borderTopColor: colors.black,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 116,
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.24)',
    borderRadius: 8,
    backgroundColor: '#F8F3E7',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.black,
    fontSize: 16,
  },
  sendButton: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  sendButtonDisabled: {
    opacity: 0.54,
  },
  sendText: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
});
