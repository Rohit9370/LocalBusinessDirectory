import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [language, setLanguage] = useState('marathi');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLanguage = () => {
    setLanguage(language === 'marathi' ? 'english' : 'marathi');
  };

  const services = [
    { id: 1, nameMa: 'सामान्य शोध', nameEn: 'General Search', icon: 'search', color: '#FF4B91', route: '/NearbyShops' },
    { id: 2, nameMa: 'उत्पादने', nameEn: 'Products', icon: 'grid-outline', color: '#A084E8', route: '/MyProducts' },
    { id: 3, nameMa: 'खाद्य शोध', nameEn: 'Food Search', icon: 'restaurant', color: '#44D62C', route: '/NearbyShops' },
    { id: 4, nameMa: 'दुकाने', nameEn: 'Shops', icon: 'storefront', color: '#2CB9FF', route: '/NearbyShops' },
    { id: 5, nameMa: 'ऑफर्स', nameEn: 'Offers', icon: 'flash', color: '#FFB000', route: '/Offers' },
    { id: 6, nameMa: 'माझे ऑर्डर', nameEn: 'My Orders', icon: 'cart', color: '#FF7676', route: '/Orders' },
  ];

  return (
    <SafeAreaView className='flex-1 bg-[#F8F9FA]'>
      <StatusBar barStyle="light-content" backgroundColor="#e91e63" />
      
      {/* Header Section */}
      <View className='bg-[#e91e63] pb-12 pt-4 px-5 rounded-b-[40px] shadow-xl'>
        <View className='flex-row justify-between items-center'>
          <View>
            <Text className='text-white/80 text-sm font-medium'>
              {language === 'marathi' ? 'नमस्ते,' : 'Hello,'}
            </Text>
            <Text className='text-white text-2xl font-bold'>
              {language === 'marathi' ? 'आपले स्वागत आहे' : 'Welcome Back'}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={toggleLanguage}
            className='bg-white/20 p-2 px-4 rounded-2xl flex-row items-center border border-white/30'
          >
            <Text className='text-white font-bold mr-2'>
              {language === 'marathi' ? 'मराठी' : 'EN'}
            </Text>
            <MaterialIcons name="translate" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Search Bar */}
      <View className='px-6 -mt-7'>
        <View className='bg-white rounded-2xl flex-row items-center px-4 h-14 shadow-lg shadow-black/10'>
          <Ionicons name="search-outline" size={22} color="#e91e63" />
          <TextInput
            className='flex-1 ml-3 text-base text-gray-800'
            placeholder={language === 'marathi' ? 'सेवा किंवा उत्पादने शोधा...' : 'Search services...'}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        className='flex-1 px-5' 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 25 }}
      >
        <View className='flex-row justify-between items-center mb-5'>
          <Text className='text-xl font-bold text-gray-800'>
            {language === 'marathi' ? 'आमच्या सेवा' : 'Our Services'}
          </Text>
          <TouchableOpacity>
             <Text className='text-[#e91e63] font-semibold'>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Services Grid */}
        <View className='flex-row flex-wrap justify-between'>
          {services
            .filter(s => (language === 'marathi' ? s.nameMa : s.nameEn).toLowerCase().includes(searchQuery.toLowerCase()))
            .map((item) => (
            <Link key={item.id} href={item.route} asChild>
              <TouchableOpacity 
                activeOpacity={0.7}
                className='bg-white rounded-[30px] mb-5 items-center justify-center shadow-sm border border-gray-100'
                style={{ 
                  width: width * 0.43, 
                  height: verticalScale(140),
                }}
              >
                {/* Icon Bubble */}
                <View 
                  style={{ backgroundColor: `${item.color}20` }} // 20% opacity of color
                  className='p-4 rounded-2xl mb-3'
                >
                  <Ionicons name={item.icon} size={30} color={item.color} />
                </View>
                
                <Text className='text-gray-800 font-bold text-center px-2' style={{ fontSize: moderateScale(14) }}>
                  {language === 'marathi' ? item.nameMa : item.nameEn}
                </Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        {/* Bottom Banner (Optional Professional Touch) */}
        <View className='bg-orange-100 rounded-[25px] p-5 flex-row items-center mt-2'>
          <View className='flex-1'>
            <Text className='text-orange-700 font-bold text-lg'>Special Offer!</Text>
            <Text className='text-orange-600/80'>Get 20% off on first order</Text>
          </View>
          <MaterialIcons name="redeem" size={40} color="#f59e0b" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;