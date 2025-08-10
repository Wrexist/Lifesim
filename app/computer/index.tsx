import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import BackButton from '../../src/components/BackButton';
import { Ionicons } from '@expo/vector-icons';

function DesktopIcon({ to, icon, label }:{ to:string; icon:any; label:string }) {
  return (
    <Link href={to} asChild>
      <View style={{ width:96, alignItems:'center', gap:8 }}>
        <View style={{ width:64, height:64, borderRadius:16, backgroundColor:'#f1f5f9', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#e5e7eb' }}>
          <Ionicons name={icon} size={28} color="#111827" />
        </View>
        <Text style={{ fontWeight:'700', textAlign:'center' }}>{label}</Text>
      </View>
    </Link>
  );
}

export default function ComputerDesktop() {
  return (
    <View style={{ flex:1, padding:16 }}>
      <BackButton label="Back" />
      <Text style={{ fontSize:22, fontWeight:'900', marginBottom:12 }}>Computer</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap', gap:18 }}>
        <DesktopIcon to="/computer/darkweb" icon="laptop-outline" label="Dark Web" />
        <DesktopIcon to="/computer/ebay"    icon="cart-outline"   label="eBay" />
        <DesktopIcon to="/computer/tinder"  icon="flame-outline"  label="Tinder" />
        <DesktopIcon to="/computer/business" icon="briefcase-outline" label="Company" />
        <DesktopIcon to="/computer/crypto"  icon="logo-bitcoin"   label="Crypto" />
        <DesktopIcon to="/computer/study"   icon="book-outline"   label="Education" />
        <DesktopIcon to="/computer/relations" icon="people-outline" label="Contacts" />
        <DesktopIcon to="/computer/stocks"  icon="trending-up-outline" label="Stocks" />
        <DesktopIcon to="/computer/settings" icon="settings-outline" label="Settings" />
        {/* Add more desktop apps later */}
      </View>
    </View>
  );
}
