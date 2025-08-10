import { useState } from 'react';
import { View, Text, Button } from 'react-native';
import ProfileCard from './components/ProfileCard';
import { SEEDED_PROFILES } from '../../../lib/tinder/data/profiles';

export default function TinderScreen() {
  const [index, setIndex] = useState(0);
  const profile = SEEDED_PROFILES[index];

  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center', padding:16 }}>
      {profile ? (
        <ProfileCard profile={profile} />
      ) : (
        <Text>No more profiles today</Text>
      )}
      {profile && (
        <View style={{ flexDirection:'row', marginTop:16 }}>
          <View style={{ marginRight:16 }}>
            <Button title="Nope" onPress={() => setIndex(i => i + 1)} />
          </View>
          <Button title="Like" onPress={() => setIndex(i => i + 1)} />
        </View>
      )}
    </View>
  );
}
