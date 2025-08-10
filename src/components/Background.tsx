import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '../store';

export default function Background() {
  const { time } = useGame();
  const h = time.hour;

  // Enkel dag/kväll-logik
  const isNight = h < 6 || h >= 20;
  const isSunset = (h >= 18 && h < 20) || (h >= 6 && h < 8);

  const colors = isNight
    ? ['#0b0f2e', '#01030a']         // natt
    : isSunset
      ? ['#f6b26b', '#1e2761']       // solnedgång/uppgång
      : ['#87ceeb', '#dff6ff'];      // dag

  return (
    <View style={{ position:'absolute', inset:0 }}>
      <LinearGradient colors={colors} style={{ flex:1 }} />
    </View>
  );
}
