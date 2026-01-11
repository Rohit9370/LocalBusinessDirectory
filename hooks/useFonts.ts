import { useFonts as useExpoFonts } from 'expo-font';

export function useFonts() {
  const [fontsLoaded] = useExpoFonts({
    'RobotoCondensed-Regular': require('../app/assets/fonts/RobotoCondensed-Regular.ttf'),
    'RobotoCondensed-Bold': require('../app/assets/fonts/RobotoCondensed-Bold.ttf'),
    'RobotoCondensed-Medium': require('../app/assets/fonts/RobotoCondensed-Medium.ttf'),
    'RobotoCondensed-SemiBold': require('../app/assets/fonts/RobotoCondensed-SemiBold.ttf'),
    'RobotoCondensed-Light': require('../app/assets/fonts/RobotoCondensed-Light.ttf'),
    'RobotoCondensed-ExtraLight': require('../app/assets/fonts/RobotoCondensed-ExtraLight.ttf'),
    'RobotoCondensed-Thin': require('../app/assets/fonts/RobotoCondensed-Thin.ttf'),
    'RobotoCondensed-Black': require('../app/assets/fonts/RobotoCondensed-Black.ttf'),
    'RobotoCondensed-ExtraBold': require('../app/assets/fonts/RobotoCondensed-ExtraBold.ttf'),
  });

  return fontsLoaded;
}
