import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useGame } from '../store';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index:    'home-outline',
  work:     'briefcase-outline',
  market:   'cart-outline',
  health:   'heart-outline',
  progress: 'trophy-outline',
  mobile:   'phone-portrait-outline',
  computer: 'laptop-outline' // 'desktop-outline' may not exist in your Ionicons build
};

export default function BottomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { ownedItems } = useGame();
  const hasPhone = ownedItems.includes('SMARTPHONE');
  const hasComputer = ownedItems.includes('COMPUTER');

  const visible = ['index','work','market','health','progress']
    .concat(hasPhone ? ['mobile'] : ['mobile-outline'])
    .concat(hasComputer ? ['computer'] : ['tv-outline']);
  const ordered = visible.map(n => state.routes.find(r => r.name === n)).filter(Boolean) as typeof state.routes;

  return (
    <View style={{ paddingBottom: Math.max(8, insets.bottom), paddingTop: 8, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-around' }}>
      {ordered.map(route => {
        const idx = state.routes.findIndex(r => r.key === route.key);
        const focused = state.index === idx;
        const onPress = () => {
          const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !e.defaultPrevented) navigation.navigate(route.name as never);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              minWidth: 0,
              alignItems: 'center',
              paddingVertical: 6,
              paddingHorizontal: 4,
              borderRadius: 12,
              backgroundColor: focused ? 'rgba(22,163,74,0.10)' : 'transparent'
            }}
          >
            <Ionicons name={ICONS[route.name] || 'ellipse-outline'} size={22} color={focused ? '#16a34a' : '#6b7280'} />
            <Text style={{ fontSize: 12, color: focused ? '#111827' : '#6b7280', marginTop: 2 }}>
              {descriptors[route.key]?.options?.title ?? route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
