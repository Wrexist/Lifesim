import { Stack } from 'expo-router';

export default function ComputerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="darkweb" />
      <Stack.Screen name="ebay" />
      <Stack.Screen name="business" />
      <Stack.Screen name="crypto" />
      <Stack.Screen name="stocks" />
    </Stack>
  );
}
