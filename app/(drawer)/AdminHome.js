import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { COLORS, SHADOWS } from '../../constants/theme';

const AdminHome = () => {
  const router = useRouter();
  const [language, setLanguage] = useState('english');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLanguage = () => {
    setLanguage(language === 'marathi' ? 'english' : 'marathi');
  };

  const adminServices = [
    {
      id: 1,
      nameMarathi: 'दुकानदार यादी',
      nameEnglish: 'Shopkeeper List',
      icon: 'storefront',
      color: COLORS.secondary,
      navigateTo: null
    },
    {
      id: 2,
      nameMarathi: 'नवीन दुकान जोडा',
      nameEnglish: 'Add New Shop',
      icon: 'add-shopping-cart',
      color: COLORS.success,
      navigateTo: null 
    },
    {
      id: 3,
      nameMarathi: 'दुकान शोधा',
      nameEnglish: 'Search Shops',
      icon: 'search',
      color: COLORS.primary,
      navigateTo: null
    },
    {
      id: 4,
      nameMarathi: 'रिपोर्ट',
      nameEnglish: 'Reports',
      icon: 'analytics',
      color: '#9F7AEA', // Purple
      navigateTo: 'Reports' // Updated to point to Reports screen
    },
    {
      id: 5,
      nameMarathi: 'सेटिंग्ज',
      nameEnglish: 'Settings',
      icon: 'settings',
      color: COLORS.warning,
      navigateTo: 'Settings' // Updated to point to Settings screen
    }
  ];

  const filteredServices = adminServices.filter(service => {
    const searchLower = searchQuery.toLowerCase();
    return (
      service.nameEnglish.toLowerCase().includes(searchLower) ||
      service.nameMarathi.includes(searchQuery)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={() => router.getParent().openDrawer()}>
            <MaterialIcons name="menu" size={28} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={toggleLanguage}
          >
            <Text style={styles.languageText}>
              {language === 'marathi' ? 'मराठी' : 'English'}
            </Text>
            <MaterialIcons name="language" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.placeholder} />
            <TextInput
              style={styles.searchInput}
              placeholder={language === 'marathi' ? 'शोधा...' : 'Search...'}
              placeholderTextColor={COLORS.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>
          {language === 'marathi' ? 'एडमिन सेवा' : 'Admin Services'}
        </Text>

        {filteredServices.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={60} color={COLORS.border} />
            <Text style={styles.emptyStateText}>
              {language === 'marathi' ? 'कोणतीही सेवा आढळली नाही' : 'No services found'}
            </Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredServices.map((service) => (
              <TouchableOpacity 
                key={service.id}
                style={[styles.serviceCard, { backgroundColor: service.color }]}
                onPress={() => {
                  if (service.navigateTo) {
                    router.push(service.navigateTo);
                  } else {
                    Alert.alert('Coming Soon', `${service.nameEnglish} feature is under development`);
                  }
                }}
              >
                <MaterialIcons name={service.icon} size={moderateScale(40)} color="white" />
                <Text style={styles.serviceText}>
                  {language === 'marathi' ? service.nameMarathi : service.nameEnglish}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 0.25,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
    ...SHADOWS.medium,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10), // Adjust based on SafeAreaView
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  menuButton: {
    padding: scale(5),
  },
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: scale(5),
  },
  searchContainer: {
    marginTop: verticalScale(10),
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: moderateScale(25),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: scale(10),
    fontSize: moderateScale(16),
    color: COLORS.text,
  },
  content: {
    padding: scale(20),
    paddingBottom: verticalScale(50),
  },
  sectionTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: verticalScale(20),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(50),
  },
  emptyStateText: {
    color: COLORS.textLight,
    fontSize: moderateScale(16),
    marginTop: verticalScale(10),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    height: verticalScale(150),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(10),
    ...SHADOWS.medium,
  },
  serviceText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
    marginTop: verticalScale(10),
    textAlign: 'center',
  },
});

export default AdminHome;
