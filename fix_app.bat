@echo off
echo ==========================================
echo      FIXING APP DEPENDENCIES & CACHE
echo ==========================================

echo 1. Cleaning Expo Cache...
if exist .expo rmdir /s /q .expo
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 2. Reinstalling Drawer Navigation...
call npm uninstall @react-navigation/drawer
call npm install @react-navigation/drawer

echo 3. Checking other dependencies...
call npx expo install react-native-gesture-handler react-native-reanimated

echo ==========================================
echo SUCCESS! 
echo Now run this command to start your app:
echo npx expo start --clear
echo ==========================================
pause
