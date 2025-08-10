import { TinderProfile } from '../types';

export const SEEDED_PROFILES: TinderProfile[] = [
  { id:'p_001', name:'Lina', age:25, gender:'female', jobTitle:'Sales', incomeTier:2,
    attributes:['social','driven','fit'], rarity:'uncommon',
    bio:'Gym, tacos, and I compete in everything.', photos:['lina1'], tags:['gym','travel','cats'] },
  { id:'p_002', name:'Anton', age:28, gender:'male', jobTitle:'Developer', incomeTier:3,
    attributes:['smart','introvert','loyal'], rarity:'rare',
    bio:'I build apps and brew coffee.', photos:['anton1'], tags:['tech','games','dogs'] },
  { id:'p_003', name:'Mika', age:23, gender:'nonbinary', jobTitle:'Student', incomeTier:1,
    attributes:['creative','spontaneous','kind'], rarity:'common',
    bio:'Artist soul. Cheap dates are the best.', photos:['mika1'], tags:['art','film','veg'] },
  { id:'p_004', name:'Sara', age:31, gender:'female', jobTitle:'Accountant', incomeTier:4,
    attributes:['ambitious','organized','demanding'], rarity:'epic',
    bio:'Excel by day, wine tasting by night.', photos:['sara1'], tags:['finance','travel','wine'] },
  { id:'p_005', name:'Noah', age:27, gender:'male', jobTitle:'Barista', incomeTier:2,
    attributes:['charming','social','problem-solver'], rarity:'uncommon',
    bio:'Latte art & long walks.', photos:['noah1'], tags:['coffee','music','dogs'] }
];
