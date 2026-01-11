import { Account, Client, Databases, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('696343ea00244314d2f7');

export const account = new Account(client);
export const databases = new Databases(client);

// Constants for Database and Collections
export const DB_ID = 'shops_products_db';
export const SHOPS_COLLECTION_ID = 'shops';
export const PRODUCTS_COLLECTION_ID = 'products';

export { ID };
export default client;
