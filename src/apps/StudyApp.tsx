import { View, Text, Pressable, ScrollView } from 'react-native';
import { useGame } from '../store';

function Row({ label, value }:{ label:string; value:string|number }) {
  return <Text style={{ color:'#6b7280' }}>{label}: <Text style={{ color:'#111827', fontWeight:'700' }}>{value}</Text></Text>;
}

export default function StudyApp() {
  const { educations, enrolledEducationId, educationWeeksLeft, enrollEducation, doStudy, energy, money } = useGame();
  const enrolled = educations.find(e => e.id === enrolledEducationId);

  return (
    <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
      <Text style={{ fontSize:18, fontWeight:'900' }}>Education</Text>

      {enrolled ? (
        <View style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14 }}>
          <Text style={{ fontWeight:'900', fontSize:16 }}>{enrolled.name}</Text>
          <Row label="Weeks left" value={Math.ceil(educationWeeksLeft ?? 0)} />
          <Row label="Gains" value={Object.entries(enrolled.skillGains).map(([k,v])=>`${k}+${v}`).join(', ')} />
          <Pressable onPress={doStudy} disabled={energy<=0} style={{ marginTop:10, alignSelf:'flex-start', backgroundColor: energy<=0?'#e5e7eb':'#2563eb', paddingHorizontal:14, paddingVertical:10, borderRadius:10 }}>
            <Text style={{ color: energy<=0?'#6b7280':'#fff', fontWeight:'800' }}>Study now (boost)</Text>
          </Pressable>
          <Text style={{ color:'#6b7280', marginTop:6 }}>Fast Learner perk speeds this up.</Text>
        </View>
      ) : (
        <>
          {educations.map(c => (
            <View key={c.id} style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14, marginBottom:10 }}>
              <Text style={{ fontWeight:'900', fontSize:16 }}>{c.name}</Text>
              <Row label="Cost" value={`$${c.cost}`} />
              <Row label="Duration" value={`${c.weeksTotal} weeks`} />
              <Row label="Gains" value={Object.entries(c.skillGains).map(([k,v])=>`${k}+${v}`).join(', ')} />
              <Pressable
                onPress={()=>enrollEducation(c.id)}
                disabled={c.completed || money < c.cost}
                style={{ marginTop:10, alignSelf:'flex-start', backgroundColor: c.completed || money < c.cost ? '#e5e7eb' : '#16a34a', paddingHorizontal:14, paddingVertical:10, borderRadius:10 }}
              >
                <Text style={{ color: c.completed || money < c.cost ? '#6b7280' : '#fff', fontWeight:'800' }}>
                  {c.completed ? 'Completed' : money < c.cost ? 'Not enough' : 'Enroll'}
                </Text>
              </Pressable>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
