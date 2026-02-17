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
  LUCK: number; // Sorte (não usado mais - substituído por luckTokens)
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
  specialization?: string; // Para perícias que precisam de especialização
}

export interface Weapon {
  name: string;
  skill: string;
  damage: string;
  range: string;
  attacks: number;
  ammo: number;
  malfunction: string;
}

export interface BasicInfo {
  name: string;
  player: string;
  occupation: string;
  age: number;
  sex: string;
  residence: string;
  birthplace: string;
  imageUrl?: string; // URL da imagem do personagem
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
}
