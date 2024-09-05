import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
//import { useUser } from '../../contexts/UserContext'; // Custom hook to access user context
import AppTextInput from '../../components/AppTextInput';
const ContactUsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://172.23.43.84:5001/contact-us', {
        name,
        email,
        message,
      });

      if (response.data.status === 'success') {
        Alert.alert('Success', 'Your message has been sent successfully');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        Alert.alert('Error', response.data.data);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <AppTextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Email:</Text>
      <AppTextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Message:</Text>
      <AppTextInput
        style={[styles.input, styles.textArea]}
        value={message}
        onChangeText={setMessage}
        placeholder="Enter your message"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
    
  },
  textArea: {
    height: 100,
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
});

export default ContactUsScreen;
