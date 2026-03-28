import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/Input';
import Button from '../../components/Button';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (e: any) {
      setError(e.message ?? 'Invalid credentials');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Text style={styles.title}>ownspce</Text>
        <View style={styles.form}>
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Sign in" onPress={handleLogin} loading={loading} />
        </View>
        <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
          No account? <Text style={styles.linkBold}>Sign up</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  title: { fontSize: 32, fontWeight: '700', color: '#F5F5F5', textAlign: 'center', marginBottom: 48 },
  form: { gap: 16 },
  error: { fontSize: 13, color: '#EF4444' },
  link: { textAlign: 'center', marginTop: 24, color: '#6B6B6B', fontSize: 14 },
  linkBold: { color: '#F5F5F5', fontWeight: '600' },
});
