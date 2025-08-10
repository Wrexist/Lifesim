import { Education, Home, Furniture, Job, GameState, Partner, FurnitureSetBonus, ShopItem, Food, MarketItem } from '../types';
import { useGame } from '../store';

export const JOBS: Job[] = [
  { id: 'STREET_BEG',  title: 'Beggar',          titleSeries: ['Beggar','Street Promoter','Street Fundraiser'], tier:1, basePayPerHour: 4, street:true, promotionChanceBase:0.01, xp:0, xpToPromote:6 },
  { id: 'STREET_DUMP', title: 'Dumpster Diver',  titleSeries: ['Dumpster Diver','Recycler','Salvage Picker'],    tier:1, basePayPerHour: 6, street:true, promotionChanceBase:0.01, xp:0, xpToPromote:6 },
  { id: 'STREET_FLY',  title: 'Flyer Kid',       titleSeries: ['Flyer Kid','Promo Agent','Brand Ambassador'],    tier:1, basePayPerHour: 7, street:true, promotionChanceBase:0.02, xp:0, xpToPromote:6 },
  { id: 'STREET_BUSK', title: 'Busker',          titleSeries: ['Busker','Performer','Street Artist'],            tier:1, basePayPerHour: 8, street:true, promotionChanceBase:0.02, xp:0, xpToPromote:6 },

  { id: 'FASTFOOD',    title: 'Crew',            titleSeries: ['Crew','Crew Trainer','Shift Manager','Asst. Manager'], tier:1, basePayPerHour:10, promotionChanceBase:0.02, xp:0, xpToPromote:8 },
  { id: 'BARISTA',     title: 'Barista',         titleSeries: ['Barista','Senior Barista','Shift Lead','Cafe Manager'], tier:1, basePayPerHour:12, promotionChanceBase:0.03, skillReq:{ social:1 }, xp:0, xpToPromote:8 },
  { id: 'RETAIL',      title: 'Sales Associate', titleSeries: ['Sales Associate','Key Holder','Supervisor','Asst. Manager'], tier:1, basePayPerHour:13, promotionChanceBase:0.03, xp:0, xpToPromote:8 },
  { id: 'HELPDESK',    title: 'IT Helpdesk',     titleSeries: ['IT Helpdesk','Support Specialist','Support Lead'], tier:1, basePayPerHour:16, promotionChanceBase:0.04, skillReq:{ coding:1 }, xp:0, xpToPromote:8 },
  { id: 'JUNIOR_DEV',  title: 'Junior Dev',      titleSeries: ['Junior Dev','Developer','Senior Dev','Tech Lead'], tier:1, basePayPerHour:22, promotionChanceBase:0.05, skillReq:{ coding:3 }, xp:0, xpToPromote:10 },
  { id: 'DATA_ANALYST',title: 'Data Analyst',    titleSeries: ['Data Analyst','Sr Analyst','Analytics Lead'],      tier:1, basePayPerHour:24, promotionChanceBase:0.05, skillReq:{ coding:2, business:1 }, xp:0, xpToPromote:10 },
];

export const EDUCATIONS: Education[] = [
  { id: 'CERT_COMMS', name: 'Communication Certificate', cost: 120, weeksTotal: 4,  skillGains: { social: 2 }, unlocksJobs: ['BARISTA','RETAIL'], completed: false },
  { id: 'BASIC_IT',   name: 'Basic IT',                   cost: 150, weeksTotal: 6,  skillGains: { coding: 1 }, unlocksJobs: ['HELPDESK'], completed: false },
  { id: 'WEB_BOOT',   name: 'Web Dev Bootcamp',           cost: 600, weeksTotal: 16, skillGains: { coding: 3, business:1 }, unlocksJobs: ['JUNIOR_DEV','DATA_ANALYST'], completed: false },
  { id: 'BUSINESS_101', name: 'Business 101',             cost: 200, weeksTotal: 8,  skillGains: { business: 2 }, completed: false }
];

export const HOMES: Home[] = [
  { id: 'HOSTEL', name: 'Hostel', weeklyEnergy: 5, weeklyHappiness: 2, rentPerMonth: 200, furnitureSlots: 1 },
  { id: 'STUDIO', name: 'Studio', weeklyEnergy: 8, weeklyHappiness: 4, rentPerMonth: 600, furnitureSlots: 2 },
  { id: 'LOFT',   name: 'Loft',   weeklyEnergy: 12, weeklyHappiness: 6, rentPerMonth: 1200, furnitureSlots: 3 }
];

export const FURNITURE: Furniture[] = [
  { id: 'BED_BASIC', name: 'IKEA Bed', energyBonus: 2, happinessBonus: 1 },
  { id: 'SOFA',      name: 'IKEA Sofa', energyBonus: 1, happinessBonus: 2 },
  { id: 'PLANTS',    name: 'Plants', energyBonus: 0, happinessBonus: 2 },
  { id: 'DESK',      name: 'Desk', energyBonus: 1, happinessBonus: 1 }
];

export const FURNITURE_SETS: FurnitureSetBonus[] = [
  { id: 'COZY_SET', name: 'Cozy Set', itemIds: ['BED_BASIC','SOFA','PLANTS'], weeklyEnergyBonus: 2, weeklyHappinessBonus: 3 }
];

