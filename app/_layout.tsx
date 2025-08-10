import { View } from 'react-native';
import { Tabs } from 'expo-router';
import BottomTabs from '../src/components/BottomTabs';
import HeaderStats from '../src/components/HeaderStats';
import { useEffect } from 'react';
import { initGame } from '../src/data/seed';
import DevFab from '../src/components/DevFab';
import { ToastPortal } from '../src/ui/Toast';

export default function RootLayout() {
  useEffect(() => { initGame(); }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        // 👇 In Expo Router v3, put tabBar here, not inside screenOptions.
        tabBar={(props) => <BottomTabs {...props} />}
        screenOptions={{ header: () => <HeaderStats /> }}
      >
        {/* ALWAYS-VISIBLE */}
        <Tabs.Screen name="index"    options={{ title: 'Home' }} />
        <Tabs.Screen name="work"     options={{ title: 'Work' }} />
        <Tabs.Screen name="market"   options={{ title: 'Market' }} />
        <Tabs.Screen name="health"   options={{ title: 'Health' }} />

        {/* Progress merged into Home; keep route hidden to avoid old links breaking */}
        <Tabs.Screen name="progress" options={{ href: null, title: 'Progress' }} />

        {/* UNLOCKED TABS (hidden until purchased by BottomTabs) */}
        <Tabs.Screen name="mobile"   options={{ title: 'Mobile' }} />
        <Tabs.Screen name="computer" options={{ title: 'Computer' }} />

        {/* Hidden pages */}
        <Tabs.Screen name="settings" options={{ href: null, title: 'Settings' }} />
      </Tabs>

      <DevFab />
      <ToastPortal />
    </View>
  );
}
