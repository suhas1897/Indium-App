import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { Ionicons } from "@expo/vector-icons";
import AppTextInput from "../components/AppTextInput";
import axios from "axios";
import { useUser } from "../contexts/UserContext"; // Import the useUser hook

const LoginScreen = ({ navigation }) => {
  const { setUser } = useUser(); // Destructure setUser from the user context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if user data is saved in AsyncStorage
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          navigation.navigate('DashboardScreen'); // Adjust this as per your navigation setup
        }
      } catch (error) {
        console.log('Error retrieving user data:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }
  
    try {
      const response = await axios.post('http://172.22.169.248:5001/login', { email, password });
      const data = response.data;
  
      if (data.status === 'success') {
        const { sessionId } = data; // Extract sessionId from response data
        const userData = { email, sessionId };
        setUser(userData); // Store sessionId in user context
        await AsyncStorage.setItem('user', JSON.stringify(userData)); // Save user data in AsyncStorage
        Alert.alert('Success', 'Login successful');
        navigation.navigate('DashboardScreen'); // Adjust this as per your navigation setup
      } else {
        Alert.alert('Error', data.data);
      }
    } catch (error) {
      console.log('Error:', error.message);
      Alert.alert('Error', 'Something went wrong: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Login here</Text>
            <Text style={styles.subtitle}>Welcome back, you've been missed!</Text>
          </View>
          <View style={styles.inputContainer}>
            <AppTextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <AppTextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPasswordScreen")}
          >
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.link}>
            <Text style={styles.linkText}>Create new account</Text>
          </TouchableOpacity>
          <View style={styles.socialContainer}>
            <Text style={styles.socialText}>Or continue with</Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-google" color={Colors.text} size={Spacing * 2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-apple" color={Colors.text} size={Spacing * 2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-facebook" color={Colors.text} size={Spacing * 2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing * 2,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: Spacing * 3,
  },
  title: {
    fontSize: FontSize.xLarge,
    color: '#5618db',
    fontFamily: Font["poppins-bold"],
    marginBottom: Spacing,
    top: 29,
  },
  subtitle: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.large,
    maxWidth: "60%",
    textAlign: "center",
    top: 35,
  },
  inputContainer: {
    marginVertical: Spacing * 3,
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
    color: '#5618db',
  },
  button: {
    padding: Spacing * 2,
    backgroundColor: '#5618db',
    marginVertical: Spacing * 3,
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  buttonText: {
    fontFamily: Font["poppins-bold"],
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: FontSize.large,
  },
  link: {
    padding: Spacing,
  },
  linkText: {
    fontFamily: Font["poppins-semiBold"],
    color: Colors.text,
    textAlign: "center",
    fontSize: FontSize.small,
  },
  socialContainer: {
    marginVertical: Spacing * 3,
    alignItems: "center",
  },
  socialText: {
    fontFamily: Font["poppins-semiBold"],
    color: '#5618db',
    textAlign: "center",
    fontSize: FontSize.small,
  },
  socialIcons: {
    marginTop: Spacing,
    flexDirection: "row",
    justifyContent: "center",
  },
  socialIcon: {
    padding: Spacing,
    backgroundColor: Colors.gray,
    borderRadius: Spacing / 2,
    marginHorizontal: Spacing,
  },
});

export default LoginScreen;
