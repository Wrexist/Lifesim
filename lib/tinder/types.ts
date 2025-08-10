export type Gender = 'male' | 'female' | 'nonbinary';
export type IncomeTier = 0 | 1 | 2 | 3 | 4; // 0 none, 4 very high
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface TinderProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  jobTitle: string;
  incomeTier: IncomeTier;
  attributes: string[];
  rarity: Rarity;
  bio: string;
  photos: string[];
  tags: string[];
}

export interface Relationship {
  id: string;
  profileId: string;
  happiness: number; // 0-100
  trust: number; // 0-100
  weeklyIncome: number;
  upkeepCost: number;
  startedAtWeek: number;
  status: 'dating' | 'exclusive';
  lastDateWeek: number;
}

export interface TinderSettings {
  preference: 'male' | 'female' | 'all';
  minAge: number;
  maxAge: number;
  radiusKm: number;
}

export interface TinderState {
  dailyDeck: string[];
  swipesRemaining: number;
  superLikesRemaining: number;
  profilesSeen: Record<string, true>;
  pityActive: boolean;
  settings: TinderSettings;
}

export interface PlayerTinderInfo {
  tags: string[];
  charisma: number; // 0-1
  reputationPenalty: number; // negative modifier
}
