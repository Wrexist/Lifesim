import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../store';
import NextWeekButton from './NextWeekButton';
import { useRouter } from 'expo-router';

function Bar({ value = 0 }: { value?: number }) {
  const pct = Math.max(0, Math.min(100, value ?? 0));
  return (
    <View style={{ height: 8, backgroundColor: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: '#10b981' }} />
    </View>
  );
}
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function HeaderStats() {
  const router = useRouter();
  const state = useGame();
  const time = state?.time ?? { week: 1, year: 2025 };
  const age = state?.age ?? 18;
  const money = state?.money ?? 0;
  const energy = state?.energy ?? 0;
  const happiness = state?.happiness ?? 0;
  const health = state?.health ?? 0;
  const fame = state?.fame ?? 0;
  const skills = state?.skills ?? { coding:0, business:0, social:0, fitness:0, hacking:0 };

  const monthIndex = Math.floor(((time.week ?? 1) - 1) / 4) % 12;
  const title = `Week ${time.week ?? 1} - ${MONTHS[monthIndex]} ${time.year ?? 2025} - Age ${age}`;

  return (
    <LinearGradient colors={['#ffffff', '#f8fafc']} style={{ paddingTop: 14, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#eef2f7' }}>
      <View style={{ paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#2563eb' }}>{title}</Text>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <Ionicons name="bag-outline" size={22} color="#64748b" />
          <Pressable onPress={()=>router.push('/settings')}>
            <Ionicons name="settings-outline" size={22} color="#64748b" />
          </Pressable>
        </View>
      </View>

      <View style={{ paddingHorizontal: 14, marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#059669', fontWeight: '700' }}><Ionicons name="heart-outline" size={16} /> {Math.floor(health)}</Text>
          <Bar value={health} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#0891b2', fontWeight: '700' }}><Ionicons name="happy-outline" size={16} /> {Math.floor(happiness)}</Text>
          <Bar value={happiness} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#10b981', fontWeight: '700' }}><Ionicons name="flash-outline" size={16} /> {Math.floor(energy)}</Text>
          <Bar value={energy} />
        </View>
        <NextWeekButton />
      </View>

      <View style={{ paddingHorizontal: 14, marginTop: 8, flexDirection: 'row', gap: 18, alignItems: 'center' }}>
        <Text style={{ color: money >= 0 ? '#16a34a' : '#dc2626', fontWeight: '700' }}>${Math.floor(money)}</Text>
        <Text style={{ color: '#2563eb' }}><Ionicons name="barbell-outline" size={16} /> {skills.fitness}</Text>
        <Text style={{ color: '#2563eb' }}><Ionicons name="code-slash-outline" size={16} /> {skills.coding}</Text>
        <Text style={{ color: '#2563eb' }}><Ionicons name="star-outline" size={16} /> {fame}</Text>
      </View>
    </LinearGradient>
  );
}
