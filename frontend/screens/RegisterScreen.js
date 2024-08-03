import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppTextInput from "../components/AppTextInput";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // In your RegisterScreen component's handleSignUp function
const handleSignUp = async () => {
  if (!name || !email || !phone || !address || !password || !confirm_password) {
    Alert.alert('Error', 'All fields are required');
    return;
  }

  if (!validateEmail(email)) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }

  if (password !== confirm_password) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }

  try {
    console.log('Sending request to the server...');
    const response = await axios.post('http://172.22.169.248:5001/register', {
      name,
      email,
      phone,
      address,
      password,
      confirm_password,
    });

    const data = response.data;
    console.log('Response from server:', data);

    if (data.status === 'success') {
      Alert.alert('Success', 'User registered. Please verify your email.');
      navigation.navigate('VerifyOTPScreen', { email });
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Create account</Text>
            </View>
            <View style={styles.inputContainer}>
              <AppTextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
              />
              <AppTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
              />
              <AppTextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <AppTextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
              />
              <AppTextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <AppTextInput
                placeholder="Confirm Password"
                value={confirm_password}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.link}>
              <Text style={styles.linkText}>Already have an account</Text>
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
      </KeyboardAvoidingView>
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
    flexDirection: 'column'
  },
  title: {
    fontSize: FontSize.xLarge,
    color: '#5618db',
    fontFamily: Font["poppins-bold"],
    marginVertical: Spacing * 3,
    top: 30
  },
  inputContainer: {
    marginVertical: Spacing * 0,
  },
  input: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.small,
    padding: Spacing * 2,
    backgroundColor: Colors.lightPrimary,
    borderRadius: Spacing,
    marginVertical: Spacing,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  button: {
    padding: Spacing * 1,
    backgroundColor: '#5618db',
    marginVertical: Spacing * 1,
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

export default RegisterScreen;
