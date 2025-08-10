import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  GameState, Perk, InventoryItem,
} from './types';
import {
  HOMES, FURNITURE_SETS, SHOP_ITEMS, FOODS, MARKET_CATALOG,
} from './data/seed';

// ----------------- helpers -----------------
const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pickN = <T,>(arr: T[], n: number) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const idStr = () => Math.random().toString(36).slice(2, 10);

const COST = {
  WORK: 8,           // career
  SIDE_MIN: 15,      // street min
  SIDE_MAX: 20,      // street max
  STUDY: 5,
  GYM: 20,
  DATE: 4,
  BUSINESS: 6,
  DARK: 10,
};
const canAct = (alive:boolean, jailed:number, energy:number, cost:number) =>
  alive && jailed<=0 && energy>0 && energy>=cost;

// ----------------- actions type -----------------
type Actions = {
  reset: () => void;

  // instant actions
  doWork: (jobId: string) => void;
  doSideJob: (jobId: string) => void;
  doStudy: () => void;
  enrollEducation: (educationId: string) => void;
  doGym: () => void;
  doBusiness: () => void;
  doDarkweb: () => void;
  doRest: () => void;
  doDate: () => void;

  // relations
  setPartner: (partnerId: string) => void;
  breakUp: () => void;
  giveGift: (cost: number) => void;
  apologize: () => void;

  // shop/food
  buyItem: (id: string) => void;
  eatFood: (id: string) => void;
  sellOwnedItem: (id: string) => void;

  // ebay/market
  refreshMarket: () => void;
  buyMarketItem: (itemId: string, qty: number) => void;

  // inventory listing/selling
  listInventoryItem: (invId: string, price: number) => void;
  unlistInventoryItem: (invId: string) => void;
  sellListed: (invId: string) => void;

  // time
  nextWeek: () => void;

  // home/furniture
  setHomeById: (homeId: string) => void;
  buyFurnitureById: (id: string) => void;

  // unlocks/perks
  grantPerk: (p: Perk) => void;
  setUSB: () => void;
  unlockDarkWeb: () => void;

  // job upgrades
  buyJobUpgrade: (jobId: string, kind: 'income' | 'energy') => void;

  // DEV
  setDevMode: (on: boolean) => void;
  devAddMoney: (amount: number) => void;
  devSetEnergy: (value: number) => void;
  devNextWeeks: (weeks: number) => void;
  devUnlockAll: () => void;
};

const DEFAULT_JOBS = [
  // Street
  { id:'STREET_BEG', title:'Beggar', titleSeries:['Beggar','Busker','Street Vendor'], street:true, tier:1, basePayPerHour:5, xp:0, xpToPromote:6, promotionChanceBase:0.05 },
  { id:'STREET_FLYER', title:'Flyer Handout', titleSeries:['Flyer Handout','Promo Rep','Street Marketer'], street:true, tier:1, basePayPerHour:7, xp:0, xpToPromote:6, promotionChanceBase:0.06 },
  // Career
  { id:'JR_DEV', title:'Junior Developer', titleSeries:['Junior Developer','Developer','Senior Developer','Lead Developer'], street:false, tier:1, basePayPerHour:20, xp:0, xpToPromote:8, promotionChanceBase:0.07, skillReq:{ coding:10 } },
  { id:'BARISTA', title:'Barista', titleSeries:['Barista','Shift Lead','Cafe Manager'], street:false, tier:1, basePayPerHour:14, xp:0, xpToPromote:8, promotionChanceBase:0.06 },
];

const DEFAULT_EDU = [
  { id:'BUSINESS_101', name:'Business 101', cost:600, weeksTotal:8, skillGains:{ business:10, social:5 } },
  { id:'CS_CERT',      name:'Coding Certificate', cost:700, weeksTotal:8, skillGains:{ coding:12 } },
];

