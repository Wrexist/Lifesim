import { Stack } from 'expo-router';

export default function ComputerLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerBackTitle: 'Back' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="darkweb" options={{ title: 'Dark Web (Full)' }} />
      <Stack.Screen name="ebay" options={{ title: 'eBay (Full)' }} />
      <Stack.Screen name="business" options={{ title: 'Company' }} />
      <Stack.Screen name="tinder" options={{ title: 'Tinder' }} />
    </Stack>
  );
}
