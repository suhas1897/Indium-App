import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../constants/Colors';
import Spacing from '../constants/Spacing';
import Font from '../constants/Font';
import FontSize from '../constants/FontSize';
import { Ionicons, FontAwesome6, MaterialIcons } from "@expo/vector-icons";

const ImageColorPicker = () => {
  const [image, setImage] = useState(null);
  const [color, setColor] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }

      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        Alert.alert('Sorry, we need camera permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to launch image picker');
      return;
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      getColor(uri);
    } else {
      Alert.alert('Cancelled', 'Image selection was cancelled');
    }
  };

  const takePhoto = async () => {
    let result;
    try {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to launch camera');
      return;
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      getColor(uri);
    } else {
      Alert.alert('Cancelled', 'Photo capture was cancelled');
    }
  };

  const getColor = async (uri) => {
    setLoading(true);
    let localUri = uri;
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append('photo', { uri: localUri, name: filename, type });

    try {
      const response = await fetch('http://172.22.169.248:5000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
    
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    
      const data = await response.json();
      console.log('Response data:', data); // Log response data for debugging
      setColor(data.color);
      setMatches(data.matches);
    } catch (error) {
      Alert.alert('Error', 'Failed to get color');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }    

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, marginTop: 60 }}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity title="Pick an image from camera roll" onPress={pickImage} style= {styles.button1} >
        {/* <Ionicons name="logo-google" color={Colors.text} size={Spacing * 2} /> */}
        <MaterialIcons name="image-search" size={24} color="white" style  = {styles.imagesearch} />
          <Text
        style={{
          fontFamily: Font["poppins-bold"],
          color: Colors.onPrimary,
          fontSize: FontSize.large,
          textAlign: "center",
        }}
        >Pick an image</Text>
        
        </TouchableOpacity>
        <TouchableOpacity title="Take a Photo" onPress={takePhoto} style= {styles.button2}>
        <MaterialIcons name="camera" size={24} color="white" style  = {styles.imagesearch} />
          <Text
        style={{
          fontFamily: Font["poppins-bold"],
          color: Colors.onPrimary,
          fontSize: FontSize.large,
          textAlign: "center",
        }}
        >Take a Photo</Text></TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginVertical: 20, borderRadius: 15, marginTop: -30 }} />}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {/* {color && (
        <View style={{ marginTop: 20 }}>
          <Text>RGB Value: {color}</Text>
        </View>
      )} */}
      {matches.length > 0 && (
        <ScrollView style={{ marginTop: 20, width: '100%' }}>
          {matches.map((match, index) => (
            <View key={index} style={styles.container}>
              <Text style={styles.title}>Disease: {match['Disease']}</Text>
              <Text style={styles.subtitle}>Hospital Name: {match['Hospital Name']}</Text>
              <Text style={styles.address}>Address: {match.Address}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${match['Contact Number']}`)}>
                <Text style={styles.contact}>Contact Number: {match['Contact Number']}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      {matches.length === 0 && !loading && color && (
        <View style={{ marginTop: 20 }}>
          <Text>No match found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 90,
    gap: 10
  },
  button1: {
    backgroundColor: '#5618db',
    paddingVertical: Spacing * 1.5,
    paddingHorizontal: Spacing * 2,
    width: "48%",
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    bottom: 50,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  imagesearch: {
    textAlign: 'center'

  },
  button2: {
    backgroundColor: '#5618db',
    paddingVertical: Spacing * 1.5,
    paddingHorizontal: Spacing * 2,
    width: "48%",
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    bottom: 50,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  container: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  contact: {
    fontSize: 14,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
})

export default ImageColorPicker;
