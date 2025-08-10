import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../store';

export default function NextWeekButton() {
  const { nextWeek } = useGame();
  return (
    <Pressable onPress={nextWeek} style={{ borderRadius: 10, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#16a34a', paddingHorizontal: 12, paddingVertical: 8 }}>
        <Ionicons name="calendar-outline" size={18} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '800' }}>Next Week</Text>
      </View>
    </Pressable>
  );
}
