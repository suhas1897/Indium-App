import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import TimePicker from '../../components/TimePicker';
import AppTextInput from '../../components/AppTextInput';
import { useUser } from '../../contexts/UserContext'; // Import the useUser hook
import axios from 'axios';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";

const Spacing = {
  small: 8,
  medium: 16,
  large: 24,
};

const Colors = {
  primary: '#007bff',
  lightGray: '#f0f0f0',
  gray: '#cccccc',
  buttonBackground: '#5618db',
  buttonText: '#ffffff',
};

const FontSize = {
  small: 14,
  medium: 16,
  large: 20,
};

const Font = {
  'poppins-bold': 'Poppins-Bold',
  'poppins-regular': 'Poppins-Regular',
};

const DashboardScreen = ({ navigation }) => {
  const { user } = useUser(); // Access user context
  const [remarks, setRemarks] = useState('');

  const handleSaveRemarks = async () => {
    if (!user || !user.email) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      const response = await axios.post('http://172.22.169.248:5001/save-remarks', { email: user.email, remarks });
      if (response.data.status === 'success') {
        Alert.alert('Success', 'Remarks saved successfully');
      } else {
        Alert.alert('Error', response.data.data);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.text, { fontSize: 25, marginLeft: 15, fontWeight: 'bold', marginTop: 60 }]}>Time</Text>
        <TimePicker />
        
        <View>
          <Text style={[styles.remarksTitle]}>Remarks And Symptoms</Text>
          <AppTextInput
            placeholder="Remarks / Symptoms" 
            value={remarks}
            onChangeText={setRemarks}
            multiline
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSaveRemarks} style={styles.button}>
        <FontAwesome name="medkit" size={24} color="white" />
          <Text style={styles.buttonText}>Save Remarks</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("calendar")} style={styles.button}>
        <FontAwesome name="calendar" size={24} color="white" />
          <Text style={styles.buttonText}>Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ImageColorPicker")} style={styles.button}>
            <Ionicons name="image" size={24} color="white" />
          <Text style={styles.buttonText}>Image Color Picker</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("FeedBack")} style={styles.button}>
          <MaterialIcons name="feedback" size={24} color="white" />
          <Text style={styles.buttonText}>Feedback</Text>
        </TouchableOpacity>

        
      </View>
      <TouchableOpacity onPress={()=> navigation.navigate("Maps")} style={styles.button1}>
          <MaterialCommunityIcons name="google-maps" size={24} color="white" />
          <Text style={styles.buttonText1}>Maps</Text>
        </TouchableOpacity>

      <TouchableOpacity onPress={()=> navigation.navigate("Login")} style={styles.button1}>
          <MaterialIcons name="logout" size={24} color="white" />
          <Text style={styles.buttonText1}>Signout</Text>
      </TouchableOpacity>

  <View style={styles.socialIcons}>
        
        <TouchableOpacity style={styles.socialIcon} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon} onPress={() => navigation.navigate('DashboardScreen')}>
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Ionicons name="chatbox-ellipses" size={24} color="white" onPress={() => navigation.navigate('FeedBack')}/>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.socialIcon}>
          <Ionicons name="log-out" size={24} color="white" onPress={() => navigation.navigate('Login')}/>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.large,
  },
  section: {
    padding: 10,
    marginBottom: Spacing.large,
    borderRadius: 10,
  },
  remarksTitle: {
    bottom: 40,
    top: 10,
    fontSize: 20,
    marginLeft: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  button: {
    backgroundColor: Colors.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: Spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%', // Adjust as needed for spacing between buttons
  },
  buttonText: {
    color: Colors.buttonText,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 50,
  },
  button1: {
    backgroundColor: '#5618db', // Primary color
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, // Adjust marginTop to change the spacing between the text and the button
  },
  buttonText1: {
    color: '#ffffff', // White text color
    fontSize: 16,
    fontFamily: Font["poppins-regular"], // Use Font constant
    textAlign: 'center',
  },
  socialIcons: {
    // position: 'relative',
    alignItems: 'center',
    bottom: 20, // Position it slightly above the bottom edge
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Ensure it spans the width of the screen
    paddingHorizontal: Spacing.small,
    top: 20,
    left: 2
    
  },
  socialIcon: {
    padding: 10,
    backgroundColor: '#5618db',
    borderRadius: 5,
  },
});

export default DashboardScreen;
