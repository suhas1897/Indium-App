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

const ResetPasswordScreen = ({ navigation, route }) => {
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const email = route.params?.email;

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://172.22.169.248:5001/reset-password', { email, otp, newPassword });
      const data = response.data;

      if (data.status === 'success') {
        Alert.alert('Success', 'Password reset successful');
        navigation.navigate('LoginScreen'); // Adjust this as per your navigation setup
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
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter the OTP and your new password</Text>
          </View>
          <View style={styles.inputContainer}>
            <AppTextInput
              placeholder="OTP"
              value={otp}
              onChangeText={setOTP}
              keyboardType="numeric"
            />
            <AppTextInput
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <AppTextInput
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.link}>
            <Text style={styles.linkText}>Go to Login</Text>
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

export default ResetPasswordScreen;
