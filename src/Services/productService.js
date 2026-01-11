import { API_URL } from './baseapi';

// Function to add a new product
export const addProduct = async (shopId, productData) => {
  try {
    const response = await fetch(`${API_URL}/products/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shopId,
        ...productData,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add product');
    }

    return data;
  } catch (error) {
    console.error('Add product error:', error);
    throw error;
  }
};

// Function to get products for a specific shop
export const getShopProducts = async (shopId) => {
  try {
    const response = await fetch(`${API_URL}/products/shop/${shopId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }

    return data;
  } catch (error) {
    console.error('Get shop products error:', error);
    throw error;
  }
};

// Function to get nearby shops based on location
export const getNearbyShops = async (latitude, longitude, radius = 3000) => { // radius in meters
  try {
    const response = await fetch(
      `${API_URL}/shops/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch nearby shops');
    }

    // Calculate distance for each shop if not provided by the API
    if (data.shops && latitude && longitude) {
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance in meters
      };

      data.shops.forEach(shop => {
        if (shop.location && shop.location.latitude && shop.location.longitude) {
          const distanceInMeters = calculateDistance(
            latitude, 
            longitude, 
            shop.location.latitude, 
            shop.location.longitude
          );
          shop.distance = distanceInMeters / 1000; // Convert to kilometers
        }
      });

      // Sort shops by distance
      data.shops.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    return data.shops || data;
  } catch (error) {
    console.error('Get nearby shops error:', error);
    throw error;
  }
};