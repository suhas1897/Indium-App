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
import AppTextInput from "../components/AppTextInput";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import axios from "axios";

const VerifyOTPScreen = ({ route, navigation }) => {
  const [otp, setOtp] = useState('');
  const { email } = route.params;

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert('Error', 'OTP is required');
      return;
    }

    try {
      const response = await axios.post('http://172.22.169.248:5001/verify-otp', { email, otp });
      const data = response.data;

      if (data.status === 'success') {
        Alert.alert('Success', data.data);
        navigation.navigate('Login');
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
              <Text style={styles.title}>Verify OTP</Text>
            </View>
            <View style={styles.inputContainer}>
              <AppTextInput
                placeholder="OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
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
});

export default VerifyOTPScreen;
