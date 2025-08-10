export const COINS = ['BTC','ETH','SOL','BNB','XRP'] as const;
export type Coin = typeof COINS[number];

export const MINERS = [
  { id:'USB_MINER', name:'USB Miner', price:120, hash:5 },
  { id:'GPU_RIG', name:'GPU Rig', price:800, hash:40 },
  { id:'ASIC_LITE', name:'ASIC Lite', price:1600, hash:90 },
  { id:'ASIC_PRO', name:'ASIC Pro', price:3200, hash:200 },
];
