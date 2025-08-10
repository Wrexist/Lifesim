import type {
  TinderState,
  Relationship as TinderRelationship,
  PlayerTinderInfo,
} from '../lib/tinder/types';

export type Perk = 'WORK_PAY' | 'MINDSET' | 'FAST_LEARNER' | 'GOOD_CREDIT';

export interface Skills { coding: number; business: number; social: number; fitness: number; hacking: number; }

export interface Job {
  id: string;
  title: string;
  titleSeries?: string[];
  tier: number;
  basePayPerHour: number;
  skillReq?: Partial<Skills>;
  street?: boolean;
  promotionChanceBase: number;
  xp?: number;
  xpToPromote?: number;
}

export interface Education {
  id: string;
  name: string;
  cost: number;
  weeksTotal: number;
  skillGains: Partial<Skills>;
  unlocksJobs?: string[];
}

export interface Home { id: string; name: string; weeklyEnergy: number; weeklyHappiness: number; rentPerMonth: number; furnitureSlots: number; }
export interface Furniture { id: string; name: string; energyBonus: number; happinessBonus: number; }
export interface Company {
  id: string;
  name: string;
  employees: number;
  revenuePerWeek: number;
  costPerWeek: number;
  marketingLevel: number;
  automated: boolean;
  cashflowLevel: number;
}
export interface Loan { id: string; principal: number; annualRate: number; monthlyPayment: number; }
export interface Time { week: number; year: number; }

export interface Partner { id: string; name: string; charm: number; drama: number; }
export interface RelationshipState { currentPartnerId?: string; partners: Partner[]; relationshipPoints: number; }

export interface MarketBuff {
  id: string;
  name: string;
  weeksLeft: number;
  effects: { energy?: number; happiness?: number; health?: number; fame?: number };
}

export interface MarketItem {
  id: string;
  name: string;
  icon: string; // Ionicons name
  basePrice: number;
  volatility: number;
  currentPrice: number;
  buff?: { effects: MarketBuff['effects']; durationWeeks: number };
}

export interface InventoryItem { id: string; itemId: string; name: string; qty: number; avgBuyPrice: number; listed?: boolean; listPrice?: number; }

export interface ShopItem { id: string; name: string; price: number; desc?: string; }
export interface Food { id: string; name: string; price: number; effects: { energy?: number; happiness?: number; health?: number }; }
export interface FurnitureSetBonus { id: string; name: string; itemIds: string[]; weeklyEnergyBonus: number; weeklyHappinessBonus: number; }

export interface JobUpgrades {
  [jobId: string]: { incomeBoostLvl: number; energySaverLvl: number };
}

export interface GameState {
  name: string;
  time: Time;
  age: number;
  alive: boolean;

  money: number;
  energy: number;
  happiness: number;
  health: number;
  fame: number;

  skills: Skills;
  perks: Perk[];
  loans: Loan[];

  home?: Home;
  furnitureOwned: string[];

  jobs: Job[];
  currentJobId?: string;

  educations: Education[];
  enrolledEducationId?: string;
  educationWeeksLeft?: number;

  companies: Company[];

  cryptoTarget: string;
  cryptoMiners: { id: string; count: number }[];
  cryptoPortfolio: Record<string, number>;

  hasUSB: boolean;
  darkWebUnlocked: boolean;
  prisonWeeksLeft: number;
  risk: number;

  // player meta for Tinder
  player: PlayerTinderInfo;

  tinder: TinderState;
  relationships: TinderRelationship[];

  relationship: RelationshipState;

  notifications: { id: string; message: string }[];

  market: MarketItem[];
  inventory: InventoryItem[];

  ownedItems: string[];
  foods: Food[];
  shopItems: ShopItem[];

  // buffs from weekly eBay items
  activeBuffs: MarketBuff[];

  marketPurchasedIds: string[]; // items bought this week (eBay)

  // per-job upgrades
  jobUpgrades: JobUpgrades;

  devMode?: boolean;
}
