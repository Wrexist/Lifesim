import { View, Text, Pressable, ScrollView } from 'react-native';
import BackButton from '../../src/components/BackButton';
import { useState, useEffect } from 'react';
import { useToast } from '../../src/ui/Toast';
import { useGame } from '../../src/store';
import type { Coin } from '../../src/types';

const COINS = ['BTC','ETH','SOL','BNB','XRP'] as const;
const MINERS = [
  { id:'USB_MINER',   name:'USB Miner',     price:120,  hash:  5 },
  { id:'GPU_RIG',     name:'GPU Rig',       price:800,  hash: 40 },
  { id:'ASIC_LITE',   name:'ASIC Lite',     price:1600, hash: 90 },
  { id:'ASIC_PRO',    name:'ASIC Pro',      price:3200, hash:200 },
];

export default function Crypto() {
  const s = useGame();
  const show = useToast(t=>t.show);
  const [tab, setTab] = useState<'MINING'|'MARKET'>('MINING');

  const totalHash = Object.entries(s.cryptoMiners).reduce((a,[id,count])=>{
    const def = MINERS.find(m=>m.id===id); return a + (def?def.hash*count:0);
  },0);
  const est = totalHash/1000;

  const [market,setMarket] = useState<Record<Coin,{price:number, history:number[]}>>(
    COINS.reduce((acc,c)=>({ ...acc, [c]:{ price:1000+Math.random()*8000, history:[] } }),{} as any)
  );

  useEffect(()=>{
    const update=()=>{
      setMarket(m=>{
        const next={...m};
        COINS.forEach(c=>{
          const prev=next[c].price;
          const price=Math.max(1, prev*(1+(Math.random()-0.5)/20));
          const history=[...next[c].history, price].slice(-20);
          next[c]={price, history};
        });
        return next;
      });
    };
    update();
    const id=setInterval(update,30000);
    return ()=>clearInterval(id);
  },[]);

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
              <Pressable key={c} onPress={()=>s.setCryptoTarget(c)} style={{ paddingHorizontal:12, paddingVertical:8, borderRadius:10, backgroundColor: s.cryptoTarget===c ? '#111827' : '#e5e7eb' }}>
                <Text style={{ color: s.cryptoTarget===c ? '#fff' : '#111827', fontWeight:'800' }}>{c}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={{ marginTop:8, color:'#6b7280' }}>
            Hashrate: <Text style={{ fontWeight:'800', color:'#111827' }}>{totalHash} H/s</Text> (≈ {est.toFixed(4)} {s.cryptoTarget}/week)
          </Text>

          <Text style={{ marginTop:8, fontWeight:'800' }}>Miners</Text>
          {MINERS.map(m=>{
            const count = s.cryptoMiners[m.id] || 0;
            return (
              <View key={m.id} style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                <View>
                  <Text style={{ fontWeight:'800' }}>{m.name}</Text>
                  <Text style={{ color:'#6b7280' }}>{m.hash} H/s</Text>
                  {count>0 && <Text style={{ color:'#6b7280' }}>Qty: {count}</Text>}
                </View>
                <Pressable
                  onPress={()=>{ s.buyMiner(m.id); if(s.money>=m.price) show(`Bought ${m.name}`); }}
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
        <View style={{ gap:12 }}>
          {COINS.map(c=>{
            const data=market[c];
            const history=data.history;
            const prev=history[history.length-2] || data.price;
            const pct=((data.price-prev)/prev)*100;
            const holding=s.cryptoPortfolio[c]||0;
            return (
              <View key={c} style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12, marginBottom:8 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                  <Text style={{ fontWeight:'800' }}>{c}</Text>
                  <Text style={{ fontWeight:'800', color: pct>=0 ? '#16a34a' : '#dc2626' }}>${data.price.toFixed(2)} ({pct>=0?'+':''}{pct.toFixed(2)}%)</Text>
                </View>
                <View style={{ flexDirection:'row', height:30, marginTop:4 }}>
                  {history.map((p,i)=>{ const max=Math.max(...history, data.price); const h=(p/max)*30; return <View key={i} style={{ width:4, height:h, backgroundColor:'#2563eb', marginRight:1, alignSelf:'flex-end' }} />; })}
                </View>
                <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:8, alignItems:'center' }}>
                  <Text>Holding: {holding.toFixed(4)}</Text>
                  {holding>0 && (
                    <Pressable onPress={()=>{ s.sellCrypto(c, holding, data.price); show(`Sold ${holding.toFixed(4)} ${c}`); }} style={{ backgroundColor:'#dc2626', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}>
                      <Text style={{ color:'#fff', fontWeight:'800' }}>Sell All</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
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
