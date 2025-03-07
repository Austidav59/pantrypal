import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchIngredients, addIngredient, updateIngredientQuantity } from '../../backend/api/api';
import styles from '../../styles/styles';

export default function PantryScreen() {
  const [inventory, setInventory] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchIngredients();
      setInventory(data);
      if (data.length === 0) {
        promptForIngredients();
      }
    } catch (error) {
      console.error('Failed to load inventory:', error);
      setError('Failed to load inventory. Please try again.');
      promptForIngredients();
    } finally {
      setIsLoading(false);
    }
  };

  const promptForIngredients = () => {
    Alert.alert(
      "No Ingredients Found",
      "Would you like to add some ingredients to your pantry?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => setNewItemName('') } // Focus on add ingredient input
      ]
    );
  };

  const addNewItem = async () => {
    if (newItemName.trim()) {
      try {
        const newItem = await addIngredient(newItemName.trim());
        setInventory(prev => [...prev, newItem]);
        setNewItemName('');
      } catch (error) {
        console.error('Failed to add new item:', error);
        Alert.alert("Error", "Failed to add new item. Please try again.");
      }
    }
  };

  const adjustQuantity = async (id, amount) => {
    try {
      const updatedItem = await updateIngredientQuantity(id, amount);
      setInventory(prev => prev.map(item => item.id === id ? updatedItem : item));
    } catch (error) {
      console.error('Failed to update quantity:', error);
      Alert.alert("Error", "Failed to update quantity. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={() => adjustQuantity(item.id, -1)}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={() => adjustQuantity(item.id, 1)}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.containerPantryTab}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.containerPantryTab}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadInventory}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.containerPantryTab}>
      <Text style={styles.title}>My Pantry</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search ingredients"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {inventory.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Your pantry is empty. Add some ingredients!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredInventory}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}

      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new item"
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <TouchableOpacity style={styles.addButton} onPress={addNewItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
