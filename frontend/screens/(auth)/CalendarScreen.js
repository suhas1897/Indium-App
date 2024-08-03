import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Calendar, Agenda } from 'react-native-calendars';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';
import AppTextInput from '../../components/AppTextInput';

const CalendarScreen = ({ navigation }) => {
  const { user } = useUser();
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [eventText, setEventText] = useState('');
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://172.22.172.33:5001/events?email=${user.email}`);
      const data = response.data;
      if (data.status === 'success') {
        setEvents(data.events);
      } else {
        Alert.alert('Error', data.data);
      }
    } catch (error) {
      console.log('Error fetching events:', error.message);
      Alert.alert('Error', 'Something went wrong: ' + error.message);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
    setEventText('');
    setCurrentEvent(null);
  };

  const handleSaveEvent = async () => {
    try {
      const event = { date: selectedDate, text: eventText, email: user.email };
      const response = await axios.post('http://172.22.169.248:5001/event', event);
      const data = response.data;

      if (data.status === 'success') {
        fetchEvents();
        setModalVisible(false);
        Alert.alert('Success', 'Event saved successfully');
      } else {
        Alert.alert('Error', data.data);
      }
    } catch (error) {
      console.log('Error saving event:', error.message);
      Alert.alert('Error', 'Something went wrong: ' + error.message);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await axios.delete(`http://172.22.169.248:5001/event/${currentEvent._id}`);
      const data = response.data;

      if (data.status === 'success') {
        fetchEvents();
        setModalVisible(false);
        Alert.alert('Success', 'Event deleted successfully');
      } else {
        Alert.alert('Error', data.data);
      }
    } catch (error) {
      console.log('Error deleting event:', error.message);
      Alert.alert('Error', 'Something went wrong: ' + error.message);
    }
  };

  const renderItem = (item) => (
    <View style={styles.eventItem}>
      <Text>{item.text}</Text>
      <TouchableOpacity onPress={() => handleEventEdit(item)}>
        <Text style={styles.editButton}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const handleEventEdit = (event) => {
    setSelectedDate(event.date);
    setEventText(event.text);
    setCurrentEvent(event);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        items={events}
        selected={selectedDate}
        renderItem={renderItem}
        onDayPress={handleDayPress}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <AppTextInput
            style={styles.input}
            placeholder="Event"
            value={eventText}
            onChangeText={setEventText}
          />
          <TouchableOpacity onPress={handleSaveEvent} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>{currentEvent ? 'Update' : 'Save'}</Text>
          </TouchableOpacity>
          {currentEvent && (
            <TouchableOpacity onPress={handleDeleteEvent} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 50,
    paddingVertical: 20,
    marginBottom: 10,
    borderRadius: 10
  },
  saveButtonText: {
    color: 'white',
    fontSize: 20
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: 'white',
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: 'blue',
  },
  eventItem: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    color: 'blue',
  },
});

export default CalendarScreen;