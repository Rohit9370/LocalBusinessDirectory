import { ScrollView, StyleSheet, Text, View } from 'react-native';

const LeafletMap = ({ latitude, longitude, markers = [], height, onMarkerClick }) => {
  return (
    <View style={[styles.container, { height: height || 300 }]}>      
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>Map View</Text>
        <Text style={styles.coordinatesText}>Current Location: {latitude?.toFixed(4)}, {longitude?.toFixed(4)}</Text>
        
        {markers && markers.length > 0 && (
          <View style={styles.markersContainer}>
            <Text style={styles.markersTitle}>Nearby Shops:</Text>
            <ScrollView>
              {markers.map((marker, index) => (
                marker.latitude && marker.longitude && (
                  <View key={index} style={styles.markerItem}>
                    <Text style={styles.markerName} onPress={() => onMarkerClick && onMarkerClick(marker)}>
                      {marker.name || 'Shop'}
                    </Text>
                    <Text style={styles.markerAddress}>{marker.address || 'Address not available'}</Text>
                  </View>
                )
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  markersContainer: {
    marginTop: 15,
    width: '100%',
  },
  markersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  markerItem: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  markerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  markerAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
});

export default LeafletMap;