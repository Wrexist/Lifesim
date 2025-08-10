import { View, Text, Image } from 'react-native';
import { useGame } from '../store';
import Svg, { Rect } from 'react-native-svg';

function Bar({ value, color }: { value: number; color: string }) {
  const width = 140;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <Svg width={width} height={10}>
      <Rect x="0" y="0" width={width} height={10} rx={5} fill="#222" />
      <Rect x="0" y="0" width={(width*pct)/100} height={10} rx={5} fill={color} />
    </Svg>
  );
}

export default function HUD() {
  const { energy, happiness, money, name } = useGame();
  return (
    <View style={{ position:'absolute', top:56, left:12, right:12, gap:10 }}>
      <View style={{ flexDirection:'row', alignItems:'center', gap:10, backgroundColor:'rgba(255,255,255,0.7)', padding:8, borderRadius:12 }}>
        <Image source={require('../../assets/avatar.png')} style={{ width:36, height:36, borderRadius:18 }} />
        <Text style={{ fontWeight:'700' }}>{name}</Text>
        <View style={{ flex:1 }} />
        <Text>💰 {Math.floor(money)}</Text>
      </View>

      <View style={{ flexDirection:'row', gap:12 }}>
        <View style={{ backgroundColor:'rgba(255,255,255,0.8)', padding:8, borderRadius:12, alignItems:'center', flexDirection:'row', gap:8 }}>
          <Text>⚡</Text>
          <Bar value={energy} color="#22c55e" />
          <Text style={{ width:34, textAlign:'right' }}>{Math.floor(energy)}</Text>
        </View>
        <View style={{ backgroundColor:'rgba(255,255,255,0.8)', padding:8, borderRadius:12, alignItems:'center', flexDirection:'row', gap:8 }}>
          <Text>😊</Text>
          <Bar value={happiness} color="#3b82f6" />
          <Text style={{ width:34, textAlign:'right' }}>{Math.floor(happiness)}</Text>
        </View>
      </View>
    </View>
  );
}
