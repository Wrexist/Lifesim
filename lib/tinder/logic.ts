import { SEEDED_PROFILES } from './data/profiles';
import {
  TinderProfile,
  TinderState,
  Relationship,
  PlayerTinderInfo,
  Rarity,
  IncomeTier,
} from './types';

// basic helpers
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

const RARITY_BONUS: Record<Rarity, number> = {
  common: 0,
  uncommon: 0.03,
  rare: 0.05,
  epic: 0.07,
  legendary: 0.10,
};

const BASE_INCOME: Record<IncomeTier, number> = {
  0: 0,
  1: 50,
  2: 150,
  3: 400,
  4: 1000,
};

export function rarityBonus(r: Rarity) {
  return RARITY_BONUS[r] ?? 0;
}

export function sharedTags(a: string[], b: string[]) {
  return a.filter(t => b.includes(t));
}

export function calcMatchChance(player: PlayerTinderInfo, profile: TinderProfile, opts?: { superLike?: boolean; sharedTagCount?: number; reputationPenalty?: number; pity?: boolean; }): number {
  let p = 0.65;
  p += rarityBonus(profile.rarity);
  const shared = sharedTags(player.tags, profile.tags).length;
  p += Math.min(0.10, 0.02 * shared);
  p += player.reputationPenalty;
  if (opts?.superLike) {
    p = Math.max(p + 0.05, 0.90);
  }
  if (opts?.pity) p += 0.15;
  return clamp(p, 0.05, 0.98);
}

export function generateDailyDeck(state: TinderState, player: PlayerTinderInfo, pool: TinderProfile[] = SEEDED_PROFILES) {
  const filtered = pool.filter(p => {
    const pref = state.settings.preference;
    if (pref !== 'all' && p.gender !== pref) return false;
    return p.age >= state.settings.minAge && p.age <= state.settings.maxAge;
  });
  const deck: string[] = [];
  const used = new Set(state.dailyDeck);
  while (deck.length < 15 && filtered.length) {
    const idx = Math.floor(Math.random() * filtered.length);
    const prof = filtered.splice(idx, 1)[0];
    if (used.has(prof.id)) continue;
    deck.push(prof.id);
  }
  return deck;
}

export function computeWeeklyIncome(profile: TinderProfile, r: Relationship, player: PlayerTinderInfo) {
  let base = BASE_INCOME[profile.incomeTier];
  const compatibility = Math.min(1, sharedTags(player.tags, profile.tags).length / 10);
  let income = base + base * 0.25 * compatibility;
  if (r.status === 'exclusive') income *= 1.1;
  if (r.happiness < 40) income *= 0.7;
  if (r.trust < 40) income *= 0.7;
  income += r.weeklyIncome || 0; // allow manual tweaks
  return income;
}

export function computeUpkeep(profile: TinderProfile, r: Relationship) {
  const base = BASE_INCOME[profile.incomeTier];
  let upkeep = 0.25 * base;
  if (r.happiness < 50) upkeep += 50;
  if (profile.attributes.includes('demanding')) upkeep *= 1.2;
  return upkeep;
}

interface TickArgs {
  relationships: Relationship[];
  money: number;
  player: PlayerTinderInfo;
}

export function tickWeeklyRelationships(state: TickArgs, profiles: TinderProfile[] = SEEDED_PROFILES, currentWeek = 0) {
  const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]));
  const active = state.relationships.length;
  const splitPenalty = Math.max(0, (active - 1) * 0.15);
  let money = state.money;
  const updated: Relationship[] = [];
  for (const r of state.relationships) {
    const profile = profileMap[r.profileId];
    if (!profile) continue;
    let income = computeWeeklyIncome(profile, r, state.player);
    income *= 1 - splitPenalty;
    const upkeep = r.upkeepCost || computeUpkeep(profile, r);
    const net = Math.max(0, income - upkeep);
    money += net;
    updated.push({ ...r, weeklyIncome: income, upkeepCost: upkeep });
  }
  return { money, relationships: updated };
}
