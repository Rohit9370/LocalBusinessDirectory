import { Redirect } from 'expo-router';

export default function HomeScreen() {
  // Redirect to the dual login screen as the initial screen
  return <Redirect href="/DualLogin" />;
}
