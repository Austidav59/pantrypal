import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { testPexelsAPI } from './utils/api';

export default function TestPexelsScreen() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const result = await testPexelsAPI();
      setTestResult(result);
    } catch (error) {
      console.error('Test error:', error);
      setTestResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pexels API Test</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={runTest}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Testing...' : 'Run Test'}
        </Text>
      </TouchableOpacity>

      {testResult && (
        <View style={styles.resultContainer}>
          <Text style={[
            styles.resultText,
            testResult.success ? styles.successText : styles.errorText
          ]}>
            {testResult.success ? '✅ Test Successful!' : '❌ Test Failed'}
          </Text>

          {testResult.error && (
            <Text style={styles.errorText}>{testResult.error}</Text>
          )}

          {testResult.imageUrl && (
            <View style={styles.imageContainer}>
              <Text style={styles.imageLabel}>Test Image:</Text>
              <Image 
                source={{ uri: testResult.imageUrl }}
                style={styles.testImage}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8D3F3B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successText: {
    color: '#27ae60',
  },
  errorText: {
    color: '#e74c3c',
  },
  imageContainer: {
    marginTop: 20,
  },
  imageLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 10,
  },
  testImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
}); 