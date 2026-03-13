import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';

/**
 * Setup Screen 1 — Captain Name
 * "What should we call you, Captain?"
 */
export default function CaptainNameScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>What should we call you,</Text>
        <Text style={styles.title}>Captain?</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor={Colors.text.muted}
          value={name}
          onChangeText={setName}
          autoFocus
          maxLength={24}
          returnKeyType="next"
          onSubmitEditing={() => name.trim() && router.push('/(onboarding)/first-scan')}
        />

        <Pressable
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          disabled={!name.trim()}
          onPress={() => router.push('/(onboarding)/first-scan')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space.void,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  label: {
    color: Colors.text.secondary,
    fontSize: FontSize.lg,
    fontWeight: '300',
  },
  title: {
    color: Colors.star.gold,
    fontSize: FontSize.hero,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.space.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.text.primary,
    fontSize: FontSize.xl,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Colors.s1.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    color: Colors.text.primary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
