import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MapSearch = ({ onLocationSelect }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationText, setLocationText] = useState('');
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setCurrentLocation({ latitude, longitude });
      
      // Reverse geocode to get address
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverseGeocode && reverseGeocode.length > 0) {
          const address = `${reverseGeocode[0].name || ''} ${reverseGeocode[0].street || ''}, ${reverseGeocode[0].city || ''}, ${reverseGeocode[0].region || ''}, ${reverseGeocode[0].postalCode || ''}`.trim();
          setLocationText(address);
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      }
    })();
  }, []);

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      onLocationSelect(currentLocation);
    } else {
      Alert.alert('Error', 'Current location not available');
    }
  };
  
  const handleSelectManualLocation = () => {
    // For simplicity, we'll use a default location if user wants to manually select
    // In a real app, you might have a more advanced UI for manual selection
    Alert.alert(
      'Manual Location',
      'In a real app, you would have a UI to select a location manually. Using current location for demo.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Use Current', onPress: handleUseCurrentLocation }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>Select Location</Text>
      
      <View style={styles.locationDisplay}>
        <Text style={styles.locationLabel}>Current Location:</Text>
        <Text style={styles.coordinatesText}>
          {currentLocation 
            ? `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}` 
            : 'Fetching...'}
        </Text>
        {locationText ? <Text style={styles.addressText}>{locationText}</Text> : null}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.useCurrentButton]} onPress={handleUseCurrentLocation}>
          <Text style={styles.buttonText}>Use Current Location</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.manualButton]} onPress={handleSelectManualLocation}>
          <Text style={styles.buttonText}>Select Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  locationDisplay: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  locationLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  coordinatesText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  useCurrentButton: {
    backgroundColor: '#4CAF50',
  },
  manualButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapSearch;