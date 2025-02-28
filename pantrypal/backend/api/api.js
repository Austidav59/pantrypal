// services/api.js
import axios from 'axios';

const API_URL = 'your-api-url';

export const fetchIngredients = async () => {
  const response = await axios.get(`${API_URL}/ingredients`);
  return response.data;
};

export const updateIngredientQuantity = async (id, amount) => {
  const response = await axios.patch(`${API_URL}/ingredients/${id}`, { amount });
  return response.data;
};

export const addIngredient = async (name, amount) => {
  const response = await axios.post(`${API_URL}/ingredients`, { name, amount });
  return response.data;
}
