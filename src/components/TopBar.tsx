import { View, Text, Pressable, Image } from 'react-native';
import { useGame } from '../store';

export default function TopBar({ onOpenSettings, onOpenShop }: {
  onOpenSettings: () => void; onOpenShop: () => void;
}) {
  const { name, time, money } = useGame();
  const dateStr = `Y${time.year} • W${time.week}`;

  return (
    <View style={{
      paddingTop: 14, paddingBottom: 8, paddingHorizontal: 12,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: 'rgba(255,255,255,0.65)', borderBottomWidth: 1
    }}>
      <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
        <Image source={require('../../assets/avatar.png')} style={{ width:28, height:28, borderRadius:14 }} />
        <Text style={{ fontWeight:'700' }}>{name} • {dateStr}</Text>
      </View>
      <View style={{ flexDirection:'row', gap: 12, alignItems:'center' }}>
        <Text>💰 {Math.floor(money)}</Text>
        <Pressable onPress={onOpenSettings}><Text>⚙️</Text></Pressable>
        <Pressable onPress={onOpenShop}><Text>🛒</Text></Pressable>
      </View>
    </View>
  );
}
