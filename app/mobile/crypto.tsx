import { View, Text, Pressable, ScrollView } from 'react-native';
import BackButton from '../../src/components/BackButton';
import { useState } from 'react';
import { useToast } from '../../src/ui/Toast';
import { useGame } from '../../src/store';

const COINS = ['BTC','ETH','SOL','BNB','XRP'] as const;
type Coin = typeof COINS[number];

const MINERS = [
  { id:'USB_MINER',   name:'USB Miner',     price:120,  hash:  5 },
  { id:'GPU_RIG',     name:'GPU Rig',       price:800,  hash: 40 },
  { id:'ASIC_LITE',   name:'ASIC Lite',     price:1600, hash: 90 },
  { id:'ASIC_PRO',    name:'ASIC Pro',      price:3200, hash: 200 },
];

export default function Crypto() {
  const s = useGame();
  const show = useToast(t=>t.show);
  const [tab, setTab] = useState<'MINING'|'MARKET'>('MINING');

  // simple in‑component state until store actions are added
  const [target, setTarget] = useState<Coin>('BTC');
  const [owned, setOwned] = useState<string[]>([]);
  const [balances, setBalances] = useState<Record<Coin, number>>({ BTC:0, ETH:0, SOL:0, BNB:0, XRP:0 });

  const totalHash = owned.reduce((a,id)=>a+(MINERS.find(m=>m.id===id)?.hash||0),0);

  return (
    <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
      <BackButton label="Back to Apps" />
      <Text style={{ fontSize:22, fontWeight:'900' }}>Crypto</Text>

      <View style={{ flexDirection:'row', gap:8 }}>
        <TabBtn label="Mining" active={tab==='MINING'} onPress={()=>setTab('MINING')} />
        <TabBtn label="Market" active={tab==='MARKET'} onPress={()=>setTab('MARKET')} />
      </View>

      {tab==='MINING' && (
        <View style={{ gap:10 }}>
          <Text style={{ fontWeight:'800' }}>Choose Coin to Mine</Text>
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
            {COINS.map(c=>(
              <Pressable key={c} onPress={()=>setTarget(c)} style={{ paddingHorizontal:12, paddingVertical:8, borderRadius:10, backgroundColor: target===c ? '#111827' : '#e5e7eb' }}>
                <Text style={{ color: target===c ? '#fff' : '#111827', fontWeight:'800' }}>{c}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={{ marginTop:8, color:'#6b7280' }}>Hashrate: <Text style={{ fontWeight:'800', color:'#111827' }}>{totalHash} H/s</Text></Text>

          <Text style={{ marginTop:8, fontWeight:'800' }}>Miners</Text>
          {MINERS.map(m=> {
            const have = owned.includes(m.id);
            return (
              <View key={m.id} style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                <View>
                  <Text style={{ fontWeight:'800' }}>{m.name}</Text>
                  <Text style={{ color:'#6b7280' }}>{m.hash} H/s</Text>
                </View>
                <Pressable
                  onPress={()=>{ setOwned(o=>[...o,m.id]); show(`Bought ${m.name}`); }}
                  disabled={have}
                  style={{ backgroundColor: have ? '#e5e7eb' : '#16a34a', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}
                >
                  <Text style={{ color: have ? '#6b7280' : '#fff', fontWeight:'800' }}>
                    {have ? 'Owned' : `$${m.price}`}
                  </Text>
                </Pressable>
              </View>
            );
          })}

          <Pressable
            onPress={()=>{
              // super simple weekly mining: coins += hash/1000
              setBalances(b => ({ ...b, [target]: (b[target] ?? 0) + totalHash/1000 }));
              show(`Mined ${ (totalHash/1000).toFixed(4) } ${target}`);
            }}
            style={{ alignSelf:'flex-start', backgroundColor:'#2563eb', paddingHorizontal:12, paddingVertical:10, borderRadius:12 }}
          >
            <Text style={{ color:'#fff', fontWeight:'800' }}>Mine Now</Text>
          </Pressable>

          <View style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12 }}>
            <Text style={{ fontWeight:'800' }}>Balances</Text>
            {COINS.map(c=> <Text key={c}>{c}: {balances[c]?.toFixed(4) ?? 0}</Text>)}
          </View>
        </View>
      )}

      {tab==='MARKET' && (
        <View style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12, gap:8 }}>
          <Text style={{ fontWeight:'800' }}>Top 5 Coins (mock)</Text>
          {COINS.map(c=>(
            <View key={c} style={{ flexDirection:'row', justifyContent:'space-between' }}>
              <Text>{c}</Text>
              <Text style={{ color:'#16a34a', fontWeight:'800' }}>${(1000 + Math.random()*8000 | 0)}</Text>
            </View>
          ))}
          <Text style={{ color:'#6b7280' }}>Hook into real pricing later if desired.</Text>
        </View>
      )}
    </ScrollView>
  );
}
function TabBtn({ label, active, onPress }:{ label:string; active:boolean; onPress:()=>void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal:12, paddingVertical:8, borderRadius:10, backgroundColor: active ? '#111827' : '#e5e7eb' }}>
      <Text style={{ color: active ? '#fff' : '#111827', fontWeight:'800' }}>{label}</Text>
    </Pressable>
  );
}
