import { useGame } from './store';

export const rewardEnergy = (amount = 15) => {
  const s = useGame.getState();
  useGame.setState({ energy: Math.min(100, s.energy + amount) });
};

export const rewardCash = (amount = 50) => {
  const s = useGame.getState();
  useGame.setState({ money: s.money + amount });
};

export const applyIAP = (sku: 'STARTER_PACK' | 'YOUTH_PILL' | 'SANDBOX' | 'PERKS_BUNDLE') => {
  const s = useGame.getState();
  switch (sku) {
    case 'STARTER_PACK':
      useGame.setState({ money: s.money + 1000, energy: Math.min(100, s.energy + 30) });
      break;
    case 'YOUTH_PILL':
      // Exempel: återställ studietrötthet eller liknande
      useGame.setState({ happiness: Math.min(100, s.happiness + 10) });
      break;
    case 'SANDBOX':
      // Exempel: oändlig energi-devläge (enkelt toggle kan införas)
      useGame.setState({ energy: 100, money: s.money + 5000 });
      break;
    case 'PERKS_BUNDLE':
      useGame.setState({
        perks: Array.from(new Set([...s.perks, 'WORK_PAY', 'MINDSET', 'FAST_LEARNER', 'GOOD_CREDIT']))
      });
      break;
  }
};
