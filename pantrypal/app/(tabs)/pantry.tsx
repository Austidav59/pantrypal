import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import styles from '../../styles/styles';
import database from "../../backend/app";

export default function PantryScreen() {
  const [inventory, setInventory] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (inventory.length === 0) {
      setIsModalVisible(true);
    }
  }, []);

  const addNewItem = (itemName = newItemName.trim()) => {
    if (itemName) {
      const newItem = {
        id: Date.now().toString(),
        name: itemName,
        quantity: 1
      };
      setInventory(prev => [...prev, newItem]);
      setNewItemName('');
      setIsModalVisible(false);
      setEditingItem(null);
    }
  };

  const adjustQuantity = (id, amount) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? {...item, quantity: Math.max(0, item.quantity + amount)} : item
    ));
  };

  const deleteItem = (id) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => setInventory(prev => prev.filter(item => item.id !== id)),
          style: "destructive"
        }
      ]
    );
  };

  const editItem = (item) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setIsModalVisible(true);
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

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => editItem(item)}
      >
        <Text style={styles.backTextWhite}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteItem(item.id)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Text style={styles.emptyStateText}>Your pantry is empty.</Text>
          <TouchableOpacity style={styles.addFirstItemButton} onPress={() => setIsModalVisible(true)}>
            <Text style={styles.addFirstItemButtonText}>Add Your First Ingredient</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SwipeListView
          data={filteredInventory}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-120}
          disableRightSwipe
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
        <TouchableOpacity style={styles.addButton} onPress={() => addNewItem()}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setIsModalVisible(false);
          setEditingItem(null);
          setNewItemName('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Ingredient' : 'Add Your First Ingredient'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter ingredient name"
              value={newItemName}
              onChangeText={setNewItemName}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setEditingItem(null);
                  setNewItemName('');
                }}
              >
                <Text style={[styles.modalButtonText, styles.modalCancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalAddButton]}
                onPress={() => addNewItem()}
              >
                <Text style={[styles.modalButtonText, styles.modalAddButtonText]}>
                  {editingItem ? 'Save' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
