import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchIngredients } from '../../backend/api/api'; // Fetch ingredients for the logged-in user
import styles from '../../styles/styles';

export default function RecipeScreen() {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadIngredients();
  }, []);

  // Fetch user ingredients from the database
  const loadIngredients = async () => {
    try {
      const data = await fetchIngredients(); // Replace with your API call
      setIngredients(data);
      if (data.length > 0) {
        fetchRecipes(data); // Fetch recipes based on ingredients
      } else {
        setError('No ingredients found. Please add some to your pantry.');
      }
    } catch (err) {
      console.error('Failed to load ingredients:', err);
      setError('Failed to load ingredients. Please try again.');
    }
  };

  // Fetch recipes using an external API
  const fetchRecipes = async (ingredients) => {
    try {
      const ingredientList = ingredients.map((item) => item.name).join(','); // Format as a comma-separated string
      const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&number=10&apiKey=YOUR_API_KEY`);
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render each recipe in the list
  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => alert(`Selected: ${item.title}`)}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeDetails}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeCookTime}>Cook Time: {item.readyInMinutes} mins</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8D3F3B" />
        <Text>Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadIngredients}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
