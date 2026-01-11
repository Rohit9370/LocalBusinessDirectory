import { useRouter } from 'expo-router';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { COLORS, SHADOWS } from '../../constants/theme';

const Settings = () => {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            // In a real app, clear auth tokens here
            router.replace('/DualLogin');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
            <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>Notifications</Text>
                <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>Privacy Policy</Text>
                <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>Help & Support</Text>
                <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: scale(20),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: verticalScale(20),
  },
  section: {
    backgroundColor: 'white',
    borderRadius: moderateScale(15),
    padding: scale(10),
    marginBottom: verticalScale(30),
    ...SHADOWS.small,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(10),
  },
  settingText: {
    fontSize: moderateScale(16),
    color: COLORS.text,
  },
  arrow: {
    fontSize: moderateScale(16),
    color: COLORS.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  logoutButton: {
    backgroundColor: COLORS.error, // Use error color not 'red'
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    ...SHADOWS.small,
  },
  logoutText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  }
});

export default Settings;
