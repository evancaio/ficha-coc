import { PulpTalent } from '@/types/character';

export const pulpTalents: PulpTalent[] = [
  // --- FÍSICOS ---
  {
    id: 'pes-ligeiros',
    name: 'Pés Ligeiros',
    category: 'Físico',
    description: 'Pode se movimentar mais rapidamente. Ganha +1 em sua Taxa de Movimento (MOV) e recebe um dado de bonificação em testes de perseguição a pé.'
  },
  {
    id: 'pele-dura',
    name: 'Pele Dura',
    category: 'Físico',
    description: 'Sua constituição robusta amortece pancadas. Reduz em 1 ponto qualquer dano recebido de ataques desarmados ou contundentes.'
  },
  {
    id: 'folego-de-ferro',
    name: 'Fôlego de Ferro',
    category: 'Físico',
    description: 'Capaz de metabolizar toxinas com facilidade. Ganha um dado de bonificação em testes de CON para resistir a venenos, drogas e álcool.'
  },
  {
    id: 'agil',
    name: 'Ágil',
    category: 'Físico',
    description: 'Ganha um dado de bonificação em testes de Esquivar e manobras acrobáticas envolvendo Destreza.'
  },
  {
    id: 'visao-agucada',
    name: 'Visão Aguçada',
    category: 'Físico',
    description: 'Olhos de lince. Ganha um dado de bonificação em testes de Encontrar para avistar detalhes a longa distância ou na penumbra.'
  },
  {
    id: 'audicao-agucada',
    name: 'Audição Aguçada',
    category: 'Físico',
    description: 'Capaz de captar os menores sussurros e ruídos no escuro. Ganha um dado de bonificação em testes de Escutar.'
  },
  {
    id: 'tolerancia-a-dor',
    name: 'Tolerância a Dor',
    category: 'Físico',
    description: 'Ignora penalidades de ferimento grave por 1D4 rodadas e pode resistir à inconsciência por dor com teste comum de CON.'
  },
  {
    id: 'folego-longo',
    name: 'Fôlego Longo',
    category: 'Físico',
    description: 'Consegue prender a respiração pelo dobro do tempo usual e ganha um dado de bonificação em testes de Natação e Mergulho.'
  },
  {
    id: 'recuperacao-acelerada',
    name: 'Recuperação Acelerada',
    category: 'Físico',
    description: 'Seu corpo se regenera rapidamente. Recupera 2 Pontos de Vida por dia de descanso ao invés de 1.'
  },

  // --- MENTAIS ---
  {
    id: 'mente-blindada',
    name: 'Mente Blindada',
    category: 'Mental',
    description: 'Vontade de ferro contra o horror. Ao sofrer perda de Sanidade em um teste bem-sucedido, reduz a perda em 1 ponto (mínimo zero).'
  },
  {
    id: 'vontade-de-ferro',
    name: 'Vontade de Ferro',
    category: 'Mental',
    description: 'Ganha um dado de bonificação em testes resistidos de Poder contra possessões, hipnose e feitiços mentais.'
  },
  {
    id: 'sangue-frio',
    name: 'Sangue Frio',
    category: 'Mental',
    description: 'Nunca é surpreendido ou entra em pânico involuntário por sustos repentinos. Age normalmente em emboscadas.'
  },
  {
    id: 'raciocinio-rapido',
    name: 'Raciocínio Rápido',
    category: 'Mental',
    description: 'Processa informações e pistas em metade do tempo comum. Ganha um dado de bonificação ao decifrar enigmas sob pressão.'
  },
  {
    id: 'memoria-fotografica',
    name: 'Memória Fotográfica',
    category: 'Mental',
    description: 'Lembra-se com precisão absoluta de textos lidos, rostos vistos, rotas e códigos examinados anteriormente.'
  },
  {
    id: 'linguista-nato',
    name: 'Linguista Nato',
    category: 'Mental',
    description: 'Compreende a ideia geral de línguas desconhecidas com um teste de Inteligência e aprende novos idiomas com facilidade prodigiosa.'
  },
  {
    id: 'intuicao-agucada',
    name: 'Intuição Aguçada',
    category: 'Mental',
    description: 'Sexto sentido para armadilhas e perigo iminente. O Guardião pode conceder um aviso prévio caso uma ação seja uma armadilha fatal.'
  },
  {
    id: 'detetive-nato',
    name: 'Detetive Nato',
    category: 'Mental',
    description: 'Dedução forense afiada. Ganha um dado de bonificação ao combinar testes de Psicologia e Encontrar na análise de suspeitos e cenas de crime.'
  },

  // --- COMBATE ---
  {
    id: 'rapido-no-gatilho',
    name: 'Rápido no Gatilho',
    category: 'Combate',
    description: 'Pode sacar e disparar uma arma de mão instantaneamente na sua vez de agir, sem sofrer penalidade de iniciativa.'
  },
  {
    id: 'mao-pesada',
    name: 'Mão Pesada',
    category: 'Combate',
    description: 'Golpes devastadores. Adiciona +2 de dano aos seus ataques desarmados de Briga e socos.'
  },
  {
    id: 'atirador-de-elite',
    name: 'Atirador de Elite',
    category: 'Combate',
    description: 'Ignora a penalidade de dado por alvos em cobertura parcial ou alvos em movimento ao disparar com armas de fogo.'
  },
  {
    id: 'reflexos-evasivos',
    name: 'Reflexos Evasivos',
    category: 'Combate',
    description: 'Reflexos defensivos impressionantes. Pode contra-atacar ou esquivar mesmo contra oponentes que o superem numericamente.'
  },
  {
    id: 'duas-armas',
    name: 'Dois Punhos / Duas Armas',
    category: 'Combate',
    description: 'Pode empunhar duas armas de fogo de mão (pistolas/revólveres) e disparar com ambas na mesma rodada sem sofrer dado de penalidade.'
  },
  {
    id: 'pancada-desorientadora',
    name: 'Pancada Desorientadora',
    category: 'Combate',
    description: 'Ao acertar um golpe desarmado ou com arma improvisada, pode tentar nocautear o alvo humano com teste oposto de FOR contra CON.'
  },
  {
    id: 'lutador-sujo',
    name: 'Lutador Sujo',
    category: 'Combate',
    description: 'Usa areia nos olhos, cotoveladas e rasteiras inesperadas. Concede um dado de bonificação em manobras de combate corpo a corpo.'
  },

  // --- DIVERSOS ---
  {
    id: 'sortudo',
    name: 'Sortudo',
    category: 'Diversos',
    description: 'A fortuna sorri com frequência. Ao recuperar pontos de Sorte no final da sessão ou descanso, rola 2D6+6 em vez de 1D10.'
  },
  {
    id: 'fala-mansa',
    name: 'Fala Mansa',
    category: 'Diversos',
    description: 'Pico de carisma e lábia. Seus testes forçados de Charme, Persuasão ou Lábia nunca resultam em desastres catastróficos imediatos.'
  },
  {
    id: 'mecanico-habilidoso',
    name: 'Mecânico Habilidoso',
    category: 'Diversos',
    description: 'Capaz de realizar consertos de emergência e colocar motores e maquinários complexos para funcionar mesmo sob condições adversas usando peças improvisadas.'
  },
  {
    id: 'mestre-dos-disfarces',
    name: 'Mestre dos Disfarces',
    category: 'Diversos',
    description: 'Consegue preparar um disfarce convincente em apenas 1D10 minutos e ganha um dado de bonificação em testes de Disfarce.'
  },
  {
    id: 'coracao-de-ouro',
    name: 'Coração de Ouro',
    category: 'Diversos',
    description: 'Inspira coragem em seus aliados. Uma vez por cena, pode conceder um dado de bonificação a um teste de Sanidade ou perícia de um colega.'
  },
  {
    id: 'escapista',
    name: 'Escapista',
    category: 'Diversos',
    description: 'Consegue escapar de amarras, cordas, nós e algemas com teste bem-sucedido de Destreza ou Prestidigitação.'
  },
  {
    id: 'duro-na-queda',
    name: 'Duro na Queda',
    category: 'Diversos',
    description: 'Resiliência e tenacidade impressionantes. O custo de pontos de Sorte para escapar da morte certa é reduzido para 20 pontos de Sorte (ao invés de queimar toda a Sorte).'
  }
];

export function getTalentById(id: string): PulpTalent | undefined {
  return pulpTalents.find(t => t.id === id);
}

export function getTalentsByCategory(category: 'Físico' | 'Mental' | 'Combate' | 'Diversos'): PulpTalent[] {
  return pulpTalents.filter(t => t.category === category);
}
