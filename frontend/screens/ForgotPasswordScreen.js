import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Spacing from '../constants/Spacing';
import FontSize from '../constants/FontSize';
import Colors from '../constants/Colors';
import Font from '../constants/Font';
import AppTextInput from '../components/AppTextInput';
import axios from 'axios';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    try {
      const response = await axios.post('http://172.22.169.248:5001/forgot-password', { email });
      const data = response.data;

      if (data.status === 'success') {
        Alert.alert('Success', 'OTP sent to your email');
        navigation.navigate('ResetPasswordScreen', { email }); // Navigate to ResetPasswordScreen with email
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your email to receive an OTP</Text>
          </View>
          <View style={styles.inputContainer}>
            <AppTextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <TouchableOpacity onPress={handleForgotPassword} style={styles.button}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: Spacing * 3,
  },
  title: {
    fontSize: FontSize.xLarge,
    color: '#5618db',
    fontFamily: Font['poppins-bold'],
    marginBottom: Spacing,
  },
  subtitle: {
    fontFamily: Font['poppins-semiBold'],
    fontSize: FontSize.large,
    maxWidth: '60%',
    textAlign: 'center',
  },
  inputContainer: {
    marginVertical: Spacing * 3,
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
    fontFamily: Font['poppins-bold'],
    color: Colors.onPrimary,
    textAlign: 'center',
    fontSize: FontSize.large,
  },
});

export default ForgotPasswordScreen;
