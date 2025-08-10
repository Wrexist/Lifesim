import { View, Text, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { useGame } from '../src/store';
import Segmented from '../src/components/Segmented';

function ProgressBar({ pct, color='#3b82f6' }:{ pct:number; color?:string }) {
  const w = Math.max(0, Math.min(100, pct));
  return (
    <View style={{ height: 8, backgroundColor: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
      <View style={{ width: `${w}%`, height: '100%', backgroundColor: color }} />
    </View>
  );
}
function Card({ children, pressed=false }:{ children: React.ReactNode; pressed?:boolean }) {
  return (
    <View style={{
      backgroundColor:'#ffffffee',
      borderRadius:16, borderWidth:1, borderColor:'#eef2f7', padding:14,
      shadowColor:'#000', shadowOpacity:0.08, shadowRadius: pressed ? 4 : 10, shadowOffset:{ width:0, height: pressed ? 2 : 6 },
      transform:[{ scale: pressed ? 0.98 : 1 }, { translateY: pressed ? 1 : 0 }]
    }}>
      {children}
    </View>
  );
}

export default function Work() {
  const { doWork, doSideJob, jobs, energy, prisonWeeksLeft, jobUpgrades, buyJobUpgrade, money, skills, perks } = useGame();
  const [tab, setTab] = useState<'STREET'|'CAREER'>('STREET');
  const list = tab === 'STREET' ? jobs.filter(j=>j.street) : jobs.filter(j=>!j.street);

  // helpers to mirror store math so the UI updates instantly
  const hasPerk = (p: string) => perks.includes(p as any);
  const penaltyFor = (job: any) => {
    const req = job.skillReq ?? {};
    const missing = Object.entries(req).some(([k,v]) => (skills as any)[k] < (v ?? 0));
    return missing ? 0.85 : 1;
  };
  const payBoostFor = (jobId: string) => 1 + (jobUpgrades[jobId]?.incomeBoostLvl ?? 0) * 0.1;
  const energySaverFor = (jobId: string) => (jobUpgrades[jobId]?.energySaverLvl ?? 0);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Segmented options={[{ key:'STREET', label:'Street Jobs' },{ key:'CAREER', label:'Careers' }]} value={tab} onChange={setTab} />

      {list.map(j => {
        const upIncome = payBoostFor(j.id);
        const upSaver = energySaverFor(j.id);

        // ENERGY (display)
        const streetMin = Math.max(1, 15 - upSaver);
        const streetMax = Math.max(streetMin, 20 - upSaver);
        const careerEnergy = Math.max(1, 8 - upSaver);

        // EARNINGS (display)
        const base = j.basePayPerHour;
        const hours = j.street ? 6 : 8;
        const workPay = hasPerk('WORK_PAY') ? 1.5 : 1;
        const penalty = penaltyFor(j);
        const expected = Math.round(base * hours * workPay * penalty * upIncome);

        // progress
        const need = j.xpToPromote ?? (j.street ? 6 : 8);
        const pct = ((j.xp ?? 0) / need) * 100;

        const disabled = energy <= 0 || prisonWeeksLeft > 0;
        const action = j.street ? () => doSideJob(j.id) : () => doWork(j.id);

        const up = jobUpgrades[j.id] || { incomeBoostLvl:0, energySaverLvl:0 };
        const incomeCost = 100 + up.incomeBoostLvl*150;
        const saverCost = 100 + up.energySaverLvl*150;

        return (
          <Pressable key={j.id} onPress={action}>
            {({ pressed }) => (
              <Card pressed={pressed}>
                <Text style={{ fontWeight:'900', fontSize:18 }}>{j.title} <Text style={{ color:'#64748b' }}>• Tier {j.tier}</Text></Text>
                <Text style={{ color:'#6b7280', marginTop:4 }}>{j.street ? 'Street income with luck' : 'Steady income, chance to promote'}</Text>
                <ProgressBar pct={pct} color={j.street ? '#22c55e' : '#3b82f6'} />

                <View style={{ flexDirection:'row', gap:14, marginTop:10 }}>
                  <Text style={{ color:'#dc2626' }}>
                    {j.street ? `-${streetMin}~${streetMax} Energy` : `-${careerEnergy} Energy`}
                  </Text>
                  <Text style={{ color:'#16a34a' }}>${expected} avg</Text>
                </View>

                {/* Upgrades */}
                <View style={{ marginTop:10, flexDirection:'row', gap:8, flexWrap:'wrap' }}>
                  <Pressable onPress={()=>buyJobUpgrade(j.id,'income')} disabled={money<incomeCost} style={{ backgroundColor: money<incomeCost?'#e5e7eb':'#16a34a', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}>
                    <Text style={{ color: money<incomeCost?'#6b7280':'#fff', fontWeight:'800' }}>Income Boost Lv{up.incomeBoostLvl} (${incomeCost})</Text>
                  </Pressable>
                  <Pressable onPress={()=>buyJobUpgrade(j.id,'energy')} disabled={money<saverCost} style={{ backgroundColor: money<saverCost?'#e5e7eb':'#2563eb', paddingHorizontal:12, paddingVertical:8, borderRadius:10 }}>
                    <Text style={{ color: money<saverCost?'#6b7280':'#fff', fontWeight:'800' }}>Energy Saver Lv{up.energySaverLvl} (${saverCost})</Text>
                  </Pressable>
                </View>

                <View style={{ alignItems:'flex-end', marginTop:10 }}>
                  <View style={{ backgroundColor: disabled ? '#e5e7eb' : '#2563eb', paddingHorizontal:14, paddingVertical:10, borderRadius:12 }}>
                    <Text style={{ color: disabled ? '#6b7280' : '#fff', fontWeight:'800' }}>
                      {disabled ? 'No Energy' : 'Work'}
                    </Text>
                  </View>
                </View>
              </Card>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
