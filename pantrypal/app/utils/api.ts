import { API_BASE_URL, apiConfig } from './config';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with error checking
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ Gemini API key is not set! Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

// Safe JSON parsing utility
const safeJSONParse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('JSON Parse Error:', e);
    return null;
  }
};

// Generic fetch wrapper with error handling
const fetchWithErrorHandling = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...apiConfig,
      ...options,
      headers: {
        ...apiConfig.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
};

// API functions
export const fetchItems = async () => {
  try {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/items`);
    return response || [];
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

export const addItem = async (item: { name: string; quantity: number }) => {
  try {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

export const deleteItem = async (id: string) => {
  try {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export const updateItem = async (id: string, item: { name: string; quantity: number }) => {
  try {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    return response;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

export const fetchIngredients = async () => {
  try {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/items`);
    return response || [];
  } catch (error) {
    console.error('Error fetching pantry items:', error);
    return [];
  }
};

// Pexels API function
export const fetchRecipeImage = async (recipeTitle: string) => {
  try {
    console.log('\n==========================================');
    console.log(`🔍 Searching for image: "${recipeTitle}"`);
    console.log('==========================================');
    
    const pexelsApiKey = process.env.EXPO_PUBLIC_PEXELS_API_KEY;
    if (!pexelsApiKey) {
      console.error('❌ ERROR: Pexels API key is not set!');
      return null;
    }

    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(recipeTitle)}&per_page=1`;
    console.log('🌐 Request URL:', url);
    console.log('🔑 API Key (first 10 chars):', pexelsApiKey.substring(0, 10) + '...');

    console.log('📤 Sending request to Pexels...');
    const response = await fetch(url, {
      headers: {
        Authorization: pexelsApiKey,
      },
    });

    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ERROR: Pexels API request failed!');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Error Details:', errorText);
      throw new Error('Failed to fetch image from Pexels');
    }

    const data = await response.json();
    console.log('📦 Response Data:', JSON.stringify(data, null, 2));

    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0].src.medium;
      console.log('✅ SUCCESS: Found image!');
      console.log('🖼️ Image URL:', imageUrl);
      console.log('==========================================\n');
      return imageUrl;
    }
    
    console.log('⚠️ WARNING: No images found for:', recipeTitle);
    console.log('==========================================\n');
    return null;
  } catch (error) {
    console.error('❌ ERROR: Failed to fetch recipe image');
    console.error('Error details:', error);
    console.log('==========================================\n');
    return null;
  }
};

// Update CreateRecipes to include image URLs
export const CreateRecipes = async (ingredients: { name: string; quantity: number }[]) => {
  try {
    console.log('\n==========================================');
    console.log('🍳 Starting Recipe Generation');
    console.log('==========================================');
    console.log('📝 Ingredients:', ingredients.map(i => `${i.name} (${i.quantity})`).join(', '));
    
    console.log('\n🤖 Initializing Gemini API...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create a prompt with the ingredients
    const prompt = `Generate 10 recipes that can be made with these ingredients: ${ingredients.map(i => `${i.name} (${i.quantity})`).join(', ')}. 
    Format the response as a JSON array with this exact structure:
    [
      {
        "id": number,
        "title": string,
        "description": string,
        "readyInMinutes": number,
        "servings": number,
        "ingredients": string[],
        "instructions": string[],
        "nutrition": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number
        }
      }
    ]
    Make sure the recipes are practical and can be made with common additional pantry ingredients.
    IMPORTANT: Return ONLY valid JSON, no additional text or explanations.`;

    console.log('📤 Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('\n📥 Raw Gemini response:', text);
    
    // Clean the response text to ensure it's valid JSON
    const cleanedText = text.trim()
      .replace(/```json/g, '')  // Remove markdown code block markers
      .replace(/```/g, '')      // Remove any remaining code block markers
      .replace(/^\s*\[/, '[')   // Ensure it starts with [
      .replace(/\]\s*$/, ']');  // Ensure it ends with ]
    
    console.log('\n🧹 Cleaned response:', cleanedText);
    
    try {
      const recipes = JSON.parse(cleanedText);
      if (!Array.isArray(recipes)) {
        throw new Error('Response is not an array');
      }

      console.log('\n==========================================');
      console.log(`📋 Processing ${recipes.length} Recipes`);
      console.log('==========================================');
      
      // Fetch images for each recipe
      const recipesWithImages = await Promise.all(
        recipes.map(async (recipe, index) => {
          console.log(`\n🍽️ Recipe ${index + 1}/${recipes.length}: "${recipe.title}"`);
          try {
            const imageUrl = await fetchRecipeImage(recipe.title);
            if (imageUrl) {
              console.log('✅ Image successfully added to recipe');
            } else {
              console.log('⚠️ No image found for recipe');
            }
            return {
              ...recipe,
              imageUrl
            };
          } catch (error) {
            console.error(`❌ Error fetching image for recipe "${recipe.title}":`, error);
            return recipe;
          }
        })
      );

      console.log('\n==========================================');
      console.log('🎉 Final Recipes with Images');
      console.log('==========================================');
      recipesWithImages.forEach((recipe, index) => {
        console.log(`\n📖 Recipe ${index + 1}: "${recipe.title}"`);
        console.log('🖼️ Image URL:', recipe.imageUrl || 'No image');
      });
      console.log('\n==========================================\n');

      return recipesWithImages;
    } catch (error) {
      console.error('❌ Error parsing recipes:', error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Error in CreateRecipes:', error);
    throw error;
  }
};

export const fetchRecipes = async () => {
  try {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/recipes`);
    return response || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

