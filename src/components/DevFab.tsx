import { View, Text, Pressable } from 'react-native';
import { useGame } from '../store';

export default function DevFab() {
  const { devMode, devAddMoney, devSetEnergy, devNextWeeks, devUnlockAll } = useGame();
  if (!devMode) return null;
  return (
    <View style={{ position:'absolute', right:10, bottom:10, gap:8 }}>
      <Pressable onPress={()=>devAddMoney(1000)} style={btn('#16a34a')}><Text style={txt()}>+ $1k</Text></Pressable>
      <Pressable onPress={()=>devSetEnergy(100)} style={btn('#2563eb')}><Text style={txt()}>Energy 100</Text></Pressable>
      <Pressable onPress={()=>devNextWeeks(4)} style={btn('#f59e0b')}><Text style={txt()}>+4 Weeks</Text></Pressable>
      <Pressable onPress={devUnlockAll} style={btn('#7c3aed')}><Text style={txt()}>Unlock All</Text></Pressable>
    </View>
  );
}
const btn = (bg:string)=>({ backgroundColor:bg, paddingHorizontal:12, paddingVertical:10, borderRadius:12, shadowColor:'#000', shadowOpacity:0.15, shadowRadius:6, shadowOffset:{width:0,height:3}});
const txt = ()=>({ color:'#fff', fontWeight:'800' });
