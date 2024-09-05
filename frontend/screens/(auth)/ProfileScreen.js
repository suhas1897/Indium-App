import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext'; // Custom hook to access user context
import AppTextInput from '../../components/AppTextInput';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
const ProfileScreen = () => {
  const { user, setUser } = useUser(); // Assuming setUser updates the user state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://172.23.43.84:5001/profile?email=${user.email}`);
        if (response.data.status === 'success') {
          setName(response.data.data.name);
          setEmail(response.data.data.email);
          setPhone(response.data.data.phone);
        } else {
          Alert.alert('Error', response.data.data);
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Current password and new password are required');
      return;
    }

    try {
      const response = await axios.post('http://172.23.43.84:5001/change-password', {
        email: user.email,
        currentPassword,
        newPassword,
      });

      if (response.data.status === 'success') {
        Alert.alert('Success', 'Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        Alert.alert('Error', response.data.data);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const handleContactUs = () => {
    navigation.navigate('ContactUs'); // Assuming you have a ContactUs screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.contactUsButton} onPress={handleContactUs}>
          <Icon name="phone" size={24} color="#fff" />
          <Text style={styles.contactUsText}>Contact Us</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Name:</Text>
      <AppTextInput style={styles.input} value={name} onChangeText={setName} editable={false} />

      <Text style={styles.label}>Email:</Text>
      <AppTextInput style={styles.input} value={email} onChangeText={setEmail} editable={false} />

      <Text style={styles.label}>Phone:</Text>
      <AppTextInput style={styles.input} value={phone} onChangeText={setPhone} editable={false} />

      <Text style={styles.label}>Current Password:</Text>
      <AppTextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />

      <Text style={styles.label}>New Password:</Text>
      <AppTextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  contactUsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#5618db',
    borderRadius: 5,
  },
  contactUsText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#5618db',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    color: '000'
  }
});

export default ProfileScreen;
