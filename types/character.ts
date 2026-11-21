// Tipos para o sistema de Call of Cthulhu 7ª Edição

export interface Characteristics {
  STR: number; // Força
  CON: number; // Constituição
  SIZ: number; // Tamanho
  DEX: number; // Destreza
  APP: number; // Aparência
  INT: number; // Inteligência
  POW: number; // Poder
  EDU: number; // Educação
}

export interface DerivedStats {
  HP: number; // Pontos de Vida MÁXIMOS
  currentHP: number; // Pontos de Vida ATUAIS
  MP: number; // Pontos de Magia MÁXIMOS
  currentMP: number; // Pontos de Magia ATUAIS
  SAN: number; // Sanidade MÁXIMA
  currentSAN: number; // Sanidade ATUAL
  LUCK: number; // Valor de Sorte original (atributo), mantido para referência
  currentLUCK?: number; // Sorte atual para gasto ponto a ponto (Pulp Cthulhu)
  luckTokens: number; // Moedas da Sorte ATUAIS
  maxLuckTokens: number; // Moedas da Sorte MÁXIMAS (padrão: 5)
  movementRate: number; // Taxa de Movimento
  damageBonus: string; // Bônus de Dano
  build: number; // Corpo
}

export interface Skill {
  name: string;
  baseValue: number;
  occupationPoints: number;
  personalPoints: number;
  archetypePoints?: number; // Pontos do Arquétipo no Pulp Cthulhu (+100 pts)
  specialization?: string; // Para perícias que precisam de especialização
  minOccupationPoints?: number; // mínimo obrigatório de pontos ocupacionais (ex: Nível de Crédito)
}

export interface Weapon {
  name: string;
  skill: string;
  damage: string;
  range: string;
  attacks: string | number; // allowing string for "1 (3)"
  ammo: string | number; // allowing string for "20/30"
  malfunction: string;
  image?: string;
  era?: string;
}

export interface BasicInfo {
  name: string;
  player: string;
  occupation: string;
  age: number;
  sex: string;
  residence: string;
  birthplace: string;
  photo?: string;
}

export interface Backstory {
  personalDescription: string;
  ideology: string;
  significantPeople: string;
  meaningfulLocations: string;
  treasuredPossessions: string;
  traits: string;
  injuriesScars: string;
  phobiasManias: string;
  equipment?: string;
  narrative?: string;
}

export interface CharacterStatus {
  severeInjury: boolean; // Lesão Grave
  dying: boolean; // Morrendo
  temporaryInsanity: boolean; // Insanidade Temporária
  indefiniteInsanity: boolean; // Insanidade Indefinida
  woundsAndScars: string; // Ferimentos & Cicatrizes
  maniasAndPhobias: string; // Mania & Fobia
  strangeEncounters: string; // Encontro com Entidades Estranhas
}

export type GameMode = 'classic' | 'pulp';

export interface Archetype {
  id: string;
  name: string;
  description: string;
  coreCharacteristic: string[]; // e.g. ['DES', 'FOR']
  suggestedOccupations: string[];
  suggestedTalents: string[];
  skills: string[]; // Perícias do Arquétipo (+100 pontos para gastar)
}

export interface PulpTalent {
  id: string;
  name: string;
  category: 'Físico' | 'Mental' | 'Combate' | 'Diversos';
  description: string;
}

export interface Character {
  basicInfo: BasicInfo;
  characteristics: Characteristics;
  derivedStats: DerivedStats;
  skills: Skill[];
  weapons: Weapon[];
  backstory: Backstory;
  status: CharacterStatus; // Status do personagem
  occupationSkillPoints: number;
  personalInterestPoints: number;
  selectedOccupationSkills: string[]; // Nomes das perícias ocupacionais selecionadas
  occupationPointsChoice?: string | null; // e.g. 'DES' or 'FOR' when occupation formula has alternatives
  
  // Pulp Cthulhu expansions
  gameMode?: GameMode;
  archetype?: string;
  pulpTalents?: string[];
  archetypeSkillPoints?: number;
  selectedArchetypeSkills?: string[];
}
