import { View, Text, Pressable } from 'react-native';

export default function Segmented<T extends string>({ options, value, onChange }:{
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={{ flexDirection:'row', backgroundColor:'#eef2f7', padding:4, borderRadius:12 }}>
      {options.map(o => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={()=> onChange(o.key)}
            style={{
              flex:1, paddingVertical:10, borderRadius:10, alignItems:'center',
              backgroundColor: active ? '#3b82f6' : 'transparent'
            }}
          >
            <Text style={{ color: active ? '#fff' : '#111827', fontWeight:'700' }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
