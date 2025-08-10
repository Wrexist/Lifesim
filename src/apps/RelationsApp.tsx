import { View, Text, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { useGame } from '../store';

export default function RelationsApp() {
  const { relationship, setPartner, breakUp, giveGift, apologize } = useGame();
  const current = relationship.currentPartnerId
    ? relationship.partners.find(p => p.id === relationship.currentPartnerId)
    : undefined;
  const [viewing, setViewing] = useState<typeof relationship.partners[number] | undefined>();

  return (
    <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
      <Text style={{ fontSize:18, fontWeight:'900' }}>Contacts</Text>

      {current && !viewing ? (
        <View style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14 }}>
          <Text>Partner: {current?.name}</Text>
          <Text>Relationship: {relationship.relationshipPoints}/100</Text>
          <View style={{ flexDirection:'row', gap:10, marginTop:10, flexWrap:'wrap' }}>
            <Pressable onPress={()=>giveGift(50)} style={{ backgroundColor:'#16a34a', padding:10, borderRadius:10 }}><Text style={{ color:'#fff', fontWeight:'800' }}>Gift ($50)</Text></Pressable>
            <Pressable onPress={apologize} style={{ backgroundColor:'#e5e7eb', padding:10, borderRadius:10 }}><Text>Apologize</Text></Pressable>
            <Pressable onPress={breakUp} style={{ backgroundColor:'#ef4444', padding:10, borderRadius:10 }}><Text style={{ color:'#fff' }}>Break up</Text></Pressable>
          </View>
        </View>
      ) : viewing ? (
        <View style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14, gap:8 }}>
          <Text style={{ fontWeight:'800' }}>{viewing.name}</Text>
          <Text style={{ color:'#6b7280' }}>Charm {viewing.charm} • Drama {viewing.drama}</Text>
          <View style={{ flexDirection:'row', gap:10, marginTop:10, flexWrap:'wrap' }}>
            <Pressable onPress={()=>{ setPartner(viewing.id); setViewing(undefined); }} style={{ backgroundColor:'#16a34a', padding:10, borderRadius:10 }}><Text style={{ color:'#fff', fontWeight:'800' }}>Select</Text></Pressable>
            <Pressable onPress={()=>setViewing(undefined)} style={{ backgroundColor:'#e5e7eb', padding:10, borderRadius:10 }}><Text>Back</Text></Pressable>
          </View>
        </View>
      ) : (
        <>
          {relationship.partners.map(p => (
            <Pressable
              key={p.id}
              onPress={()=>setViewing(p)}
              style={{ backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:'#eef2f7', padding:14 }}
            >
              <Text style={{ fontWeight:'800' }}>{p.name}</Text>
              <Text style={{ color:'#6b7280' }}>Charm {p.charm} • Drama {p.drama}</Text>
            </Pressable>
          ))}
        </>
      )}
    </ScrollView>
  );
}
