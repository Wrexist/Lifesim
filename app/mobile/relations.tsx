import { View, Text, Pressable } from 'react-native';
import { useGame } from '../../src/store';
import BackButton from '../../src/components/BackButton';

export default function RelationsApp() {
  const { relationship, setPartner, breakUp, giveGift, apologize } = useGame();
  const current = relationship.currentPartnerId
    ? relationship.partners.find(p => p.id === relationship.currentPartnerId)
    : undefined;

  return (
    <View style={{ padding:16, gap:12 }}>
      <BackButton label="Back" />
      <Text style={{ fontSize:18, fontWeight:'900' }}>Contacts</Text>

      {current ? (
        <View style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14 }}>
          <Text>Partner: {current?.name}</Text>
          <Text>Relationship: {relationship.relationshipPoints}/100</Text>
          <View style={{ flexDirection:'row', gap:10, marginTop:10, flexWrap:'wrap' }}>
            <Pressable onPress={()=>giveGift(50)} style={{ backgroundColor:'#16a34a', padding:10, borderRadius:10 }}><Text style={{ color:'#fff', fontWeight:'800' }}>Gift ($50)</Text></Pressable>
            <Pressable onPress={apologize} style={{ backgroundColor:'#e5e7eb', padding:10, borderRadius:10 }}><Text>Apologize</Text></Pressable>
            <Pressable onPress={breakUp} style={{ backgroundColor:'#ef4444', padding:10, borderRadius:10 }}><Text style={{ color:'#fff' }}>Break up</Text></Pressable>
          </View>
        </View>
      ) : (
        <>
          {relationship.partners.map(p => (
            <Pressable
              key={p.id}
              onPress={()=>setPartner(p.id)}
              style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14 }}
            >
              <Text style={{ fontWeight:'800' }}>{p.name}</Text>
              <Text style={{ color:'#6b7280' }}>Charm {p.charm} • Drama {p.drama}</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
}
