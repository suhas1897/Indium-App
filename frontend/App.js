import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { UserProvider } from './contexts/UserContext'; // Adjust the import path as needed
import fonts from './config/fonts';
import Navigation from './navigation'; // Your custom navigation component

const App = () => {
  const [fontsLoaded] = useFonts(fonts);

  return !fontsLoaded ? null : (
    <UserProvider>
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    </UserProvider>
   
  )
};

export default App;



