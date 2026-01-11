import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import { COLORS } from '../../constants/theme';

const Reports = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.content}>
        <Text style={styles.title}>Reports</Text>
        <Text style={styles.subtitle}>Sales and inventory reports will appear here.</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: moderateScale(10),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: COLORS.textLight,
    textAlign: 'center',
  }
});

export default Reports;