function reseedCore(s: Partial<GameState> = {}) {
  return {
    ...initialState,
    ...s,
    jobs: DEFAULT_JOBS.map(j => ({ ...j })),                // fresh copies
    educations: DEFAULT_EDU.map(e => ({ ...e })),
  } as GameState;
}
// ----------------- initial state -----------------
const initialState: GameState = {
  name: 'Player',
  time: { week: 1, year: 2025 },
  age: 18,
  alive: true,

  money: 100,
  energy: 80,
  happiness: 60,
  health: 100,
  fame: 0,

  skills: { coding: 0, business: 0, social: 0, fitness: 0, hacking: 0 },
  perks: [],
  loans: [],

  home: undefined,
  furnitureOwned: [],

  jobs: [],
  currentJobId: undefined,

  educations: [],
  enrolledEducationId: undefined,
  educationWeeksLeft: undefined,

  companies: [],

  hasUSB: false,
  darkWebUnlocked: false,
  prisonWeeksLeft: 0,
  risk: 0,

  relationship: { partners: [], relationshipPoints: 0, currentPartnerId: undefined },

  notifications: [],

  market: [],
  inventory: [],
  marketPurchasedIds: [], // <--- eBay limit per week

  ownedItems: [],
  foods: FOODS,
  shopItems: SHOP_ITEMS,

  activeBuffs: [],
  jobUpgrades: {},

  devMode: true,
};  

