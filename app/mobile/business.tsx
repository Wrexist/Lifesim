import { View, Text, Pressable, ScrollView } from 'react-native';
import BackButton from '../../src/components/BackButton';
import { useGame } from '../../src/store';
import { useToast } from '../../src/ui/Toast';
import { useState } from 'react';

const COMPANIES = [
  { id:'FOOD_TRUCK', name:'Food Truck',     price:800,  baseRev:60 },
  { id:'PRINT_SHOP', name:'Print Shop',     price:1500, baseRev:110 },
  { id:'APP_STUDIO', name:'App Studio',     price:2200, baseRev:160 },
  { id:'ECOM_BRAND', name:'E‑Com Brand',    price:2800, baseRev:210 },
  { id:'MINI_SAAS',  name:'Mini‑SaaS',      price:4000, baseRev:300 },
];

export default function Business() {
  const s = useGame();
  const { money, companies, setDevMode } = s;
  const show = useToast(t=>t.show);
  const [selection, setSel] = useState<string>();

  const owns = (id:string) => companies.some(c=>c.id===id);
  const canStart = (id:string) => s.educations.some(e=>e.id==='BUSINESS_101') && !owns(id);

  // helpers wired to store below (very minimal placeholder actions)
  const start = (id:string) => {
    if (!canStart(id)) return;
    const def = COMPANIES.find(c=>c.id===id)!;
    if (s.money < def.price) return;
    s.companies.push({ id:def.id, name:def.name, employees:0, revenuePerWeek:def.baseRev, costPerWeek:10 });
    s.money -= def.price;
    show(`Started ${def.name}`);
  };

  const hire = (id:string) => {
    const c = s.companies.find(x=>x.id===id); if (!c) return;
    c.employees += 1; c.revenuePerWeek += 25; c.costPerWeek += 10;
    show('Hired 1 employee');
  };

  const upgrade = (id:string, kind:'marketing'|'automation') => {
    const c = s.companies.find(x=>x.id===id); if (!c) return;
    if (kind==='marketing') c.revenuePerWeek += 35;
    else c.costPerWeek = Math.max(0, c.costPerWeek - 5);
    show(`Upgraded ${kind}`);
  };

  return (
    <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
      <BackButton label="Back" />
      <Text style={{ fontSize:22, fontWeight:'900' }}>Companies</Text>

      <Text style={{ color:'#6b7280' }}>Requires: <Text style={{ fontWeight:'800' }}>Business 101</Text></Text>

      {COMPANIES.map(c => {
        const owned = owns(c.id);
        const gated = !s.educations.some(e=>e.id==='BUSINESS_101');
        return (
          <View key={c.id} style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#e5e7eb', padding:14 }}>
            <Text style={{ fontWeight:'900' }}>{c.name}</Text>
            <Text style={{ color:'#16a34a', fontWeight:'800' }}>{owned ? 'Owned' : `$${c.price}`}</Text>
            <Text style={{ color:'#6b7280' }}>Base revenue ~ ${c.baseRev}/week</Text>
            <Pressable
              onPress={()=>start(c.id)}
              disabled={owned || gated || money < c.price}
              style={{ alignSelf:'flex-start', marginTop:8, backgroundColor: (owned||gated||money<c.price)?'#e5e7eb':'#16a34a', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}
            >
              <Text style={{ color:(owned||gated||money<c.price)?'#6b7280':'#fff', fontWeight:'800' }}>
                {owned ? 'Owned' : gated ? 'Need Business 101' : 'Start'}
              </Text>
            </Pressable>

            {owned && (
              <View style={{ flexDirection:'row', gap:8, marginTop:10 }}>
                <Pressable onPress={()=>hire(c.id)} style={{ backgroundColor:'#2563eb', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}>
                  <Text style={{ color:'#fff', fontWeight:'800' }}>Hire</Text>
                </Pressable>
                <Pressable onPress={()=>upgrade(c.id,'marketing')} style={{ backgroundColor:'#f59e0b', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}>
                  <Text style={{ color:'#111827', fontWeight:'800' }}>Marketing</Text>
                </Pressable>
                <Pressable onPress={()=>upgrade(c.id,'automation')} style={{ backgroundColor:'#a78bfa', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}>
                  <Text style={{ color:'#111827', fontWeight:'800' }}>Automation</Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      })}

      <Text style={{ color:'#6b7280' }}>Weekly: revenue is added, costs are deducted on Next Week.</Text>
    </ScrollView>
  );
}
