import { View, Text, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useGame } from '../../src/store';
import Market from '../../app/market';
export default Market;

export default function EbayPC() {
  const { inventory, market, refreshMarket, sellListed, listInventoryItem, unlistInventoryItem, money } = useGame();
  const [priceMap, setPriceMap] = useState<Record<string, string>>({});

  const listed = inventory.filter(i => i.listed);
  const unlisted = inventory.filter(i => !i.listed);

  return (
    <View style={{ padding:16, gap:12 }}>
      <Text style={{ fontSize:18, fontWeight:'900' }}>eBay (Full)</Text>

      {/* Unlisted inventory: list items with a price */}
      <Text style={{ marginTop:6, fontWeight:'800' }}>Inventory (Unlisted)</Text>
      {unlisted.length === 0 && <Text style={{ color:'#6b7280' }}>No items to list.</Text>}
      {unlisted.map(i => (
        <View key={i.id} style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14, marginTop:8 }}>
          <Text>{i.name} x{i.qty} • avg ${i.avgBuyPrice}</Text>
          <View style={{ flexDirection:'row', gap:8, marginTop:8, alignItems:'center' }}>
            <TextInput
              placeholder="Price"
              keyboardType="number-pad"
              value={priceMap[i.id] ?? ''}
              onChangeText={(t)=>setPriceMap(p=>({ ...p, [i.id]: t }))}
              style={{ flex:1, borderWidth:1, borderColor:'#e5e7eb', borderRadius:8, paddingHorizontal:10, paddingVertical:8 }}
            />
            <Pressable
              onPress={()=>listInventoryItem(i.id, Number(priceMap[i.id] ?? 0))}
              disabled={!priceMap[i.id]}
              style={{ backgroundColor: !priceMap[i.id] ? '#e5e7eb':'#16a34a', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}
            >
              <Text style={{ color: !priceMap[i.id] ? '#6b7280':'#fff', fontWeight:'800' }}>List</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {/* Listed items: sell instantly or unlist */}
      <Text style={{ marginTop:12, fontWeight:'800' }}>Listed</Text>
      {listed.length === 0 && <Text style={{ color:'#6b7280' }}>Nothing listed.</Text>}
      {listed.map(i => (
        <View key={i.id} style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14, marginTop:8 }}>
          <Text>{i.name} x{i.qty} • ${i.listPrice}/ea</Text>
          <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
            <Pressable onPress={()=>sellListed(i.id)} style={{ backgroundColor:'#16a34a', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}>
              <Text style={{ color:'#fff', fontWeight:'800' }}>Sell all</Text>
            </Pressable>
            <Pressable onPress={()=>unlistInventoryItem(i.id)} style={{ backgroundColor:'#e5e7eb', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}>
              <Text>Unlist</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {/* Market analysis (read-only here; buying happens in Market/eBay tab) */}
      <Text style={{ marginTop:12, fontWeight:'800' }}>Market signals</Text>
      <Pressable onPress={refreshMarket} style={{ alignSelf:'flex-start', backgroundColor:'#e5f0ff', borderRadius:8, paddingHorizontal:10, paddingVertical:6, marginTop:6 }}>
        <Text style={{ color:'#2563eb', fontWeight:'700' }}>Refresh</Text>
      </Pressable>
      {market.map(m => (
        <View key={m.id} style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14, marginTop:8 }}>
          <Text style={{ fontWeight:'800' }}>{m.name}</Text>
          <Text style={{ color:'#16a34a' }}>${m.currentPrice}</Text>
          {m.buff && <Text style={{ color:'#6b7280' }}>Buff: {Object.entries(m.buff.effects).map(([k,v])=>`+${v} ${k}`).join(', ')} for {m.buff.durationWeeks} weeks</Text>}
        </View>
      ))}
    </View>
  );
}
