import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BackButton({ label = 'Back' }: { label?: string }) {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.back()} style={({ pressed }) => ({
      flexDirection:'row', alignSelf:'flex-start', alignItems:'center',
      gap:8, backgroundColor:'#f1f5f9', paddingHorizontal:14, paddingVertical:10,
      borderRadius:12, borderWidth:1, borderColor:'#e5e7eb', transform:[{ scale: pressed ? 0.98 : 1 }]
    })}>
      <Ionicons name="arrow-back" size={18} color="#111827" />
      <Text style={{ fontWeight:'800', color:'#111827' }}>{label}</Text>
    </Pressable>
  );
}
