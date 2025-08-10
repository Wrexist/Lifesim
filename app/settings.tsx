import { View, Text, Switch, Pressable } from 'react-native';
import { useGame } from '../src/store';

export default function SettingsScreen() {
  const { devMode, setDevMode, reset } = useGame();
  const [sound, setSound] = React.useState(true);
  const [hints, setHints] = React.useState(true);

  return (
    <View style={{ padding:16, gap:16 }}>
      <Text style={{ fontSize:22, fontWeight:'900' }}>Settings</Text>

      <Row label="Sound Effects" value={<Switch value={sound} onValueChange={setSound} />} />
      <Row label="Hints/Tooltips" value={<Switch value={hints} onValueChange={setHints} />} />
      <Row label="Developer Tools" value={<Switch value={!!devMode} onValueChange={setDevMode} />} />

      <Pressable onPress={reset} style={{ marginTop:20, backgroundColor:'#ef4444', padding:12, borderRadius:12, alignSelf:'flex-start' }}>
        <Text style={{ color:'#fff', fontWeight:'900' }}>Reset Save</Text>
      </Pressable>
    </View>
  );
}
const React = { useState: require('react').useState }; // tiny helper to avoid extra imports

function Row({ label, value }:{ label:string; value:React.ReactNode }) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#eef2f7', padding:12 }}>
      <Text style={{ fontWeight:'800' }}>{label}</Text>
      {value}
    </View>
  );
}
