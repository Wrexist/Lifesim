import { View, Text, Pressable, ScrollView } from 'react-native';
import BackButton from '../components/BackButton';
import { useGame } from '../store';
import { useToast } from '../ui/Toast';

const COMPANIES = [
  { id:'FACTORY', name:'Factory', price:10000, baseRev:400 },
  { id:'RESTAURANT', name:'Restaurant', price:6000, baseRev:250 },
  { id:'AI_CO', name:'AI Company', price:15000, baseRev:600 },
  { id:'REAL_ESTATE', name:'Real Estate', price:22000, baseRev:800 },
  { id:'BANK', name:'Bank', price:30000, baseRev:1200 },
];

export default function BusinessApp() {
  const s = useGame();
  const { money, companies } = s;
  const show = useToast(t=>t.show);

  const owns = (id:string) => companies.some(c=>c.id===id);
  const canStart = (id:string) => s.educations.some(e=>e.id==='BUSINESS_101') && !owns(id);

  const start = (id:string) => {
    if (!canStart(id)) return;
    const def = COMPANIES.find(c=>c.id===id)!;
    if (s.money < def.price) return;
    s.companies.push({ id:def.id, name:def.name, employees:0, revenuePerWeek:def.baseRev, costPerWeek: def.baseRev*0.2 });
    s.money -= def.price;
    show(`Started ${def.name}`);
  };

  const hire = (id:string) => {
    const c = s.companies.find(x=>x.id===id); if (!c) return;
    c.employees += 1; c.revenuePerWeek += 100; c.costPerWeek += 40;
    show('Hired 1 employee');
  };

  const upgrade = (id:string, kind:'marketing'|'automation') => {
    const c = s.companies.find(x=>x.id===id); if (!c) return;
    if (kind==='marketing') c.revenuePerWeek += 150;
    else c.costPerWeek = Math.max(0, c.costPerWeek - 20);
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
              style={{ alignSelf:'flex-start', marginTop:8, backgroundColor:(owned||gated||money<c.price)?'#e5e7eb':'#16a34a', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}
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
                  <Text style={{ color:'#111827', fontWeight:'800' }}>Efficiency</Text>
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
