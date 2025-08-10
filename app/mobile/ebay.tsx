import { View, Text, Pressable } from 'react-native';
import { useGame } from '../../src/store';
import BackButton from '../../src/components/BackButton';

export default function EbayApp() {
  const { market, refreshMarket, buyMarketItem, inventory, money } = useGame();
  return (
    <View style={{ padding:16, gap:12 }}>
      <BackButton label="Back" />
      <Text style={{ fontSize:18, fontWeight:'900' }}>eBay</Text>
      <Pressable onPress={refreshMarket} style={{ alignSelf:'flex-start', backgroundColor:'#e5f0ff', borderRadius:8, paddingHorizontal:10, paddingVertical:6 }}>
        <Text style={{ color:'#2563eb', fontWeight:'700' }}>Refresh</Text>
      </Pressable>
      {market.map(m => (
        <View key={m.id} style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14 }}>
          <Text style={{ fontWeight:'800' }}>{m.name}</Text>
          <Text style={{ color:'#16a34a' }}>${m.currentPrice}</Text>
          <Pressable disabled={money < m.currentPrice} onPress={() => buyMarketItem(m.id, 1)} style={{ alignSelf:'flex-end', marginTop:8, backgroundColor: money < m.currentPrice ? '#e5e7eb' : '#16a34a', paddingHorizontal:14, paddingVertical:8, borderRadius:10 }}>
            <Text style={{ color: money < m.currentPrice ? '#6b7280' : '#fff', fontWeight:'800' }}>{money < m.currentPrice ? 'Not enough' : 'Buy'}</Text>
          </Pressable>
        </View>
      ))}
      <Text style={{ marginTop:8, fontWeight:'800' }}>Inventory</Text>
      {inventory.length === 0 && <Text style={{ color:'#6b7280' }}>Empty</Text>}
      {inventory.map(i => (<Text key={i.id}>• {i.name} x{i.qty} (avg ${i.avgBuyPrice})</Text>))}
    </View>
  );
}
