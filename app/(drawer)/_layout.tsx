import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from '../../constants/theme';

export default function DrawerLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    headerStyle: { backgroundColor: COLORS.primary },
                    headerTintColor: 'white',
                    drawerActiveTintColor: COLORS.primary,
                    drawerInactiveTintColor: COLORS.text,
                    drawerLabelStyle: { marginLeft: -20 },
                }}
            >
                <Drawer.Screen
                    name="AdminHome"
                    options={{
                        drawerLabel: 'Admin Dashboard',
                        title: 'Admin Dashboard',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="admin-panel-settings" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="ShopkeeperHome"
                    options={{
                        drawerLabel: 'Shopkeeper Dashboard',
                        title: 'Shopkeeper Dashboard',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="store" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Profile"
                    options={{
                        drawerLabel: 'My Profile',
                        title: 'My Profile',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Reports"
                    options={{
                        drawerLabel: 'Reports',
                        title: 'Reports',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="analytics" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Settings"
                    options={{
                        drawerLabel: 'Settings',
                        title: 'Settings',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="settings" size={size} color={color} />
                        ),
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
