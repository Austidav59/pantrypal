import React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/index'; // Import your styles

type InventoryItem = {
  id: string;
  item: string;
  quantity: number;
};

const inventoryData: InventoryItem[] = [
  { id: '1', item: 'Pasta', quantity: 2 },
  { id: '2', item: 'Tomato Sauce', quantity: 1 },
  { id: '3', item: 'Olive Oil', quantity: 1 },
];

export default function TabTwoScreen() {
  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.item} - Quantity: {item.quantity}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  

  return (
    <View style={styles.containerPantryTab}>
      <Text style={styles.title}>Pantry Inventory</Text>
      <FlatList
        data={inventoryData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}
