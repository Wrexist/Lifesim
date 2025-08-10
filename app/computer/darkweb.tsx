import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import BackButton from '../../src/components/BackButton';
import { useState } from 'react';
import { useGame } from '../../src/store';
import { useToast } from '../../src/ui/Toast';

type Tab = 'terminal' | 'browser' | 'market';

export default function DarkWeb() {
  const s = useGame();
  const { doDarkweb, unlockDarkWeb, hasUSB, darkWebUnlocked, money, devAddMoney } = useGame();
  const [tab, setTab] = useState<Tab>('terminal');
  const show = useToast(t=>t.show);

  return (
    <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
      <BackButton label="Back" />
      <Text style={{ fontSize:22, fontWeight:'900' }}>Dark Web</Text>

      {!hasUSB && (
        <View style={{ backgroundColor:'#fff7ed', borderColor:'#fed7aa', borderWidth:1, padding:12, borderRadius:12 }}>
          <Text style={{ color:'#b45309', fontWeight:'800' }}>USB device required. Buy one in Market.</Text>
        </View>
      )}
      {hasUSB && !darkWebUnlocked && (
        <Pressable onPress={()=>{ unlockDarkWeb(); show('Dark Web unlocked'); }}
          style={{ backgroundColor:'#111827', padding:12, borderRadius:12, alignSelf:'flex-start' }}>
          <Text style={{ color:'#fff', fontWeight:'800' }}>Unlock</Text>
        </Pressable>
      )}

      <View style={{ flexDirection:'row', gap:8 }}>
        <DWTab label="Terminal" active={tab==='terminal'} onPress={()=>setTab('terminal')} />
        <DWTab label="Browser" active={tab==='browser'} onPress={()=>setTab('browser')} />
        <DWTab label="Marketplace" active={tab==='market'} onPress={()=>setTab('market')} />
      </View>

      {tab==='terminal' && (
        <View style={{ backgroundColor:'#0b1020', borderRadius:12, padding:12, gap:8 }}>
          <Text style={{ color:'#7dd3fc', fontWeight:'800' }}>$ hacker@dw:~</Text>
          <Pressable onPress={()=>{ doDarkweb(); show('Hack attempt… +$60, risk up'); }}
            style={{ backgroundColor:'#16a34a', padding:10, borderRadius:10, alignSelf:'flex-start' }}>
            <Text style={{ color:'#fff', fontWeight:'800' }}>Run exploit</Text>
          </Pressable>
          <Text style={{ color:'#93c5fd' }}>Tip: Buy VPN & Proxy to reduce risk</Text>
        </View>
      )}

      {tab==='browser' && (
        <View style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12 }}>
          <Text style={{ fontWeight:'800' }}>Onion Browser (mock)</Text>
          <TextInput placeholder="Search onion site…" style={{ borderWidth:1, borderColor:'#e5e7eb', borderRadius:10, padding:10, marginTop:8 }} />
          <Text style={{ color:'#6b7280', marginTop:8 }}>Explore forums, zero-days (cosmetic for now).</Text>
        </View>
      )}

      {tab==='market' && (
        <View style={{ gap:10 }}>
          <DWItem name="VPN Subscription" price={120} onBuy={()=>show('VPN active: risk -10 permanently')} />
          <DWItem name="Proxy Chain" price={180} onBuy={()=>show('Proxies active: risk -5 during hacks')} />
          <DWItem name="Hacking Device" price={350} onBuy={()=>show('Device acquired — unlocks advanced hacks')} />
          <Text style={{ color:'#6b7280' }}>Note: You’ll hook these effects into risk math in the store (ask me to wire it if you want the full model).</Text>
        </View>
      )}
    </ScrollView>
  );
}
function DWTab({ label, active, onPress }:{ label:string; active:boolean; onPress:()=>void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal:12, paddingVertical:8, borderRadius:10, backgroundColor: active ? '#111827' : '#e5e7eb' }}>
      <Text style={{ color: active ? '#fff' : '#111827', fontWeight:'800' }}>{label}</Text>
    </Pressable>
  );
}
function DWItem({ name, price, onBuy }:{ name:string; price:number; onBuy:()=>void }) {
  return (
    <View style={{ backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', padding:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
      <Text style={{ fontWeight:'800' }}>{name}</Text>
      <Pressable onPress={onBuy} style={{ backgroundColor:'#16a34a', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}>
        <Text style={{ color:'#fff', fontWeight:'800' }}>${price}</Text>
      </Pressable>
    </View>
  );
}
