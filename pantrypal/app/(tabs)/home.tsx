import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles/styles';

export default function TabOneScreen() {
  return (
    <LinearGradient
      colors={["#B6655C", "#A0524D", "#8D3F3B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.title}>PantryPal</Text>
        <Text style={styles.subtitle}>Smartly manage your pantry with ease</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Inventory</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Find Recipes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
