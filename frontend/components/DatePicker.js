import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

const LiveCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('2024-05-08'); // Initial selected date
  const [selectedYear, setSelectedYear] = useState(2024); // Initial selected year
  const [selectedMonth, setSelectedMonth] = useState(5); // Initial selected month
  const [showYearPicker, setShowYearPicker] = useState(false); // Flag to show year picker

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    console.log('selected day', day);
  };

  const handleMonthChange = (month) => {
    setSelectedYear(parseInt(month.year));
    setSelectedMonth(parseInt(month.month));
    console.log('selected year', month.year);
    console.log('selected month', month.month);
  };

  const renderCalendar = () => {
    if (showYearPicker) {
      return (
        <View style={styles.yearPickerContainer}>
          <Text style={styles.yearPickerTitle}>Select Year</Text>
          {[...Array(10)].map((_, index) => {
            const year = selectedYear - 5 + index;
            return (
              <TouchableOpacity key={index} onPress={() => {
                setSelectedYear(year);
                setShowYearPicker(false);
              }}>
                <Text style={styles.yearPickerText}>{year}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    } else {
      return (
        <Calendar
          // Specify initial date
          current={selectedDate}
          // Specify min and max dates
          minDate={'2022-01-01'}
          maxDate={'2025-12-31'}
          // Handler which gets executed on day press
          onDayPress={handleDayPress}
          // Handler which gets executed when visible month changes in calendar
          onMonthChange={handleMonthChange}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderCalendar()}
      <TouchableOpacity style={styles.yearPickerButton} onPress={() => setShowYearPicker(true)}>
        <Text style={styles.yearPickerButtonText}>Select Year</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  yearPickerContainer: {
    padding: 20,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  yearPickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  yearPickerText: {
    fontSize: 18,
    marginBottom: 5,
  },
  yearPickerButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 10,
    alignSelf: 'center',
  },
  yearPickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LiveCalendar;
