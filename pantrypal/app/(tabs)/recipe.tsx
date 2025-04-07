import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchIngredients, CreateRecipes } from '../utils/api';
import { API_BASE_URL } from '../utils/config';

interface Ingredient {
  name: string;
  quantity: number;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  readyInMinutes: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  imageUrl?: string;
}

export default function RecipeScreen() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch pantry items
      const pantryItems = await fetchIngredients();
      if (!pantryItems || pantryItems.length === 0) {
        setError('No ingredients found in your pantry. Add some items to get recipe suggestions!');
        return;
      }
      setIngredients(pantryItems);

      // Generate recipes using Gemini
      const generatedRecipes = await CreateRecipes(pantryItems);
      setRecipes(generatedRecipes);
    } catch (err) {
      console.error('Error loading recipes:', err);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleRecipePress = (recipe: Recipe) => {
    router.push({
      pathname: '/recipe-details',
      params: { recipe: JSON.stringify(recipe) }
    });
  };

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => handleRecipePress(item)}
    >
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.recipeImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.recipeContent}>
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <Text style={styles.recipeTime}>{item.readyInMinutes} mins</Text>
        </View>
        <Text style={styles.recipeDescription}>{item.description}</Text>
        <View style={styles.recipeFooter}>
          <Text style={styles.recipeServings}>{item.servings} servings</Text>
          <Text style={styles.recipeCalories}>{item.nutrition.calories} cal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8D3F3B" />
        <Text style={styles.loadingText}>Generating recipes based on your pantry...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadRecipes}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      <Text style={styles.subtitle}>Based on your pantry items</Text>
      <FlatList
        data={recipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  recipeContent: {
    padding: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  recipeTime: {
    fontSize: 14,
    color: '#8D3F3B',
    fontWeight: '600',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeServings: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  recipeCalories: {
    fontSize: 14,
    color: '#8D3F3B',
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#8D3F3B',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
