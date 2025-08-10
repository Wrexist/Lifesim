import { View, Text, Image, Pressable } from 'react-native';

type Props = {
  title: string;
  subtitle: string;
  icon: any;              // require(...)
  onPress: () => void;
};

export default function ActivityCard({ title, subtitle, icon, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={{
      width: '48%',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderRadius: 16,
      padding: 10,
      borderWidth: 1
    }}>
      <View style={{ flexDirection:'row', gap:10, alignItems:'center' }}>
        <Image source={icon} style={{ width:36, height:36, borderRadius:8 }} />
        <View style={{ flex:1 }}>
          <Text style={{ fontWeight:'700' }}>{title}</Text>
          <Text style={{ opacity:0.7 }}>{subtitle}</Text>
        </View>
      </View>
    </Pressable>
  );
}