const PARTNERS: Partner[] = [
  { id: 'P_ALEX', name: 'Alex', charm: 7, drama: 3 },
  { id: 'P_SAM',  name: 'Sam',  charm: 5, drama: 2 }
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'GYM_MEMBERSHIP', name: 'Gym Membership', price: 100, desc: 'Weekly bonus: +2 Fitness, +3 Health' },
  { id: 'BIKE',           name: 'Bike',           price: 150, desc: 'Move faster, small health bonus' },
  { id: 'GUITAR',         name: 'Guitar',         price: 200, desc: 'Hobby fun, slight happiness' },
  { id: 'SMARTPHONE',     name: 'Smartphone',     price: 400, desc: 'Unlocks Mobile tab' },
  { id: 'COMPUTER',       name: 'Computer',       price: 600, desc: 'Unlocks Computer tab' },
  { id: 'USB',            name: 'USB Stick',      price: 80,  desc: 'Required for Dark Web' }
];

export const FOODS: Food[] = [
  { id: 'WALK',   name: 'Walk in Park', price: 0,  effects: { happiness: 10, health: 5, energy: -5 } },
  { id: 'TEA',    name: 'Tea',          price: 5,  effects: { happiness: 4, energy: 2 } },
  { id: 'SALAD',  name: 'Salad',        price: 9,  effects: { health: 6, energy: 2 } },
  { id: 'BURGER', name: 'Burger',       price: 12, effects: { happiness: 6, energy: 4, health: -2 } },
  { id: 'COFFEE', name: 'Coffee',       price: 3,  effects: { energy: 8 } }
];

// Weekly eBay catalog (we pick 5 each week)
export const MARKET_CATALOG: MarketItem[] = [
  { id: 'SNEAKERS', name: 'Hype Sneakers', icon: 'walk-outline', basePrice: 500, volatility: 0.35, currentPrice: 500, buff: { effects: { happiness: 3, fame: 1 }, durationWeeks: 4 } },
  { id: 'DRINK_CRATE', name: 'Energy Drink Crate', icon: 'beer-outline', basePrice: 60, volatility: 0.2, currentPrice: 60, buff: { effects: { energy: 10 }, durationWeeks: 3 } },
  { id: 'VINTAGE_CAM', name: 'Vintage Camera', icon: 'camera-outline', basePrice: 350, volatility: 0.25, currentPrice: 350, buff: { effects: { fame: 2, happiness: 2 }, durationWeeks: 6 } },
  { id: 'PROTEIN', name: 'Protein Powder', icon: 'fitness-outline', basePrice: 40, volatility: 0.12, currentPrice: 40, buff: { effects: { health: 2 }, durationWeeks: 4 } },
  { id: 'GAMING_CHAIR', name: 'Gaming Chair', icon: 'game-controller-outline', basePrice: 220, volatility: 0.18, currentPrice: 220, buff: { effects: { happiness: 4 }, durationWeeks: 5 } },
  { id: 'PLANT_MON', name: 'Monstera XXL', icon: 'leaf-outline', basePrice: 120, volatility: 0.2, currentPrice: 120, buff: { effects: { happiness: 2, health: 1 }, durationWeeks: 5 } },
  { id: 'SMARTWATCH', name: 'Smartwatch', icon: 'watch-outline', basePrice: 180, volatility: 0.22, currentPrice: 180, buff: { effects: { health: 1, energy: 3 }, durationWeeks: 4 } },
  { id: 'BOOK_SET', name: 'CS Book Set', icon: 'book-outline', basePrice: 90, volatility: 0.1, currentPrice: 90, buff: { effects: { happiness: 2 }, durationWeeks: 4 } },
];

export const initGame = () => {
  const s = (useGame.getState() as any);
  if (s && s._seeded) return;
  useGame.setState((prev: GameState) => ({
    ...prev,
    name: 'Player',
    time: { week: 13, year: 2025 },
    age: 18,
    alive: true,
    money: -148,
    energy: 100,
    happiness: 85,
    health: 100,
    fame: 0,
    skills: { coding: 0, business: 0, social: 0, fitness: 22, hacking: 0 },
    jobs: JOBS.map(j => ({ ...j })),
    educations: EDUCATIONS.map(e => ({ ...e })),
    enrolledEducationId: undefined,
    educationWeeksLeft: undefined,
    home: undefined,
    furnitureOwned: [],
    companies: [{ id: 'START_CO', name: 'Starter Ltd', employees: 0, revenuePerWeek: 0, costPerWeek: 0 }],
    hasUSB: false,
    darkWebUnlocked: false,
    prisonWeeksLeft: 0,
    risk: 0,
    relationship: { partners: PARTNERS, relationshipPoints: 0 },
    notifications: [],
    market: [], // will be chosen weekly from catalog
    inventory: [],
    ownedItems: [],
    foods: FOODS.map(f => ({ ...f })),
    shopItems: SHOP_ITEMS.map(i => ({ ...i })),
    activeBuffs: [],
    jobUpgrades: {},
    devMode: true,
    _seeded: true as any
  }) as any);
};
