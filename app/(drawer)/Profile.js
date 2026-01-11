import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { COLORS, SHADOWS } from '../../constants/theme';

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.content}>
        <View style={styles.header}>
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>JD</Text>
            </View>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.role}>Shopkeeper</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Info</Text>
            <Text style={styles.infoLabel}>Email: <Text style={styles.infoValue}>john@example.com</Text></Text>
            <Text style={styles.infoLabel}>Phone: <Text style={styles.infoValue}>+91 9876543210</Text></Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shop Details</Text>
            <Text style={styles.infoLabel}>Shop Name: <Text style={styles.infoValue}>John's General Store</Text></Text>
            <Text style={styles.infoLabel}>GST No: <Text style={styles.infoValue}>GST123456789</Text></Text>
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
    backgroundColor: 'white',
    padding: scale(20),
    borderRadius: moderateScale(15),
    ...SHADOWS.medium,
  },
  avatarContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  avatarText: {
    color: 'white',
    fontSize: moderateScale(30),
    fontWeight: 'bold',
  },
  name: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  role: {
    fontSize: moderateScale(16),
    color: COLORS.textLight,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: moderateScale(15),
    padding: scale(20),
    marginBottom: verticalScale(20),
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: verticalScale(10),
  },
  infoLabel: {
    fontSize: moderateScale(16),
    color: COLORS.textLight,
    marginBottom: verticalScale(5),
  },
  infoValue: {
    color: COLORS.text,
    fontWeight: '500',
  }
});

export default Profile;
