import { View, Text } from 'react-native';
import { TinderProfile } from '../../../../lib/tinder/types';

export default function ProfileCard({ profile }: { profile: TinderProfile }) {
  return (
    <View style={{ width:260, padding:16, borderRadius:16, backgroundColor:'#fff', alignItems:'center' }}>
      <View style={{ width:200, height:200, backgroundColor:'#e5e7eb', borderRadius:8, marginBottom:8 }} />
      <Text style={{ fontSize:20, fontWeight:'700', marginBottom:4 }}>{profile.name}, {profile.age}</Text>
      <Text style={{ marginBottom:4 }}>{profile.jobTitle}</Text>
      <Text>{profile.bio}</Text>
    </View>
  );
}
