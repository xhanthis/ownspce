import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.message}>{this.state.error?.message}</Text>
            <Text style={styles.stack}>{this.state.error?.stack}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', padding: 32 },
  title: { fontSize: 20, fontWeight: '700', color: '#EF4444', marginBottom: 16 },
  scroll: { maxHeight: 300, marginBottom: 24 },
  message: { fontSize: 14, color: '#F5F5F5', marginBottom: 12 },
  stack: { fontSize: 11, color: '#6B6B6B', fontFamily: 'Courier' },
  button: { backgroundColor: '#F5F5F5', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontSize: 14, fontWeight: '600', color: '#0A0A0A' },
});
