import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
export default function Background() {
  // Static daytime gradient for now
  const colors = ['#87ceeb', '#dff6ff'];

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <LinearGradient colors={colors} style={{ flex:1 }} />
    </View>
  );
}
