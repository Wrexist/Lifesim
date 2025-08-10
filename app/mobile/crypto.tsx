import { View, Text, Pressable, ScrollView } from 'react-native';
import BackButton from '../../src/components/BackButton';
import { useState, useEffect } from 'react';
import { useToast } from '../../src/ui/Toast';
import { useGame } from '../../src/store';
import { COINS, MINERS, Coin } from '../../src/data/crypto';

export default function Crypto() {
  const {
    cryptoTarget, setMiningTarget,
    cryptoMiners, buyMiner,
    cryptoPortfolio,
  } = useGame();
  const show = useToast(t=>t.show);
  const [tab, setTab] = useState<'MINING'|'MARKET'>('MINING');

  const totalHash = cryptoMiners.reduce((a,m)=>{
    const def = MINERS.find(d=>d.id===m.id); return a + (def ? def.hash*m.count : 0);
  },0);
  const estEarn = (totalHash/1000).toFixed(4);

  const [prices, setPrices] = useState<Record<Coin,{price:number; prev:number; hist:number[]}>>(()=>{
    const obj:any={};
    COINS.forEach(c=>obj[c]={price:1000, prev:1000, hist:[1000]});
    return obj;
  });
  useEffect(()=>{
    const iv = setInterval(()=>{
      setPrices(p=>{
        const next:any={};
        COINS.forEach(c=>{
          const old = p[c];
          const price = Math.max(1, old.price*(1+(Math.random()-0.5)/20));
          const hist = [...old.hist, price].slice(-10);
          next[c]={price, prev:old.price, hist};
        });
        return next;
      });
    },30000);
    return ()=>clearInterval(iv);
  },[]);

  const spark = (vals:number[])=>{
    const chars=['▁','▂','▃','▄','▅','▆','▇'];
    const min=Math.min(...vals); const max=Math.max(...vals); const span=max-min||1;
    return vals.map(v=>chars[Math.floor((v-min)/span*(chars.length-1))]).join('');
  };

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
              <Pressable key={c} onPress={()=>setMiningTarget(c)} style={{ paddingHorizontal:12, paddingVertical:8, borderRadius:10, backgroundColor: cryptoTarget===c ? '#111827' : '#e5e7eb' }}>
                <Text style={{ color: cryptoTarget===c ? '#fff' : '#111827', fontWeight:'800' }}>{c}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={{ marginTop:8, color:'#6b7280' }}>Hashrate: <Text style={{ fontWeight:'800', color:'#111827' }}>{totalHash} H/s</Text> (~{estEarn} {cryptoTarget}/week)</Text>

          <Text style={{ marginTop:8, fontWeight:'800' }}>Miners</Text>
          {MINERS.map(m=> {
            const count = cryptoMiners.find(x=>x.id===m.id)?.count ?? 0;
            return (
              <View key={m.id} style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                <View>
                  <Text style={{ fontWeight:'800' }}>{m.name}</Text>
                  <Text style={{ color:'#6b7280' }}>{m.hash} H/s each • Owned {count}</Text>
                </View>
                <Pressable
                  onPress={()=>{ buyMiner(m.id); show(`Bought ${m.name}`); }}
                  style={{ backgroundColor:'#16a34a', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}
                >
                  <Text style={{ color:'#fff', fontWeight:'800' }}>${m.price}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      {tab==='MARKET' && (
        <View style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12, gap:8 }}>
          <Text style={{ fontWeight:'800' }}>Market</Text>
          {COINS.map(c=>{
            const info = prices[c];
            const change = ((info.price - info.prev)/info.prev)*100;
            return (
              <View key={c} style={{ marginBottom:6 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                  <Text>{c}</Text>
                  <View style={{ alignItems:'flex-end' }}>
                    <Text style={{ color: change>=0?'#16a34a':'#ef4444', fontWeight:'800' }}>${info.price.toFixed(2)}</Text>
                    <Text style={{ color: change>=0?'#16a34a':'#ef4444' }}>{change.toFixed(2)}%</Text>
                  </View>
                </View>
                <Text style={{ color:'#6b7280', fontSize:12 }}>{spark(info.hist)}</Text>
              </View>
            );
          })}
          <View style={{ marginTop:8 }}>
            <Text style={{ fontWeight:'800' }}>Portfolio</Text>
            {COINS.map(c=> (
              <Text key={c}>{c}: {cryptoPortfolio[c]?.toFixed(4) ?? 0}</Text>
            ))}
          </View>
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
