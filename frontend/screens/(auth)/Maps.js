import React, { useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AppTextInput from '../../components/AppTextInput';

const HERE_API_KEY = 'HhwkR-_CHkleZcE0YLRf9yWdcP4JTXEMPzDAbVW2gR4';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Maps = () => {
    const navigation = useNavigation();
    const [query, setQuery] = useState('');
    const [markers, setMarkers] = useState([]);
    const [region, setRegion] = useState({
        latitude: 20.5937,
        longitude: 78.9629,
        latitudeDelta: 20.0,
        longitudeDelta: 20.0,
    });
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://geocode.search.hereapi.com/v1/geocode`, {
                params: {
                    q: query,
                    apiKey: HERE_API_KEY,
                },
            });
            const results = response.data.items.map(item => ({
                title: item.title,
                lat: item.position.lat,
                lng: item.position.lng,
                description: item.address.label,
            }));
            setMarkers(results);
            if (results.length > 0) {
                const destination = results[0];
                setRegion({
                    ...region,
                    latitude: destination.lat,
                    longitude: destination.lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
                fetchRoute(destination.lat, destination.lng);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRoute = async (latitude, longitude) => {
        if (!currentLocation) return;

        try {
            const response = await axios.get(`https://router.hereapi.com/v8/routes`, {
                params: {
                    transportMode: 'car',
                    origin: `${currentLocation.latitude},${currentLocation.longitude}`,
                    destination: `${latitude},${longitude}`,
                    return: 'polyline,summary,travelSummary',
                    apiKey: HERE_API_KEY,
                },
            });
            const route = response.data.routes[0];
            const coordinates = route.sections[0].polyline.map(point => ({
                latitude: point.latitude,
                longitude: point.longitude,
            }));
            setRouteCoordinates(coordinates);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={MapView.PROVIDER_DEFAULT}
                showsUserLocation
                showsMyLocationButton
                region={region}
                onRegionChangeComplete={setRegion}
                onUserLocationChange={(event) => {
                    setCurrentLocation(event.nativeEvent.coordinate);
                }}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: marker.lat, longitude: marker.lng }}
                        title={marker.title}
                        description={marker.description}
                    />
                ))}
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeWidth={4}
                        strokeColor="red"
                    />
                )}
            </MapView>

            {/* Search Input and Button */}
            <View style={styles.searchContainer}>
                <AppTextInput
                    style={styles.input}
                    placeholder="Search"
                    value={query}
                    onChangeText={setQuery}
                />
                <TouchableOpacity onPress={handleSearch} style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center' }}>Search</Text>
                </TouchableOpacity>
            </View>

            {/* Button to navigate back to the DashboardScreen */}
            <TouchableOpacity onPress={() => navigation.navigate("DashboardScreen")} style={styles.button}>
                <Ionicons name="caret-back-circle-sharp" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    searchContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 10,
        padding: 5,
        borderRadius: 5,
    },
    button: {
        position: 'absolute',
        top: 100,
        left: 20,
        backgroundColor: '#5618db',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    weatherContainer: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
});

export default Maps;
