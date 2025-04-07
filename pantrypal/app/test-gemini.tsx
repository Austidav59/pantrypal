import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { testGeminiAPI } from './utils/api';

export default function TestGemini() {
  useEffect(() => {
    const runTest = async () => {
      console.log('\n=== Starting Gemini API Test ===\n');
      const result = await testGeminiAPI();
      
      if (result.success) {
        console.log('\n✅ API Test Successful!');
        console.log('\nResponse from Gemini:');
        console.log('------------------------');
        console.log(result.response);
        console.log('------------------------\n');
      } else {
        console.log('\n❌ API Test Failed!');
        console.log('Error:', result.error);
      }
    };
    
    runTest();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Check terminal for test results...</Text>
    </View>
  );
} 