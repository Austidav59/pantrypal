import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#B6655C", "#A0524D", "#8D3F3B"]} // Gradient from logo
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Image source={require("./assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>PantryPal</Text>
      <Text style={styles.subtitle}>Smartly manage your pantry with ease</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Inventory")}>
        <Text style={styles.buttonText}>View Inventory</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Recipes")}>
        <Text style={styles.buttonText}>Find Recipes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={() => navigation.navigate("SignOut")}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#f5f5f5",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#8D3F3B",
    fontSize: 18,
    fontWeight: "bold",
  },
  signOutButton: {
    marginTop: 20,
    padding: 10,
  },
  signOutText: {
    color: "#ff5252",
    fontSize: 16,
    fontWeight: "bold",
  },
});
