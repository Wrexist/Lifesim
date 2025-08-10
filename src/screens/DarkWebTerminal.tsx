import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { useGame } from '../store';

type Log = { t: string };

const helpText =
`Kommandon:
help                – visar detta
status              – dark web status / USB / låst
balance             – pengar
risk                – rättslig risk
scan                – scanna mål
ddos <mål>          – försök DDoS (risk)
vpn deploy          – sätt upp VPN nod (sänker risk lite)
clear               – rensa terminal`;

export default function DarkWebTerminal() {
  const { darkWebUnlocked, hasUSB, risk, money, prisonDaysLeft } = useGame();
  const [input, setInput] = useState('');
  const [log, setLog] = useState<Log[]>([{ t: 'Dark Web v0.1 — skriv "help"' }]);
  const scrollRef = useRef<ScrollView>(null);

  const append = (t: string) => setLog(l => [...l, { t }]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [log.length]);

  const exec = (line: string) => {
    const parts = line.trim().split(/\s+/);
    const cmd = parts[0]?.toLowerCase();
    const arg = parts.slice(1).join(' ');

    if (prisonDaysLeft > 0) { append('Du sitter i fängelse. Terminal låst.'); return; }
    if (!hasUSB) { append('USB krävs. Köp i Appshop.'); return; }
    if (!darkWebUnlocked) { append('Möt NPC för att låsa upp Dark Web.'); return; }

    switch (cmd) {
      case 'help': append(helpText); break;
      case 'clear': setLog([]); break;
      case 'balance': append(`Balance: ${Math.floor(money)} kr`); break;
      case 'risk': append(`Risk: ${Math.floor(risk)}%`); break;
      case 'status':
        append(`USB: ${hasUSB ? 'OK' : 'NEJ'}, Unlocked: ${darkWebUnlocked ? 'JA' : 'NEJ'}, Risk: ${Math.floor(risk)}%`);
        break;
      case 'scan':
        append('Skannar mål… hittade 3 svaga endpoints: bank‑api, shop‑cdn, forum‑auth');
        break;
      case 'vpn':
        if (arg.toLowerCase() === 'deploy') {
          const s = useGame.getState();
          const newRisk = Math.max(0, s.risk - 5);
          useGame.setState({ risk: newRisk });
          append('VPN nod deployad. Risk -5%.');
        } else {
          append('Använd: vpn deploy');
        }
        break;
      case 'ddos': {
        if (!arg) { append('Använd: ddos <mål>'); break; }
        const s = useGame.getState();
        const hack = s.skills.hacking ?? 0;
        const successChance = Math.min(0.85, 0.30 + hack * 0.08);
        const bustedChance = Math.max(0.05, 0.20 - hack * 0.03);
        const pay = 150 + hack * 50;

        const roll = Math.random();
        if (roll < successChance) {
          useGame.setState({ money: s.money + pay, risk: Math.min(100, s.risk + 8) });
          append(`DDoS mot "${arg}" lyckades. +${pay} kr. Risk +8%.`);
        } else if (roll > 1 - bustedChance || s.risk >= 85) {
          const days = 3 + Math.floor(Math.random() * 3);
          useGame.setState({ prisonDaysLeft: days, risk: Math.min(100, s.risk + 15) });
          append(`Misslyckades & spårad. Fängelse ${days} dagar. Risk +15%.`);
        } else {
          useGame.setState({ risk: Math.min(100, s.risk + 10) });
          append('DDoS misslyckades. Risk +10%.');
        }
        break;
      }
      default:
        if (cmd) append(`Okänt kommando: ${cmd}. Skriv "help".`);
    }
  };

  const onSubmit = () => {
    const line = input;
    setInput('');
    if (!line.trim()) return;
    setLog(l => [...l, { t: `> ${line}` }]);
    exec(line);
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <View style={{ borderWidth: 1, borderRadius: 8, flex: 1, padding: 8, backgroundColor: '#0b0b0b' }}>
        <ScrollView ref={scrollRef}>
          {log.map((l, i) => (
            <Text key={i} style={{ color: '#d0ffd0', marginBottom: 4 }}>{l.t}</Text>
          ))}
        </ScrollView>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={onSubmit}
          placeholder="kommando…"
          placeholderTextColor="#aaa"
          style={{ flex: 1, borderWidth: 1, borderRadius: 8, padding: 10 }}
        />
        <Pressable onPress={onSubmit} style={{ padding: 10, borderWidth: 1, borderRadius: 8 }}>
          <Text>Kör</Text>
        </Pressable>
      </View>
    </View>
  );
}
