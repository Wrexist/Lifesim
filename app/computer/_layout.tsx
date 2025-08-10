import { Stack } from 'expo-router';

export default function ComputerLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerBackTitle: 'Back' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="darkweb" options={{ title: 'Dark Web (Full)' }} />
      <Stack.Screen name="ebay" options={{ title: 'eBay (Full)' }} />
      <Stack.Screen name="business" options={{ title: 'Company' }} />
      <Stack.Screen name="tinder" options={{ title: 'Tinder' }} />
      <Stack.Screen name="crypto" options={{ title: 'Crypto' }} />
      <Stack.Screen name="relations" options={{ title: 'Contacts' }} />
      <Stack.Screen name="stocks" options={{ title: 'Stocks' }} />
      <Stack.Screen name="study" options={{ title: 'Education' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
