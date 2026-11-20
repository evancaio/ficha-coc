export interface PulpLuckOption {
  id: string;
  name: string;
  cost: number | 'all';
  description: string;
  minLuckRequired?: number;
}

export const pulpLuckOptions: PulpLuckOption[] = [
  {
    id: 'heal-boost',
    name: 'Estancar Ferimento / Cura Extra (+1D6 PV)',
    cost: 10,
    description: 'Ao receber Primeiros Socorros ou Medicina bem-sucedidos, recupera +1D6 PV extras imediatamente.'
  },
  {
    id: 'resist-unconsciousness',
    name: 'Resistir a Desmaio / Consciência',
    cost: 20,
    description: 'Evita cair inconsciente após sofrer uma Lesão Grave ou choque físico extremo, mantendo-se de pé.'
  },
  {
    id: 'halve-damage',
    name: 'Reduzir Dano pela Metade',
    cost: 30,
    description: 'Um golpe quase fatal passa de raspão ou é amortecido. Reduz pela metade o dano total de um único ataque.'
  },
  {
    id: 'cheat-death',
    name: 'Evitar a Morte Certa',
    cost: 'all',
    minLuckRequired: 30,
    description: 'Queima toda a Sorte atual (mínimo de 30 pontos, ou 20 com o talento Vida de Gato) para escapar milagrosamente de um ferimento mortal.'
  }
];

export function canAffordLuckSpend(currentLuck: number, option: PulpLuckOption, hasNineLivesTalent: boolean = false): boolean {
  if (option.cost === 'all') {
    const required = hasNineLivesTalent ? 20 : (option.minLuckRequired || 30);
    return currentLuck >= required;
  }
  return currentLuck >= option.cost;
}

export function executeLuckSpend(currentLuck: number, option: PulpLuckOption, hasNineLivesTalent: boolean = false): number {
  if (!canAffordLuckSpend(currentLuck, option, hasNineLivesTalent)) {
    return currentLuck;
  }
  if (option.cost === 'all') {
    return 0;
  }
  return Math.max(0, currentLuck - option.cost);
}
