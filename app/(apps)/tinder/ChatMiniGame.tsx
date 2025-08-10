import { View, Text, Button } from 'react-native';
import { useState } from 'react';

export default function ChatMiniGame({ onEnd }: { onEnd: (compatibility: number) => void }) {
  const [step, setStep] = useState(0);
  if (step > 2) {
    onEnd(Math.random());
    return <Text>Done</Text>;
  }
  return (
    <View style={{ padding:16 }}>
      <Text style={{ marginBottom:12 }}>Chat question {step + 1}</Text>
      <Button title="Option A" onPress={() => setStep(step + 1)} />
      <Button title="Option B" onPress={() => setStep(step + 1)} />
    </View>
  );
}
