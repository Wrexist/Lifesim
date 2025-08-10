import { View, Text, Pressable, ScrollView } from 'react-native';
import BackButton from '../../src/components/BackButton';
import { useToast } from '../../src/ui/Toast';

const TICKERS = ['AAPL','MSFT','NVDA','AMZN','META'];

export default function Stocks() {
  const show = useToast(t=>t.show);
  return (
    <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
      <BackButton label="Back to Apps" />
      <Text style={{ fontSize:22, fontWeight:'900' }}>Stocks</Text>

      <View style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12 }}>
        <Text style={{ fontWeight:'800' }}>Watchlist (mock)</Text>
        {TICKERS.map(t=>(
          <View key={t} style={{ flexDirection:'row', justifyContent:'space-between', paddingVertical:6 }}>
            <Text>{t}</Text>
            <Text style={{ color:'#16a34a', fontWeight:'800' }}>${(50 + Math.random()*900 | 0)}</Text>
          </View>
        ))}
        <Pressable onPress={()=>show('Order placed (mock)')} style={{ marginTop:8, alignSelf:'flex-start', backgroundColor:'#16a34a', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}>
          <Text style={{ color:'#fff', fontWeight:'800' }}>Buy AAPL</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
