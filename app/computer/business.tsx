import { View, Text, Pressable } from 'react-native';
import { useGame } from '../../src/store';
import BackButton from '../../src/components/BackButton';

export default function BusinessPC() {
  const { companies, doBusiness } = useGame();
  return (
    <View style={{ padding:16, gap:12 }}>
      <BackButton label="Back" />
      <Text style={{ fontSize:18, fontWeight:'900' }}>Company</Text>
      {companies.map(c => (
        <View key={c.id} style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14 }}>
          <Text style={{ fontWeight:'800' }}>{c.name}</Text>
          <Text style={{ color:'#6b7280' }}>Revenue/wk: {c.revenuePerWeek} • Cost/wk: {c.costPerWeek}</Text>
        </View>
      ))}
      <Pressable onPress={doBusiness} style={{ alignSelf:'flex-start', backgroundColor:'#2563eb', paddingHorizontal:14, paddingVertical:10, borderRadius:10 }}>
        <Text style={{ color:'#fff', fontWeight:'800' }}>Work on company</Text>
      </Pressable>
    </View>
  );
}
