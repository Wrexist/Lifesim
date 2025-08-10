import { View, Text, Pressable } from 'react-native';
import { useGame } from '../src/store';

export default function Health() {
  const { doRest, doGym, eatFood, foods, money } = useGame();
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '900' }}>Health Activities</Text>
      <BigActivity title="Walk in Park" price="$0" benefits={['+10 Happiness','+5 Health','-5 Energy']} onDo={()=>eatFood('WALK')} />
      <BigActivity title="Meditation Session" price="$20" benefits={['+15 Happiness','-5 Energy']} onDo={()=> eatFood('TEA')} disabled={money<20} />
      <BigActivity title="Spa Massage" price="$30" benefits={['+20 Happiness','+10 Health','-10 Energy']} onDo={()=> eatFood('SALAD')} disabled={money<30}/>
      <BigActivity title="Gym Session" price="$50 + 20 Energy" benefits={['+5 Fitness','+3 Health','+2 Happiness']} onDo={doGym} />
    </View>
  );
}
function BigActivity({ title, price, benefits, onDo, disabled }:{
  title:string; price:string; benefits:string[]; onDo:()=>void; disabled?:boolean;
}) {
  return (
    <View style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14 }}>
      <Text style={{ fontSize:22, fontWeight:'900' }}>{title}</Text>
      <Text style={{ color:'#6b7280', marginTop:6 }}>Invest in your mental and physical wellbeing with various activities!</Text>
      <View style={{ backgroundColor:'#dcfce7', borderRadius:12, padding:12, marginTop:10 }}>
        <Text style={{ fontWeight:'800' }}>Benefits per session:</Text>
        <View style={{ marginTop:6, gap:4 }}>
          {benefits.map(b => <Text key={b} style={{ color: b.startsWith('-') ? '#ef4444' : '#059669' }}>{b}</Text>)}
        </View>
      </View>
      <View style={{ backgroundColor:'#fff7ed', borderRadius:12, padding:12, marginTop:10 }}>
        <Text style={{ fontWeight:'800', color:'#f59e0b' }}>Cost:</Text>
        <Text style={{ color:'#f59e0b', marginTop:4 }}>{price}</Text>
      </View>
      <Pressable onPress={onDo} disabled={disabled} style={{ marginTop:12, borderRadius:12, backgroundColor: disabled ? '#e5e7eb' : '#2563eb', alignSelf:'stretch', paddingVertical:12 }}>
        <Text style={{ color: disabled ? '#6b7280' : '#fff', textAlign:'center', fontWeight:'800' }}>{disabled ? 'Not enough money' : 'Do'}</Text>
      </Pressable>
    </View>
  );
}
