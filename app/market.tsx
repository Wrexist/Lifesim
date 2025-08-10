import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { useState } from 'react';
import { useGame } from '../src/store';
import Segmented from '../src/components/Segmented';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../src/ui/Toast';

function Badge({ children, tone='info' }:{ children:React.ReactNode; tone?:'info'|'warn'|'ok' }) {
  const bg = tone==='ok' ? '#dcfce7' : tone==='warn' ? '#fef3c7' : '#e0e7ff';
  const fg = tone==='ok' ? '#059669' : tone==='warn' ? '#b45309' : '#3b82f6';
  return <View style={{ backgroundColor:bg, borderRadius:8, paddingHorizontal:8, paddingVertical:4 }}><Text style={{ color:fg, fontWeight:'800' }}>{children}</Text></View>;
}

// Map IDs to static images (transparent PNGs in /assets/ebay)
// Put your PNGs there with transparent backgrounds.
const ebayImage = (id: string) => {
  switch (id) {
    case 'SNEAKERS': return require('../assets/ebay/sneakers.png');
    case 'DRINK_CRATE': return require('../assets/ebay/drink_crate.png');
    case 'VINTAGE_CAM': return require('../assets/ebay/vintage_cam.png');
    case 'PROTEIN': return require('../assets/ebay/protein.png');
    case 'GAMING_CHAIR': return require('../assets/ebay/gaming_chair.png');
    case 'PLANT_MON': return require('../assets/ebay/monstera.png');
    case 'SMARTWATCH': return require('../assets/ebay/smartwatch.png');
    case 'BOOK_SET': return require('../assets/ebay/books.png');
    default: return null;
  }
};

