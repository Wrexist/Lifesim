import { Stack } from 'expo-router';

export default function MobileLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerBackTitle: 'Back' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="relations" options={{ title: 'Contacts' }} />
      <Stack.Screen name="tinder" options={{ title: 'Tinder' }} />
      <Stack.Screen name="study" options={{ title: 'Education' }} />
      <Stack.Screen name="ebay" options={{ title: 'eBay (Mobile)' }} />
      <Stack.Screen name="business" options={{ title: 'Company' }} />
      <Stack.Screen name="darkweb" options={{ title: 'Dark Web' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
