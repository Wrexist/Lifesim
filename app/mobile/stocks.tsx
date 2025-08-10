import { View, Text, Pressable, ScrollView } from 'react-native';
import BackButton from '../../src/components/BackButton';
import { useToast } from '../../src/ui/Toast';
import { useState, useEffect } from 'react';

const TICKERS = ['AAPL','MSFT','NVDA','AMZN','META'];

export default function Stocks() {
  const show = useToast(t=>t.show);
  const [prices, setPrices] = useState<Record<string,{price:number; prev:number; hist:number[]}>>(()=>{
    const obj:any={};
    TICKERS.forEach(t=>{ const p=100+Math.random()*200; obj[t]={price:p, prev:p, hist:[p]}; });
    return obj;
  });
  useEffect(()=>{
    const iv=setInterval(()=>{
      setPrices(p=>{
        const next:any={};
        TICKERS.forEach(t=>{
          const old=p[t];
          const price=Math.max(1, old.price*(1+(Math.random()-0.5)/20));
          const hist=[...old.hist, price].slice(-10);
          next[t]={price, prev:old.price, hist};
        });
        return next;
      });
    },30000);
    return ()=>clearInterval(iv);
  },[]);
  const spark=(vals:number[])=>{
    const chars=['▁','▂','▃','▄','▅','▆','▇'];
    const min=Math.min(...vals); const max=Math.max(...vals); const span=max-min||1;
    return vals.map(v=>chars[Math.floor((v-min)/span*(chars.length-1))]).join('');
  };
  return (
    <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
      <BackButton label="Back to Apps" />
      <Text style={{ fontSize:22, fontWeight:'900' }}>Stocks</Text>

      <View style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12 }}>
        <Text style={{ fontWeight:'800' }}>Watchlist</Text>
        {TICKERS.map(t=>{
          const info=prices[t];
          const change=((info.price-info.prev)/info.prev)*100;
          return (
            <View key={t} style={{ paddingVertical:6 }}>
              <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                <Text>{t}</Text>
                <View style={{ alignItems:'flex-end' }}>
                  <Text style={{ color:change>=0?'#16a34a':'#ef4444', fontWeight:'800' }}>${info.price.toFixed(2)}</Text>
                  <Text style={{ color:change>=0?'#16a34a':'#ef4444' }}>{change.toFixed(2)}%</Text>
                </View>
              </View>
              <Text style={{ color:'#6b7280', fontSize:12 }}>{spark(info.hist)}</Text>
            </View>
          );
        })}
        <Pressable onPress={()=>show('Order placed (mock)')} style={{ marginTop:8, alignSelf:'flex-start', backgroundColor:'#16a34a', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}>
          <Text style={{ color:'#fff', fontWeight:'800' }}>Buy AAPL</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
