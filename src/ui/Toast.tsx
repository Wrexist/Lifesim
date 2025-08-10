import { create } from 'zustand';
import { View, Text } from 'react-native';
import * as React from 'react';

type ToastState = {
  msg?: string;
  show: (m: string) => void;
  hide: () => void;
};
export const useToast = create<ToastState>((set) => ({
  msg: undefined,
  show: (m) => { set({ msg: m }); setTimeout(() => set({ msg: undefined }), 1500); },
  hide: () => set({ msg: undefined })
}));

export function ToastPortal() {
  const msg = useToast(s => s.msg);
  if (!msg) return null;
  return (
    <View style={{
      position:'absolute', bottom:90, alignSelf:'center',
      backgroundColor:'#111827ee', paddingHorizontal:16, paddingVertical:12,
      borderRadius:12, maxWidth:'80%'
    }}>
      <Text style={{ color:'#fff', fontWeight:'800' }}>{msg}</Text>
    </View>
  );
}
