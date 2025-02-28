import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Text, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import styles from '../../styles/styles';
import { fetchIngredients, updateIngredientQuantity, addIngredient } from '../../backend/api/api';

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
};

export default function TabTwoScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const data = await fetchIngredients();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError('Failed to load inventory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadInventory().then(() => setRefreshing(false));
  }, []);

  const adjustQuantity = async (id: string, amount: number) => {
    try {
      const updatedItem = await updateIngredientQuantity(id, amount);
      setInventory(prevInventory =>
        prevInventory.map(item =>
          item.id === id ? updatedItem : item
        ).filter(item => item.quantity > 0)
      );
    } catch (err) {
      setError('Failed to update quantity. Please try again.');
    }
  };

  const addNewItem = async () => {
    if (newItemName.trim()) {
      try {
        const newItem = await addIngredient(newItemName.trim());
        setInventory(prev => [...prev, newItem]);
        setNewItemName('');
      } catch (err) {
        setError('Failed to add new item. Please try again.');
      }
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name} - Quantity: {item.quantity}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={() => adjustQuantity(item.id, -1)}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quantityButton} onPress={() => adjustQuantity(item.id, 1)}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.containerPantryTab}>
        <ActivityIndicator size="large" color="#0000ff" />
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
      <Text style={styles.title}>Inventory</Text>
      
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search inventory"
      />

      <FlatList
        data={filteredInventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.input}
          value={newItemName}
          onChangeText={setNewItemName}
          placeholder="Add new item"
        />
        <TouchableOpacity style={styles.addButton} onPress={addNewItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
