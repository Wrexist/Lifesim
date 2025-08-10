import { View, Text, ScrollView } from 'react-native';
import BackButton from '../../src/components/BackButton';
import { useEffect, useState } from 'react';

const TICKERS = ['AAPL','MSFT','NVDA','AMZN','META'] as const;
type Ticker = typeof TICKERS[number];

export default function Stocks() {
  const [market,setMarket] = useState<Record<Ticker,{price:number, history:number[]}>>(
    TICKERS.reduce((a,t)=>({ ...a, [t]:{ price:50+Math.random()*900, history:[] } }),{} as any)
  );

  useEffect(()=>{
    const update = () => {
      setMarket(m=>{
        const next={...m};
        TICKERS.forEach(t=>{
          const prev=next[t].price;
          const price=Math.max(1, prev*(1+(Math.random()-0.5)/20));
          const history=[...next[t].history, price].slice(-20);
          next[t]={price, history};
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
      <BackButton label="Back" />
      <Text style={{ fontSize:22, fontWeight:'900' }}>Stocks</Text>

      {TICKERS.map(t=>{
        const data=market[t];
        const history=data.history;
        const prev=history[history.length-2] || data.price;
        const pct=((data.price-prev)/prev)*100;
        return (
          <View key={t} style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12, marginBottom:8 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
              <Text style={{ fontWeight:'800' }}>{t}</Text>
              <Text style={{ fontWeight:'800', color: pct>=0 ? '#16a34a' : '#dc2626' }}>${data.price.toFixed(2)} ({pct>=0?'+':''}{pct.toFixed(2)}%)</Text>
            </View>
            <View style={{ flexDirection:'row', height:30, marginTop:4 }}>
              {history.map((p,i)=>{ const max=Math.max(...history, data.price); const h=(p/max)*30; return <View key={i} style={{ width:4, height:h, backgroundColor:'#2563eb', marginRight:1, alignSelf:'flex-end' }} />; })}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
