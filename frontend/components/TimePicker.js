import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Font from '../constants/Font';
import FontSize from '../constants/FontSize';
import Colors from '../constants/Colors'; // Import Colors from your file
import Spacing from '../constants/Spacing';
import { Ionicons } from "@expo/vector-icons";

const TimePicker = () => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    // Cleanup code when the component unmounts
    return () => {
      // Cleanup code if needed
    };
  }, []);

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (selectedTime) => {
    setSelectedTime(selectedTime);
    hideTimePicker(); // Hide time picker after selection
    console.log("Selected Time ", selectedTime.toLocaleString());
  };

  return (
    <View>
      <Text
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.subtitle,
          focused && {
            borderWidth: 3,
            borderColor: Colors.primary,
            shadowOffset: { width: 4, height: Spacing },
            shadowColor: Colors.primary,
            shadowOpacity: 0.2,
            shadowRadius: Spacing,
          },
        ]}
      >
        Selected Time: {selectedTime.toLocaleTimeString()}
      </Text>
      <TouchableOpacity onPress={showTimePicker} style={styles.button1}>
      <Ionicons name="time" size={24} color="white" />
        <Text style={styles.buttonText}>Select Time</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.large,
    padding: Spacing * 2,
    width: 'auto',
    backgroundColor: Colors.lightPrimary,
    borderRadius: Spacing,
    marginVertical: Spacing,
  },
  button1: {
    backgroundColor: '#5618db', // Primary color
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, // Adjust marginTop to change the spacing between the text and the button
  },
  buttonText: {
    color: '#ffffff', // White text color
    fontSize: 16,
    fontFamily: Font["poppins-regular"], // Use Font constant
    textAlign: 'center',
  },
});

export default TimePicker;
