import { View, Text } from 'react-native';
import { useGame } from '../src/store';
import DevFab from '../src/components/DevFab';

export default function Home() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '800' }}>Your Status</Text>
      <View style={{ backgroundColor: '#fff', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#eef2f7' }}>
        <Text>Current Job: McDonalds Worker</Text>
        <Text style={{ marginTop: 6 }}>Mobile features unlocked!</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Dash title="7" subtitle="Items Owned" />
        <Dash title="9" subtitle="Relationships" />
        <Dash title="6" subtitle="Job Ranks" />
      </View>
    </View>
  );
}
function Dash({ title, subtitle }:{ title:string; subtitle:string }) {
  return (
    <View style={{ flex:1, backgroundColor:'#fff', borderWidth:1, borderColor:'#eef2f7', borderRadius:14, padding:14 }}>
      <Text style={{ fontSize:24, fontWeight:'800', color:'#2563eb', textAlign:'center' }}>{title}</Text>
      <Text style={{ textAlign:'center', color:'#111827', marginTop:4 }}>{subtitle}</Text>
    </View>
  );
}
