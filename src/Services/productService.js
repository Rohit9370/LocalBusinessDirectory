import { ID, Query } from 'appwrite';
import { databases, DB_ID, PRODUCTS_COLLECTION_ID, SHOPS_COLLECTION_ID, storage } from '../lib/appwrite';

// Function to add a new product
export const addProduct = async (shopId, productData) => {
  try {
    const productDocument = await databases.createDocument(
      DB_ID,
      PRODUCTS_COLLECTION_ID,
      ID.unique(),
      {
        productName: productData.name || productData.productName, // Map 'name' to 'productName' as expected by the collection
        price: productData.price,
        description: productData.description,
        imageUrl: productData.imageUrl,
        category: productData.category || 'General',
        sku: productData.sku,
        stockQuantity: productData.stockQuantity || productData.quantity || 0,
        shopId,
      }
    );

    return productDocument;
  } catch (error) {
    console.error('Add product error:', error);
    throw error;
  }
};

// Function to get products for a specific shop
export const getShopProducts = async (shopId) => {
  try {
    const response = await databases.listDocuments(DB_ID, PRODUCTS_COLLECTION_ID, [
      Query.equal('shopId', shopId)
    ]);

    return response.documents;
  } catch (error) {
    console.error('Get shop products error:', error);
    throw error;
  }
};

// Function to get nearby shops based on location
export const getNearbyShops = async (latitude, longitude, radius = 3000) => { // radius in meters
  try {
    // Get all shops from the database
    const response = await databases.listDocuments(DB_ID, SHOPS_COLLECTION_ID);
    
    // Filter shops based on distance
    const nearbyShops = response.documents.filter(shop => {
      if (shop.locationCoords && shop.locationCoords.latitude && shop.locationCoords.longitude) {
        const distanceInMeters = calculateDistance(
          latitude,
          longitude,
          shop.locationCoords.latitude,
          shop.locationCoords.longitude
        );
        return distanceInMeters <= radius;
      }
      return false; // Exclude shops without coordinates
    }).map(shop => {
      // Calculate and add distance to each shop
      const distanceInMeters = calculateDistance(
        latitude,
        longitude,
        shop.locationCoords.latitude,
        shop.locationCoords.longitude
      );
      return {
        ...shop,
        distance: distanceInMeters / 1000 // Convert to kilometers
      };
    });
    
    // Sort shops by distance
    nearbyShops.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    
    return nearbyShops;
  } catch (error) {
    console.error('Get nearby shops error:', error);
    throw error;
  }
};

// Helper function to calculate distance between two coordinates
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

// Function to get shop details with initial products
export const getShopWithProducts = async (shopId) => {
  try {
    const shop = await databases.getDocument(DB_ID, SHOPS_COLLECTION_ID, shopId);
    
    // Also get products for this shop
    const products = await getShopProducts(shopId);
    
    return {
      ...shop,
      products
    };
  } catch (error) {
    console.error('Get shop with products error:', error);
    throw error;
  }
};

// Function to upload image to Appwrite storage
export const uploadImage = async (imageUri, fileName) => {
  try {
    // Determine file type from the URI
    const fileType = imageUri.split('.').pop() || 'jpg';
    const mimeType = `image/${fileType === 'jpg' ? 'jpeg' : fileType}`;
    
    // Create a file object compatible with React Native
    const filename = fileName || `product_image_${Date.now()}`;
    
    // Create a file-like object with the required properties
    const fileObject = {
      uri: imageUri,
      name: `${filename}.${fileType}`,
      type: mimeType,
    };
    
    // Upload file to Appwrite storage using the imported storage instance
    const uploadedFile = await storage.createFile(
      '6963cdd2002aa9e611f9', // bucket ID from your query
      ID.unique(),
      fileObject
    );
    
    // Return the file URL
    return `https://nyc.cloud.appwrite.io/v1/storage/buckets/6963cdd2002aa9e611f9/files/${uploadedFile.$id}/view?project=696343ea00244314d2f7`;
  } catch (error) {
    console.error('Upload image error:', error);
    // If the Appwrite SDK upload fails, we'll use the original image URI as fallback
    // This allows the product to be created even if image upload fails
    console.warn('Image upload failed, using original URI as fallback');
    return imageUri; // Return the original image URI as fallback
  }
};