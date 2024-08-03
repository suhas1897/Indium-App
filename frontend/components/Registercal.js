import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from '../constants/Colors';
import FontSize from '../constants/FontSize';
import Font from '../constants/Font';
import Spacing from '../constants/Spacing';

const DatePicker = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const handleConfirm = (date) => {
    setSelectedDate(date.toLocaleDateString());
    setSelectedYear(date.getFullYear().toString());
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  return (
    <View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {selectedDate !== '' && (
        <View>
          <Text style={styles.selectedText}>Selected Date: {selectedDate}</Text>
        </View>
      )}

      <TouchableOpacity onPress={showDatePicker}>
        <Text style={styles.dateButton}>Select Date</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dateButton: {
    borderWidth: 3,
    borderColor: '#f1f3ff',
    shadowOffset: { width: 4, height: Spacing },
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    padding: Spacing * 2,
    backgroundColor: '#f1f3ff',
    borderRadius: Spacing,
    marginVertical: Spacing,
    width: 345,
    height: 65,
    textAlign: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: Spacing,
  },
  selectedText: {
    borderWidth: 3,
    borderColor: '#f1f3ff',
    shadowOffset: { width: 4, height: Spacing },
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    padding: Spacing * 2,
    backgroundColor: '#f1f3ff',
    borderRadius: Spacing,
    marginVertical: Spacing,
    width: 345,
    textAlign: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: Spacing,
  },
});

export default DatePicker;
