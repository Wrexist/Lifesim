import { View, Text, Pressable } from 'react-native';
import { useGame } from '../../src/store';
import BackButton from '../../src/components/BackButton';

export default function SettingsApp() {
  const { name, reset } = useGame();
  return (
    <View style={{ padding:16, gap:12 }}>
      <BackButton label="Back" />
      <Text style={{ fontSize:18, fontWeight:'900' }}>Settings</Text>
      <Text>Player: {name}</Text>
      <Pressable onPress={reset} style={{ backgroundColor:'#ef4444', padding:10, borderRadius:10, alignSelf:'flex-start' }}>
        <Text style={{ color:'#fff', fontWeight:'800' }}>Reset save</Text>
      </Pressable>
    </View>
  );
}
