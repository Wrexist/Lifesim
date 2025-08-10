import { View, Text } from 'react-native';
import { useGame } from '../src/store';

export default function Progress() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '900' }}>Your Progress</Text>
      <View style={{ backgroundColor:'#fff', borderWidth:1, borderColor:'#eef2f7', borderRadius:14, padding:14 }}>
        <Text style={{ fontWeight:'800', fontSize:16 }}>Overall Achievement Progress</Text>
        <View style={{ height:8, backgroundColor:'#fde68a', borderRadius:999, marginTop:10 }} />
        <Text style={{ marginTop:8, color:'#6b7280' }}>0 / 0 Completed • 0%</Text>
      </View>

      <Text style={{ fontWeight:'900', marginTop:4 }}>Achievements (0/0)</Text>
      {['Money','Career','Education','Relationships'].map(cat => (
        <Text key={cat} style={{ marginTop:6 }}>{cat} (0/0)</Text>
      ))}
    </View>
  );
}