// ----------------- store -----------------
export const useGame = create<GameState & Actions>()(
  persist(
    (set, get) => ({

      ...initialState,

      // ===== core =====
      reset: () => set(reseedCore()),

      // ===== work & jobs =====
      doWork: (jobId) => {
        const s = get(); if (!canAct(s.alive, s.prisonWeeksLeft, s.energy, COST.WORK)) return;
        const job = s.jobs.find(j => j.id === jobId) ?? s.jobs.find(j => !j.street) ?? s.jobs[0]; if (!job) return;

        // Upgrades (BOOSTED multipliers)
        const up = s.jobUpgrades[job.id] || { incomeBoostLvl: 0, energySaverLvl: 0 };
        const payBoost = 1 + up.incomeBoostLvl * 0.25; // +25% per level
        const energyCost = Math.max(1, COST.WORK - up.energySaverLvl * 3); // -3 energy per level

        // Skill gate soft penalty
        const req = job.skillReq ?? {};
        const missing = Object.entries(req).some(([k, v]) => (s.skills as any)[k] < (v ?? 0));
        const penalty = missing ? 0.85 : 1;

        const workPay = s.perks.includes('WORK_PAY') ? 1.5 : 1;
        const earn = Math.round((job.basePayPerHour * 8) * workPay * penalty * payBoost);

        let energy = clamp(s.energy - energyCost);
        let happiness = clamp(s.happiness - 1);
        let health = clamp(s.health - 1);
        let money = s.money + earn;

        // Progress / promotion
        job.xp = (job.xp ?? 0) + 1;
        const need = job.xpToPromote ?? 8;
        if (job.xp >= need) {
          job.tier += 1; job.xp = 0;
          job.basePayPerHour = Math.round(job.basePayPerHour * 1.2);
          if (job.titleSeries && job.titleSeries.length) {
            const idx = Math.min(job.tier - 1, job.titleSeries.length - 1);
            job.title = job.titleSeries[idx];
          }
          happiness = clamp(happiness + 3);
        } else if (Math.random() < (job.promotionChanceBase * (s.perks.includes('MINDSET') ? 1.5 : 1))) {
          job.tier += 1;
          job.basePayPerHour = Math.round(job.basePayPerHour * 1.15);
          if (job.titleSeries && job.titleSeries.length) {
            const idx = Math.min(job.tier - 1, job.titleSeries.length - 1);
            job.title = job.titleSeries[idx];
          }
          happiness = clamp(happiness + 2);
        }

        set({
          energy, happiness, health, money,
          jobs: [...s.jobs],
          notifications: [...s.notifications, { id: idStr(), message: `Earned $${earn} from ${job.title}` }]
        });
      },

      doSideJob: (jobId) => {
        const s = get();
        const baseCost = Math.round(rand(COST.SIDE_MIN, COST.SIDE_MAX));

        // Upgrades (BOOSTED)
        const job = s.jobs.find(j => j.id === jobId) ?? s.jobs.find(j => j.street);
        if (!job) return;
        const up = s.jobUpgrades[job.id] || { incomeBoostLvl: 0, energySaverLvl: 0 };
        const energyCost = Math.max(1, baseCost - up.energySaverLvl * 3);
        if (!canAct(s.alive, s.prisonWeeksLeft, s.energy, energyCost)) return;

        const payBoost = 1 + up.incomeBoostLvl * 0.25;
        const earn = Math.round(30 * (s.perks.includes('WORK_PAY') ? 1.5 : 1) * payBoost);

        let energy = clamp(s.energy - energyCost);
        let happiness = clamp(s.happiness - 1);
        let health = clamp(s.health - 1);
        let money = s.money + earn;

        job.xp = (job.xp ?? 0) + 1;
        const need = job.xpToPromote ?? 6;
        if (job.xp >= need) {
          job.tier += 1; job.xp = 0;
          job.basePayPerHour = Math.round(job.basePayPerHour * 1.18);
          if (job.titleSeries && job.titleSeries.length) {
            const idx = Math.min(job.tier - 1, job.titleSeries.length - 1);
            job.title = job.titleSeries[idx];
          }
          happiness = clamp(happiness + 2);
        }

        set({
          energy, happiness, health, money,
          jobs: [...s.jobs],
          notifications: [...s.notifications, { id: idStr(), message: `Earned $${earn} from ${job.title}` }]
        });
      },

      // ===== study / education =====
      doStudy: () => {
        const s = get(); if (!canAct(s.alive, s.prisonWeeksLeft, s.energy, COST.STUDY)) return;
        let left = s.educationWeeksLeft ?? 0;
        if (s.enrolledEducationId && left > 0) {
          const boost = s.perks.includes('FAST_LEARNER') ? 0.4 : 0.25;
          left = Math.max(0, left - boost);
        }
        set({
          educationWeeksLeft: left,
          energy: clamp(s.energy - COST.STUDY),
          happiness: clamp(s.happiness - 1)
        });
      },

      enrollEducation: (educationId) => {
        const s = get();
        const c = s.educations.find(e => e.id === educationId); if (!c) return;
        if (s.enrolledEducationId) return;
        if (s.money < c.cost) return;
        set({
          enrolledEducationId: c.id,
          educationWeeksLeft: c.weeksTotal,
          money: s.money - c.cost
        });
      },

      // ===== life actions =====
      doGym: () => {
        const s = get();
        if (!canAct(s.alive, s.prisonWeeksLeft, s.energy, COST.GYM) || s.money < 50) return;
        set({
          money: s.money - 50,
          energy: clamp(s.energy - COST.GYM),
          happiness: clamp(s.happiness + 2),
          health: clamp(s.health + 3),
          skills: { ...s.skills, fitness: s.skills.fitness + 5 }
        });
      },

      doBusiness: () => {
        const s = get(); if (!canAct(s.alive, s.prisonWeeksLeft, s.energy, COST.BUSINESS)) return;
        const companies = s.companies.map(c => ({ ...c, revenuePerWeek: c.revenuePerWeek + 5 }));
        set({
          companies,
          energy: clamp(s.energy - COST.BUSINESS),
          happiness: clamp(s.happiness + 1)
        });
      },

      doDarkweb: () => {
        const s = get(); if (!s.darkWebUnlocked || !canAct(s.alive, s.prisonWeeksLeft, s.energy, COST.DARK)) return;
        const gain = 60; const riskUp = 8;
        let risk = clamp(s.risk + riskUp, 0, 100);
        let prisonWeeksLeft = s.prisonWeeksLeft;
        if (risk >= 80 && Math.random() < 0.25) prisonWeeksLeft = 1 + Math.floor(Math.random() * 2);
        set({
          money: s.money + gain,
          energy: clamp(s.energy - COST.DARK),
          happiness: clamp(s.happiness - 1),
          risk, prisonWeeksLeft,
          notifications: [...s.notifications, { id: idStr(), message: `Hack run +$${gain}, risk up` }]
        });
      },

      doRest: () => {
        const s = get();
        set({
          energy: clamp(s.energy + 10),
          happiness: clamp(s.happiness + 1),
          health: clamp(s.health + 2)
        });
      },

      doDate: () => {
        const s = get();
        if (!canAct(s.alive, s.prisonWeeksLeft, s.energy, COST.DATE)) return;
        const partnerId = s.relationship.currentPartnerId;
        const gain = partnerId ? 8 : 4;
        set({
          energy: clamp(s.energy - COST.DATE),
          happiness: clamp(s.happiness + gain),
          relationship: {
            ...s.relationship,
            relationshipPoints: Math.min(100, s.relationship.relationshipPoints + (partnerId ? 6 : 2))
          }
        });
      },

      // ===== relations =====
      setPartner: (partnerId) => {
        const s = get();
        set({
          relationship: { ...s.relationship, currentPartnerId: partnerId, relationshipPoints: Math.min(100, s.relationship.relationshipPoints + 10) },
          happiness: clamp(s.happiness + 5)
        });
      },
      breakUp: () => {
        const s = get();
        set({
          relationship: { ...s.relationship, currentPartnerId: undefined, relationshipPoints: Math.max(0, s.relationship.relationshipPoints - 15) },
          happiness: clamp(s.happiness - 5)
        });
      },
      giveGift: (cost) => {
        const s = get(); if (s.money < cost) return;
        set({
          money: s.money - cost,
          relationship: { ...s.relationship, relationshipPoints: Math.min(100, s.relationship.relationshipPoints + Math.min(20, Math.floor(cost / 5))) },
          happiness: clamp(s.happiness + 2)
        });
      },
      apologize: () => {
        const s = get();
        set({
          relationship: { ...s.relationship, relationshipPoints: Math.min(100, s.relationship.relationshipPoints + 5) },
          happiness: clamp(s.happiness + 1)
        });
      },

      // ===== shop / food =====
      buyItem: (id) => {
  const s = get();
  const item = s.shopItems.find(i => i.id === id); if (!item) return;
  if (s.ownedItems.includes(id) || s.money < item.price) return;

  let hasUSB = s.hasUSB;
  if (id === 'USB') hasUSB = true;

  set({
    ownedItems: [...s.ownedItems, id],
    money: s.money - item.price,
    hasUSB,
    happiness: clamp(s.happiness + 1),
    notifications: [...s.notifications, { id: idStr(), message: `Bought ${item.name}` }]
  });
},

sellOwnedItem: (id) => {
  const s = get();
  if (!s.ownedItems.includes(id)) return;
  const item = s.shopItems.find(i => i.id === id); if (!item) return;

  // 50% refund
  const refund = Math.floor(item.price * 0.5);

  // special rule: Hacking Device (kan finnas i Dark Web marketplace)
  // säljs också för 50%, men får inte köpas flera ggr – den regeln hanteras i respektive köp‑action.
  const ownedItems = s.ownedItems.filter(x => x !== id);
  let hasUSB = s.hasUSB;
  if (id === 'USB') hasUSB = false; // om du säljer USB, förlorar du Dark Web‑möjlighet tills du köper igen

  set({
    ownedItems,
    hasUSB,
    money: s.money + refund,
    notifications: [...s.notifications, { id: idStr(), message: `Sold ${item.name} +$${refund}` }]
  });
},

      eatFood: (id) => {
        const s = get();
        const f = s.foods.find(x => x.id === id); if (!f || s.money < f.price) return;
        set({
          money: s.money - f.price,
          energy: clamp(s.energy + (f.effects.energy ?? 0)),
          happiness: clamp(s.happiness + (f.effects.happiness ?? 0)),
          health: clamp(s.health + (f.effects.health ?? 0))
        });
      },

      // ===== ebay / market =====
      refreshMarket() {
        const picks = pickN(MARKET_CATALOG.map(m => ({ ...m })), 5).map(m => {
          m.currentPrice = Math.max(10, Math.round(m.basePrice * (1 + rand(-m.volatility, m.volatility))));
          return m;
        });
        set({ market: picks });
      },

      buyMarketItem(itemId, qty) {
        const s = get();
        if (s.marketPurchasedIds.includes(itemId)) return; // only once per week
        const mi = s.market.find(m => m.id === itemId); if (!mi || qty <= 0) return;
        const cost = mi.currentPrice * qty; if (s.money < cost) return;

        const inv: InventoryItem[] = [...s.inventory];
        inv.push({ id: idStr(), itemId, name: mi.name, qty, avgBuyPrice: mi.currentPrice });

        // apply buff if present
        let activeBuffs = [...s.activeBuffs];
        if (mi.buff) activeBuffs.push({ id: idStr(), name: mi.name, weeksLeft: mi.buff.durationWeeks, effects: mi.buff.effects });

        set({
          money: s.money - cost,
          inventory: inv,
          activeBuffs,
          marketPurchasedIds: [...s.marketPurchasedIds, itemId],
          notifications: [...s.notifications, { id: idStr(), message: `Bought ${mi.name} for $${mi.currentPrice}` }]
        });
      },

      // inventory listing / selling
      listInventoryItem: (invId, price) => {
        const s = get();
        const inv = s.inventory.map(it =>
          it.id === invId ? { ...it, listed: true, listPrice: Math.max(1, Math.floor(price)) } : it
        );
        set({ inventory: inv });
      },
      unlistInventoryItem: (invId) => {
        const s = get();
        const inv = s.inventory.map(it =>
          it.id === invId ? { ...it, listed: false, listPrice: undefined } : it
        );
        set({ inventory: inv });
      },
      sellListed: (invId) => {
        const s = get();
        const it = s.inventory.find(i => i.id === invId);
        if (!it || !it.listed || !it.listPrice || it.qty <= 0) return;
        const revenue = it.listPrice * it.qty;
        const newInv = s.inventory.filter(i => i.id !== invId);
        set({
          money: s.money + revenue,
          inventory: newInv,
          notifications: [...s.notifications, { id: idStr(), message: `Sold ${it.name} +$${revenue}` }]
        });
      },

      // ===== weekly tick =====
      nextWeek: () => {
        const s = get(); if (!s.alive) return;

        // base weekly effects
        let energy = clamp(s.energy + 75, 0, 100);
        let happiness = clamp(s.happiness - 5, 0, 100);
        let health = clamp(s.health - 3, 0, 100);
        let fame = s.fame;

        // buffs tick
        let activeBuffs = s.activeBuffs.map(b => ({ ...b, weeksLeft: b.weeksLeft - 1 })).filter(b => b.weeksLeft > -1);
        activeBuffs.forEach(b => {
          energy = clamp(energy + (b.effects.energy ?? 0), 0, 100);
          happiness = clamp(happiness + (b.effects.happiness ?? 0), 0, 100);
          health = clamp(health + (b.effects.health ?? 0), 0, 100);
          fame = Math.max(0, fame + (b.effects.fame ?? 0));
        });
        activeBuffs = activeBuffs.filter(b => b.weeksLeft > 0);

        // time & aging
        let { week, year } = s.time;
        week += 1;
        let age = s.age;
        if (week > 52) { week = 1; year += 1; age += 1; }
        let alive = s.alive;
        if (age >= 100) { alive = false; energy = 0; }

        // prison
        let prisonWeeksLeft = s.prisonWeeksLeft;
        if (prisonWeeksLeft > 0) prisonWeeksLeft -= 1;

        // home bonuses & furniture sets
        if (s.home) {
          const furn = s.furnitureOwned.length;
          energy = clamp(energy + s.home.weeklyEnergy + furn);
          happiness = clamp(happiness + s.home.weeklyHappiness + furn);
          for (const setDef of FURNITURE_SETS) {
            const hasAll = setDef.itemIds.every(id => s.furnitureOwned.includes(id));
            if (hasAll) {
              energy = clamp(energy + setDef.weeklyEnergyBonus);
              happiness = clamp(happiness + setDef.weeklyHappinessBonus);
            }
          }
        }
        // gym membership passive
        if (s.ownedItems.includes('GYM_MEMBERSHIP')) {
          health = clamp(health + 3); s.skills.fitness += 2;
        }

        // companies weekly revenue
        let money = s.money;
        s.companies.forEach(c => { money += (c.revenuePerWeek - c.costPerWeek); });

        // education ticking
        let enrolledEducationId = s.enrolledEducationId;
        let educationWeeksLeft = s.educationWeeksLeft;
        if (enrolledEducationId && educationWeeksLeft !== undefined) {
          const mult = s.perks.includes('FAST_LEARNER') ? 1.5 : 1;
          educationWeeksLeft = Math.max(0, educationWeeksLeft - 1 * mult);
          if (educationWeeksLeft === 0) {
            const ed = s.educations.find(e => e.id === enrolledEducationId)!;
            const skills = { ...s.skills };
            Object.entries(ed.skillGains).forEach(([k, v]) => (skills as any)[k] = (skills as any)[k] + (v ?? 0));
            const notifications = [...s.notifications, { id: idStr(), message: `Finished ${ed.name}!` }];
            set({ skills, notifications });
            enrolledEducationId = undefined; educationWeeksLeft = undefined;
          }
        }

        // loans & rent monthly (every 4th week)
        let loans = s.loans;
        if ((s.time.week % 4) === 0) {
          if (s.home) money -= s.home.rentPerMonth;
          loans = s.loans.map(l => {
            const interest = l.principal * (l.annualRate / 12);
            let principal = l.principal + interest - l.monthlyPayment;
            if (principal < 0) principal = 0;
            money -= l.monthlyPayment;
            return { ...l, principal };
          });
          if (s.perks.includes('GOOD_CREDIT')) loans.forEach(l => (l.principal = Math.max(0, l.principal * 0.995)));
        }

        // new weekly ebay picks (always 5)
        const picks = pickN(MARKET_CATALOG.map(m => ({ ...m })), 5).map(m => {
          m.currentPrice = Math.max(10, Math.round(m.basePrice * (1 + rand(-m.volatility, m.volatility))));
          return m;
        });

        set({
          time: { week, year }, age, alive,
          prisonWeeksLeft, energy, happiness, health, fame,
          money, loans,
          market: picks,
          enrolledEducationId, educationWeeksLeft,
          activeBuffs,
          skills: { ...s.skills },
          marketPurchasedIds: [], // <-- reset weekly eBay lock
        });
      },

      // ===== home =====
      setHomeById(homeId) {
        const s = get();
        const home = HOMES.find(h => h.id === homeId); if (!home) return;
        if (s.money < home.rentPerMonth / 2) return;
        set({ home, money: s.money - home.rentPerMonth / 2 });
      },
      buyFurnitureById(id) {
        const s = get();
        const price = 150;
        if (!s.home || s.money < price) return;
        set({ furnitureOwned: [...s.furnitureOwned, id], money: s.money - price });
      },

      // ===== unlocks / perks =====
      grantPerk: (p) => set({ perks: Array.from(new Set([...get().perks, p])) }),
      setUSB: () => set({ hasUSB: true }),
      unlockDarkWeb: () => set((s) => ({ darkWebUnlocked: s.hasUSB ? true : s.darkWebUnlocked })),

      // ===== job upgrades =====
      buyJobUpgrade: (jobId, kind) => {
        const s = get();
        const up = s.jobUpgrades[jobId] || { incomeBoostLvl: 0, energySaverLvl: 0 };
        const price = kind === 'income' ? (200 + up.incomeBoostLvl * 250) : (200 + up.energySaverLvl * 250);
        if (s.money < price) return;
        const next = { ...up };
        if (kind === 'income') next.incomeBoostLvl += 1;
        else next.energySaverLvl += 1;
        set({
          jobUpgrades: { ...s.jobUpgrades, [jobId]: next },
          money: s.money - price,
          notifications: [...s.notifications, { id: idStr(), message: kind === 'income' ? 'Income Boost purchased' : 'Energy Saver purchased' }]
        });
      },

      // ===== dev =====
      setDevMode: (on) => set({ devMode: on }),
      devAddMoney: (amount) => set({ money: get().money + amount }),
      devSetEnergy: (value) => set({ energy: clamp(value, 0, 100) }),
      devNextWeeks: (weeks) => { for (let i = 0; i < weeks; i++) get().nextWeek(); },
      devUnlockAll: () => set({
        ownedItems: Array.from(new Set([...(get().ownedItems), 'SMARTPHONE', 'COMPUTER', 'GYM_MEMBERSHIP', 'USB'])),
        hasUSB: true, darkWebUnlocked: true
      }),

    }),
    { name: 'life-sim-save', storage: createJSONStorage(() => AsyncStorage), version: 7 }
  )
);
