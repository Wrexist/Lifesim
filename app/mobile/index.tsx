import { View, Text, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import BackButton from '../../src/components/BackButton';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../../src/store';

function Tile({ to, icon, title, subtitle, disabled=false }:{
  to: string; icon: any; title: string; subtitle: string; disabled?: boolean;
}) {
  const content = (
    <View style={{
      flex:1, minWidth: '46%', backgroundColor:'#fff', borderRadius:16, borderWidth:1, borderColor:'#eef2f7',
      padding:16, gap:8, opacity: disabled ? 0.5 : 1
    }}>
      <View style={{ width:42, height:42, borderRadius:12, backgroundColor:'#f1f5f9', alignItems:'center', justifyContent:'center' }}>
        <Ionicons name={icon} size={22} color="#111827" />
      </View>
      <Text style={{ fontWeight:'900' }}>{title}</Text>
      <Text style={{ color:'#6b7280' }}>{subtitle}</Text>
    </View>
  );
  if (disabled) return content;
  return <Link href={to} asChild><Pressable>{content}</Pressable></Link>;
}

export default function MobileApps() {
  const { ownedItems } = useGame();
  return (
    <ScrollView contentContainerStyle={{ padding:16, gap:14 }}>
      <BackButton label="Back" />
      <Text style={{ fontSize:22, fontWeight:'900' }}>Mobile Apps</Text>

      <View style={{ flexDirection:'row', flexWrap:'wrap', gap:12 }}>
        <Tile to="/mobile/relations" icon="people-outline"   title="Contacts"    subtitle="Manage relationships" />
        <Tile to="/mobile/study"     icon="school-outline"    title="Education"   subtitle="Learn & grow" />
        <Tile to="/mobile/ebay"      icon="cart-outline"      title="eBay"        subtitle="Weekly items" />
        <Tile to="/mobile/business"  icon="briefcase-outline" title="Company"     subtitle="Build your biz" />
        <Tile to="/mobile/crypto"    icon="logo-bitcoin"      title="Crypto"      subtitle="Mine & markets" />
        <Tile to="/mobile/stocks"    icon="trending-up-outline" title="Stocks"    subtitle="Buy & hold" />
        <Tile to="/mobile/settings"  icon="settings-outline"  title="Settings"    subtitle="Preferences" />
        {/* Dark Web is computer-only */}
      </View>
    </ScrollView>
  );
}
