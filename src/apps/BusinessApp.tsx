import { View, Text, Pressable, ScrollView } from 'react-native';
import BackButton from '../components/BackButton';
import { useGame } from '../store';
import { useToast } from '../ui/Toast';
import { COMPANIES } from '../data/companies';

export default function BusinessApp() {
  const {
    money, companies, educations,
    startCompany, hireEmployee,
    upgradeMarketing, automateCompany,
    upgradeCashflow,
  } = useGame();
  const show = useToast(t=>t.show);

  const owns = (id:string) => companies.some(c=>c.id===id);
  const hasEdu = educations.some(e=>e.id==='BUSINESS_101');

  return (
    <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
      <BackButton label="Back" />
      <Text style={{ fontSize:22, fontWeight:'900' }}>Companies</Text>

      {!hasEdu && (
        <Text style={{ color:'#6b7280' }}>Requires: <Text style={{ fontWeight:'800' }}>Business 101</Text></Text>
      )}

      {COMPANIES.map(c => {
        const owned = owns(c.id);
        const gated = !hasEdu;
        const ownedCompany = companies.find(x=>x.id===c.id);
        return (
          <View key={c.id} style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#e5e7eb', padding:14 }}>
            <Text style={{ fontWeight:'900' }}>{c.name}</Text>
            <Text style={{ color:'#16a34a', fontWeight:'800' }}>{owned ? 'Owned' : `$${c.price}`}</Text>
            <Text style={{ color:'#6b7280' }}>Base revenue ~ ${c.baseRev}/week</Text>
            <Pressable
              onPress={()=>{ startCompany(c.id); show(`Started ${c.name}`); }}
              disabled={owned || gated || money < c.price}
              style={{ alignSelf:'flex-start', marginTop:8, backgroundColor:(owned||gated||money<c.price)?'#e5e7eb':'#16a34a', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}
            >
              <Text style={{ color:(owned||gated||money<c.price)?'#6b7280':'#fff', fontWeight:'800' }}>
                {owned ? 'Owned' : gated ? 'Need Business 101' : 'Start'}
              </Text>
            </Pressable>
            {owned && ownedCompany && (
              <View style={{ gap:8, marginTop:10 }}>
                <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
                  <Pressable onPress={()=>{ hireEmployee(c.id); show('Hired 1 employee'); }} disabled={ownedCompany.employees>=25} style={{ backgroundColor:'#2563eb', paddingHorizontal:12, paddingVertical:8, borderRadius:10, opacity:ownedCompany.employees>=25?0.5:1 }}>
                    <Text style={{ color:'#fff', fontWeight:'800' }}>Hire (+$100/-$40)</Text>
                  </Pressable>
                  <Pressable onPress={()=>{ upgradeMarketing(c.id,1); show('Marketing upgraded (S)'); }} disabled={ownedCompany.marketingLevel>=1} style={{ backgroundColor:'#f59e0b', paddingHorizontal:12, paddingVertical:8, borderRadius:10, opacity:ownedCompany.marketingLevel>=1?0.5:1 }}>
                    <Text style={{ color:'#111827', fontWeight:'800' }}>Marketing S ($500)</Text>
                  </Pressable>
                  <Pressable onPress={()=>{ upgradeMarketing(c.id,2); show('Marketing upgraded (M)'); }} disabled={ownedCompany.marketingLevel>=2} style={{ backgroundColor:'#f59e0b', paddingHorizontal:12, paddingVertical:8, borderRadius:10, opacity:ownedCompany.marketingLevel>=2?0.5:1 }}>
                    <Text style={{ color:'#111827', fontWeight:'800' }}>Marketing M ($1000)</Text>
                  </Pressable>
                  <Pressable onPress={()=>{ upgradeMarketing(c.id,3); show('Marketing upgraded (L)'); }} disabled={ownedCompany.marketingLevel>=3} style={{ backgroundColor:'#f59e0b', paddingHorizontal:12, paddingVertical:8, borderRadius:10, opacity:ownedCompany.marketingLevel>=3?0.5:1 }}>
                    <Text style={{ color:'#111827', fontWeight:'800' }}>Marketing L ($2000)</Text>
                  </Pressable>
                  <Pressable onPress={()=>{ automateCompany(c.id); show('Automation purchased'); }} disabled={ownedCompany.automated} style={{ backgroundColor:'#a78bfa', paddingHorizontal:12, paddingVertical:8, borderRadius:10, opacity:ownedCompany.automated?0.5:1 }}>
                    <Text style={{ color:'#111827', fontWeight:'800' }}>Automation ($5000)</Text>
                  </Pressable>
                  <Pressable onPress={()=>{ upgradeCashflow(c.id); show('Cashflow upgrade'); }} disabled={ownedCompany.cashflowLevel>=1} style={{ backgroundColor:'#4ade80', paddingHorizontal:12, paddingVertical:8, borderRadius:10, opacity:ownedCompany.cashflowLevel>=1?0.5:1 }}>
                    <Text style={{ color:'#111827', fontWeight:'800' }}>Cashflow ($3000)</Text>
                  </Pressable>
                </View>
                <Text style={{ color:'#6b7280' }}>Hire adds $100 revenue / $40 cost per week (max 25).</Text>
                <Text style={{ color:'#6b7280' }}>Marketing boosts revenue; higher tiers stack.</Text>
                <Text style={{ color:'#6b7280' }}>Automation cuts costs by $20/week once.</Text>
                <Text style={{ color:'#6b7280' }}>Cashflow adds $200 revenue/week once.</Text>
              </View>
            )}
          </View>
        );
      })}

      <Text style={{ color:'#6b7280' }}>Weekly: revenue is added, costs are deducted on Next Week.</Text>
    </ScrollView>
  );
}