export default function Market() {
  const { shopItems, ownedItems, buyItem, sellOwnedItem, foods, eatFood, doGym, money, market, refreshMarket, buyMarketItem, time, marketPurchasedIds } = useGame();
  const [tab, setTab] = useState<'ITEMS'|'FOOD'|'GYM'|'TRADE'>('ITEMS');

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Segmented options={[
        { key:'ITEMS', label:'Items' },
        { key:'FOOD',  label:'Food'  },
        { key:'GYM',   label:'Gym'   },
        { key:'TRADE', label:'eBay'  },
      ]} value={tab} onChange={setTab} />

      {tab==='ITEMS' && shopItems.map(i => {
  const owned = ownedItems.includes(i.id);
  return (
    <View key={i.id} style={{ backgroundColor:'#ffffffee', borderRadius:16, borderWidth:1, borderColor:'#eef2f7', padding:14, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{width:0,height:4} }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={{ fontWeight:'900', fontSize:18 }}>{i.name}</Text>
        {/* Price ALWAYS visible */}
        <Badge>${i.price}</Badge>
      </View>
      <Text style={{ color:'#6b7280', marginTop:6 }}>{i.desc ?? ''}</Text>

      <View style={{ flexDirection:'row', gap:8, alignSelf:'flex-end', marginTop:10 }}>
        <Pressable
          disabled={owned || money < i.price}
          onPress={()=>buyItem(i.id)}
          style={({ pressed }) => ({
            backgroundColor: (owned || money<i.price) ? '#e5e7eb' : '#16a34a',
            paddingHorizontal:14, paddingVertical:10, borderRadius:12,
            transform:[{ scale: pressed ? 0.98 : 1 }]
          })}
        >
          <Text style={{ color:(owned || money<i.price)?'#6b7280':'#fff', fontWeight:'800' }}>Buy</Text>
        </Pressable>

        {owned && (
          <Pressable
            onPress={()=>sellOwnedItem(i.id)}
            style={({ pressed }) => ({
              backgroundColor:'#ef4444',
              paddingHorizontal:14, paddingVertical:10, borderRadius:12,
              transform:[{ scale: pressed ? 0.98 : 1 }]
            })}
          >
            <Text style={{ color:'#fff', fontWeight:'800' }}>Sell (50%)</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
})}

      {tab==='FOOD' && foods.map(f => (
        <View key={f.id} style={{ backgroundColor:'#ffffffee', borderRadius:16, borderWidth:1, borderColor:'#eef2f7', padding:14, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{width:0,height:4} }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
            <Text style={{ fontWeight:'900', fontSize:18 }}>{f.name}</Text>
            <Badge>${f.price}</Badge>
          </View>
          <Text style={{ color:'#6b7280', marginTop:6 }}>
            Effects: {[
              f.effects.happiness ? `+${f.effects.happiness} Happiness` : '',
              f.effects.health ? `+${f.effects.health} Health` : '',
              f.effects.energy !== undefined ? `${f.effects.energy>0?'+':''}${f.effects.energy} Energy` : ''
            ].filter(Boolean).join(', ')}
          </Text>
          <Pressable onPress={()=>eatFood(f.id)} disabled={money < f.price} style={{ alignSelf:'flex-end', marginTop:10, backgroundColor: money<f.price?'#e5e7eb':'#2563eb', paddingHorizontal:14, paddingVertical:10, borderRadius:12 }}>
            <Text style={{ color: money<f.price ? '#6b7280' : '#fff', fontWeight:'800' }}>{money < f.price ? 'Not enough' : 'Eat'}</Text>
          </Pressable>
        </View>
      ))}

      {tab==='GYM' && (
        <View style={{ backgroundColor:'#ffffffee', borderRadius:16, borderWidth:1, borderColor:'#eef2f7', padding:14, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{width:0,height:4} }}>
          <Text style={{ fontWeight:'900', fontSize:18 }}>Gym Session</Text>
          <Text style={{ color:'#6b7280', marginTop:6 }}>Boost stats and feel great!</Text>
          <View style={{ marginTop:8, backgroundColor:'#dcfce7', padding:12, borderRadius:12 }}>
            <Text style={{ fontWeight:'800', color:'#059669' }}>Benefits</Text>
            <Text style={{ color:'#059669' }}>+5 Fitness, +3 Health, +2 Happiness</Text>
          </View>
          <View style={{ marginTop:8, backgroundColor:'#fff7ed', padding:12, borderRadius:12 }}>
            <Text style={{ fontWeight:'800', color:'#b45309' }}>Cost</Text>
            <Text style={{ color:'#b45309' }}>$50 + 20 Energy</Text>
          </View>
          <Pressable onPress={doGym} style={{ alignSelf:'flex-end', marginTop:10, backgroundColor:'#16a34a', paddingHorizontal:14, paddingVertical:10, borderRadius:12 }}>
            <Text style={{ color:'#fff', fontWeight:'800' }}>Do</Text>
          </Pressable>
        </View>
      )}

      {tab==='TRADE' && (() => {
  const show = useToast(s => s.show);

  return (
    <View style={{ gap:10 }}>
      <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
        <Text style={{ fontWeight:'900' }}>eBay — Weekly Picks (5)</Text>
        <Badge tone="warn">Refreshes every week</Badge>
      </View>

      <Pressable
        onPress={refreshMarket}
        style={({ pressed }) => ({
          alignSelf:'flex-start',
          backgroundColor:'#e5f0ff',
          paddingHorizontal:12, paddingVertical:8, borderRadius:10,
          transform:[{ scale: pressed ? 0.98 : 1 }]
        })}
      >
        <Text style={{ color:'#2563eb', fontWeight:'800' }}>Refresh now</Text>
      </Pressable>

      {market.map(m => {
        const img = ebayImage(m.id);
        const bought = marketPurchasedIds.includes(m.id); // already bought this week?

        return (
          <View key={m.id} style={{
            backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7',
            padding:14, flexDirection:'row', alignItems:'center', gap:12,
            opacity: bought ? 0.75 : 1
          }}>
            {img ? (
              <Image source={img} style={{ width:48, height:48, resizeMode:'contain' }} />
            ) : (
              <View style={{ width:48, height:48, borderRadius:12, backgroundColor:'#f1f5f9', alignItems:'center', justifyContent:'center' }}>
                <Ionicons name={m.icon as any} size={22} color="#111827" />
              </View>
            )}

            <View style={{ flex:1 }}>
              <Text style={{ fontWeight:'800' }}>{m.name}</Text>
              {m.buff && (
                <Text style={{ color:'#6b7280' }}>
                  Buff: {[
                    m.buff.effects.happiness ? `+${m.buff.effects.happiness} Happiness` : '',
                    m.buff.effects.health ? `+${m.buff.effects.health} Health` : '',
                    m.buff.effects.energy ? `+${m.buff.effects.energy} Energy` : '',
                    m.buff.effects.fame ? `+${m.buff.effects.fame} Fame` : ''
                  ].filter(Boolean).join(', ')} for {m.buff.durationWeeks} weeks
                </Text>
              )}
            </View>

            <Pressable
              onPress={() => { buyMarketItem(m.id, 1); show(`Purchased ${m.name}`); }}
              disabled={bought}
              style={({ pressed }) => ({
                backgroundColor: bought ? '#9ca3af' : '#16a34a',
                paddingHorizontal:12, paddingVertical:8, borderRadius:10,
                transform:[{ scale: pressed ? 0.98 : 1 }]
              })}
            >
              <Text style={{ color:'#fff', fontWeight:'800' }}>
                {bought ? 'Bought' : `$${m.currentPrice}  Buy`}
              </Text>
            </Pressable>
          </View>
        );
      })}

      <Text style={{ color:'#6b7280' }}>
        Week {time.week}: New items will roll in on Next Week.
      </Text>
    </View>
  );
})()}
    </ScrollView>
  );
}
