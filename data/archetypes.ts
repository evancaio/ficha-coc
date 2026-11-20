import { Archetype } from '@/types/character';

export const archetypes: Archetype[] = [
  {
    id: 'ajudante',
    name: 'Ajudante',
    description: 'Um companheiro leal que apoia os heróis ou seu mentor, dotado de um forte código moral, senso de dever e confiabilidade.',
    coreCharacteristic: ['DES', 'CON'],
    skills: [
      'Adestrar Animais',
      'Consertos Elétricos',
      'Consertos Mecânicos',
      'Escalar',
      'Escutar',
      'Fotografia',
      'Furtividade',
      'Lábia',
      'Navegação',
      'Primeiros Socorros',
      'Rastrear',
      'Saltar',
      'Usar Bibliotecas'
    ],
    suggestedOccupations: [
      'Agente Federal', 'Bandido de Rua', 'Bibliotecário', 'Chofer', 'Cientista',
      'Enfermeiro', 'Escritor', 'Estudante', 'Fotógrafo', 'Garçom/Garçonete',
      'Médico', 'Mordomo', 'Operário', 'Piloto de Fuga', 'Policial de Patrulha',
      'Secretário', 'Tribal', 'Vagabundo'
    ],
    suggestedTalents: ['dois quaisquer (Físico ou Mental sugerido)']
  },
  {
    id: 'arlequim',
    name: 'Arlequim',
    description: 'Manipulador caótico e teatral, gosta de criar situações imprevisíveis, ocultar suas intenções com mentiras e observar as reações dos outros.',
    coreCharacteristic: ['APP'],
    skills: [
      'Arte e Ofício (Atuação)',
      'Charme',
      'Disfarce',
      'Furtividade',
      'Lábia',
      'Leitura Labial',
      'Prestidigitação',
      'Psicologia',
      'Saltar'
    ],
    suggestedOccupations: [
      'Animador', 'Apostador', 'Artista', 'Ator', 'Diletante', 'Fanático',
      'Garçom/Garçonete', 'Líder de Culto', 'Músico', 'Político Eleito',
      'Repórter', 'Secretário', 'Sindicalista', 'Vigarista'
    ],
    suggestedTalents: ['dois quaisquer (Fala Mansa recomendado)']
  },
  {
    id: 'aventureiro',
    name: 'Aventureiro',
    description: 'Anseia por emoção, risco e glória. Ficar parado das nove às cinco é uma sentença de morte para este buscador de perigo.',
    coreCharacteristic: ['DEX', 'APP'],
    skills: [
      'Armas de Fogo (Pistolas)',
      'Armas de Fogo (Rifles/Espingardas)',
      'Consertos Mecânicos',
      'Dirigir Automóveis',
      'Escalar',
      'Furtividade',
      'Lutar (Briga)',
      'Mergulho',
      'Natação',
      'Língua (Outra)',
      'Pilotar',
      'Saltar',
      'Sobrevivência'
    ],
    suggestedOccupations: [
      'Andarilho', 'Apostador', 'Arqueólogo', 'Atleta', 'Ator', 'Aviador',
      'Caçador de Grandes Presas', 'Diletante', 'Enfermeiro', 'Fotógrafo',
      'Gangster', 'Gatuno', 'Guarda Florestal', 'Jornalista Investigativo',
      'Ladrão de Bancos', 'Marinheiro', 'Missionário', 'Soldado', 'Tribal'
    ],
    suggestedTalents: ['dois quaisquer']
  },
  {
    id: 'bon-vivant',
    name: 'Bon Vivant',
    description: 'Aquele que vive bem. Sabe desfrutar dos melhores prazeres da vida, seja em festas elegantes ou em clubes noturnos, cativando todos com seu charme.',
    coreCharacteristic: ['APP', 'POW'],
    skills: [
      'Arte e Ofício',
      'Avaliação',
      'Cavalgar',
      'Charme',
      'Lábia',
      'Língua (Outra)',
      'Natação',
      'Nível de Crédito',
      'Persuasão',
      'Psicologia'
    ],
    suggestedOccupations: [
      'Animador', 'Apostador', 'Artista', 'Ator', 'Cavalheiro/Dama',
      'Diletante', 'Escritor', 'Músico', 'Político Eleito'
    ],
    suggestedTalents: ['dois quaisquer']
  },
  {
    id: 'cacador',
    name: 'Caçador',
    description: 'Rastreador paciente e determinado. Não importa se a presa é uma fera selvagem nas selvas africanas ou um fugitivo nas ruas da cidade.',
    coreCharacteristic: ['INT', 'CON'],
    skills: [
      'Armas de Fogo (Rifles/Espingardas)',
      'Armas de Fogo (Pistolas)',
      'Armas de Fogo',
      'Arremessar',
      'Consertos Mecânicos',
      'Escalar',
      'Escutar',
      'Furtividade',
      'Lutar (Briga)',
      'Mundo Natural',
      'Natação',
      'Navegação',
      'Primeiros Socorros',
      'Rastrear',
      'Sobrevivência'
    ],
    suggestedOccupations: [
      'Atleta', 'Caçador de Grandes Presas', 'Caçador de Recompensas',
      'Detetive Particular', 'Guarda Florestal', 'Marinheiro', 'Militar',
      'Policial de Patrulha', 'Tribal'
    ],
    suggestedTalents: ['dois quaisquer (Atirador de Elite recomendado)']
  },
  {
    id: 'casca-grossa',
    name: 'Casca-Grossa',
    description: 'Duro, cínico e experiente. Já viu de tudo nas ruas escuras da cidade e sabe que a verdade dói mais do que um soco na mandíbula.',
    coreCharacteristic: ['CON', 'STR'],
    skills: [
      'Armas de Fogo (Pistolas)',
      'Chaveiro',
      'Dirigir Automóveis',
      'Encontrar',
      'Escutar',
      'Furtividade',
      'Intimidação',
      'Lábia',
      'Lutar (Briga)',
      'Psicologia'
    ],
    suggestedOccupations: [
      'Agente Federal', 'Bandido de Rua', 'Caçador de Recompensas',
      'Detetive de Agência', 'Detetive Particular', 'Gangster',
      'Jornalista Investigativo', 'Policial de Patrulha', 'Repórter'
    ],
    suggestedTalents: ['dois quaisquer (Pele Dura ou Tolerância a Dor recomendado)']
  },
  {
    id: 'cientista-excentrico',
    name: 'Cientista Excêntrico',
    description: 'Mente brilhante que desafia as convenções acadêmicas para desvendar os segredos proibidos da física, química e invenções fantásticas.',
    coreCharacteristic: ['INT'],
    skills: [
      'Ciência',
      'Ciência Estranha',
      'Consertos Elétricos',
      'Consertos Mecânicos',
      'História',
      'Língua (Outra)',
      'Mundo Natural',
      'Operar Maquinário Pesado',
      'Usar Bibliotecas',
      'Usar Computadores'
    ],
    suggestedOccupations: [
      'Arqueólogo', 'Cientista', 'Engenheiro', 'Médico', 'Professor'
    ],
    suggestedTalents: ['dois quaisquer (Mecânico Miraculoso ou Raciocínio Rápido)']
  },
  {
    id: 'defensor',
    name: 'Defensor',
    description: 'Protetor dos fracos e necessitados. Sempre disposto a se colocar entre o perigo e seus amigos com coragem inabalável.',
    coreCharacteristic: ['STR', 'POW'],
    skills: [
      'Armas de Fogo (Pistolas)',
      'Armas de Fogo (Rifles/Espingardas)',
      'Dirigir Automóveis',
      'Esquivar',
      'Intimidação',
      'Lutar (Briga)',
      'Persuasão',
      'Primeiros Socorros',
      'Psicologia',
      'Saltar'
    ],
    suggestedOccupations: [
      'Guarda-Costas', 'Médico', 'Militar', 'Missionário', 'Policial de Patrulha', 'Soldado'
    ],
    suggestedTalents: ['dois quaisquer (Pele Dura ou Coração de Ouro)']
  },
  {
    id: 'detetive-frio',
    name: 'Detetive Frio',
    description: 'Investigador metódico e perspicaz, capaz de enxergar detalhes imperceptíveis e juntar pistas desconexas em uma dedução brilhante.',
    coreCharacteristic: ['INT', 'POW'],
    skills: [
      'Armas de Fogo (Pistolas)',
      'Avaliação',
      'Chaveiro',
      'Direito',
      'Disfarce',
      'Encontrar',
      'Escutar',
      'Furtividade',
      'Lábia',
      'Persuasão',
      'Psicologia',
      'Usar Bibliotecas'
    ],
    suggestedOccupations: [
      'Agente Federal', 'Detetive de Agência', 'Detetive Particular',
      'Jornalista Investigativo', 'Policial de Patrulha'
    ],
    suggestedTalents: ['dois quaisquer (Detetive Nato recomendado)']
  },
  {
    id: 'duro-de-matar',
    name: 'Duro de Matar',
    description: 'Sobrevivente nato que suporta ferimentos e privações que matariam homens normais duas vezes.',
    coreCharacteristic: ['CON'],
    skills: [
      'Escalar',
      'Esquivar',
      'Furtividade',
      'Lutar (Briga)',
      'Natação',
      'Primeiros Socorros',
      'Rastrear',
      'Saltar',
      'Sobrevivência'
    ],
    suggestedOccupations: [
      'Atleta', 'Capanga Contratado', 'Explorador', 'Militar', 'Operário', 'Pugilista', 'Soldado'
    ],
    suggestedTalents: ['dois quaisquer (Tolerância a Dor ou Pele Dura)']
  },
  {
    id: 'erudito',
    name: 'Erudito',
    description: 'Guardião do conhecimento acadêmico, histórico e literário. Pode não ser o mais atlético, mas sabe exatamente onde encontrar a resposta.',
    coreCharacteristic: ['EDU'],
    skills: [
      'Arte e Ofício',
      'Avaliação',
      'Ciência',
      'Contabilidade',
      'Criptografia',
      'Direito',
      'História',
      'Língua (Outra)',
      'Medicina',
      'Mundo Natural',
      'Ocultismo',
      'Usar Bibliotecas'
    ],
    suggestedOccupations: [
      'Arqueólogo', 'Bibliotecário', 'Cientista', 'Escritor', 'Historiador', 'Médico', 'Professor'
    ],
    suggestedTalents: ['dois quaisquer (Memória Fotográfica ou Raciocínio Rápido)']
  },
  {
    id: 'espiao',
    name: 'Espião',
    description: 'Agente secreto treinado na arte da dissimulação, infiltração e extração de segredos nas sombras da geopolítica mundial.',
    coreCharacteristic: ['DEX', 'APP'],
    skills: [
      'Armas de Fogo (Pistolas)',
      'Charme',
      'Chaveiro',
      'Criptografia',
      'Disfarce',
      'Encontrar',
      'Escutar',
      'Falsificação',
      'Furtividade',
      'Lábia',
      'Língua (Outra)',
      'Psicologia'
    ],
    suggestedOccupations: [
      'Agente Federal', 'Diplomata', 'Espião', 'Jornalista Investigativo', 'Militar'
    ],
    suggestedTalents: ['dois quaisquer (Mestre dos Disfarces ou Rápido no Gatilho)']
  },
  {
    id: 'explorador',
    name: 'Explorador',
    description: 'Mapeador das regiões esquecidas da Terra: selvas tropicais, desertos áridos, ruínas ancestrais e geleiras intocadas.',
    coreCharacteristic: ['DEX', 'CON'],
    skills: [
      'Arremessar',
      'Cavalgar',
      'Consertos Mecânicos',
      'Escalar',
      'Furtividade',
      'Língua (Outra)',
      'Mundo Natural',
      'Natação',
      'Navegação',
      'Primeiros Socorros',
      'Rastrear',
      'Saltar',
      'Sobrevivência'
    ],
    suggestedOccupations: [
      'Arqueólogo', 'Aviador', 'Caçador de Grandes Presas', 'Cientista', 'Explorador', 'Guarda Florestal', 'Marinheiro'
    ],
    suggestedTalents: ['dois quaisquer']
  },
  {
    id: 'fanatico',
    name: 'Fanático',
    description: 'Movido por uma causa suprema, fé inabalável ou ideologia fervorosa. Nada o desviará de cumprir seu destino sagrado.',
    coreCharacteristic: ['POW'],
    skills: [
      'Arte e Ofício (Atuação)',
      'História',
      'Intimidação',
      'Lutar (Briga)',
      'Ocultismo',
      'Persuasão',
      'Psicologia',
      'Usar Bibliotecas'
    ],
    suggestedOccupations: [
      'Ativista', 'Escritor', 'Fanático', 'Líder de Culto', 'Missionário', 'Político Eleito', 'Sindicalista'
    ],
    suggestedTalents: ['dois quaisquer (Vontade de Ferro ou Espírito Inabalável)']
  },
  {
    id: 'femme-fatale',
    name: 'Femme Fatale',
    description: 'Sedutora magnética e letal que usa charme, inteligência e frieza para enredar aliados e inimigos em sua teia de intrigas.',
    coreCharacteristic: ['APP'],
    skills: [
      'Arte e Ofício (Atuação)',
      'Armas de Fogo (Pistolas)',
      'Avaliação',
      'Charme',
      'Disfarce',
      'Encontrar',
      'Escutar',
      'Furtividade',
      'Lábia',
      'Prestidigitação',
      'Psicologia'
    ],
    suggestedOccupations: [
      'Animador', 'Artista', 'Ator', 'Dama do Crime', 'Diletante', 'Espião', 'Vigarista'
    ],
    suggestedTalents: ['dois quaisquer (Fala Mansa recomendado)']
  },
  {
    id: 'forasteiro',
    name: 'Forasteiro',
    description: 'Alguém à margem da sociedade convencional, portador de tradições antigas, perspectivas singulares ou saberes que os citadinos esqueceram.',
    coreCharacteristic: ['INT', 'CON'],
    skills: [
      'Adestrar Animais',
      'Arte e Ofício',
      'Escalar',
      'Escutar',
      'Furtividade',
      'Língua (Outra)',
      'Mundo Natural',
      'Navegação',
      'Primeiros Socorros',
      'Rastrear',
      'Sobrevivência'
    ],
    suggestedOccupations: [
      'Andarilho', 'Explorador', 'Guarda Florestal', 'Marinheiro', 'Ocultista', 'Tribal', 'Vagabundo'
    ],
    suggestedTalents: ['dois quaisquer']
  },
  {
    id: 'grandalhao',
    name: 'Grandalhão',
    description: 'Puro poder muscular e presença imponente. Quando a diplomacia falha, o grandalhão resolve qualquer problema abrindo caminho na força bruta.',
    coreCharacteristic: ['STR'],
    skills: [
      'Armas de Fogo (Rifles/Espingardas)',
      'Arremessar',
      'Consertos Mecânicos',
      'Escalar',
      'Escutar',
      'Intimidação',
      'Lutar (Briga)',
      'Natação',
      'Operar Maquinário Pesado',
      'Saltar'
    ],
    suggestedOccupations: [
      'Atleta', 'Capanga Contratado', 'Gangster', 'Marinheiro', 'Mecânico', 'Operário', 'Policial de Patrulha', 'Pugilista', 'Soldado'
    ],
    suggestedTalents: ['dois quaisquer (Mão Pesada ou Pele Dura)']
  },
  {
    id: 'greaser',
    name: 'Greaser',
    description: 'Mestre dos motores, ferramentas e maquinários barulhentos. Consegue fazer qualquer ferro-velho roncar como novo sob pressão.',
    coreCharacteristic: ['STR', 'DEX'],
    skills: [
      'Arte e Ofício',
      'Avaliação',
      'Chaveiro',
      'Consertos Elétricos',
      'Consertos Mecânicos',
      'Demolições',
      'Dirigir Automóveis',
      'Lutar (Briga)',
      'Operar Maquinário Pesado',
      'Pilotar'
    ],
    suggestedOccupations: [
      'Chofer', 'Mecânico', 'Operário', 'Piloto de Fuga'
    ],
    suggestedTalents: ['dois quaisquer (Mecânico Miraculoso recomendado)']
  },
  {
    id: 'lider',
    name: 'Líder',
    description: 'Comandante nato que inspira lealdade inabalável e mantém a cabeça fria quando o caos toma conta do campo de batalha.',
    coreCharacteristic: ['APP', 'POW'],
    skills: [
      'Armas de Fogo (Pistolas)',
      'Direito',
      'História',
      'Intimidação',
      'Lutar (Briga)',
      'Navegação',
      'Persuasão',
      'Primeiros Socorros',
      'Psicologia'
    ],
    suggestedOccupations: [
      'Capitão de Navio', 'Detetive Chefe', 'Líder Político', 'Militar', 'Oficial do Exército', 'Sindicalista'
    ],
    suggestedTalents: ['dois quaisquer (Coração de Ouro ou Sangue Frio)']
  },
  {
    id: 'malandro',
    name: 'Malandro',
    description: 'Trapaceiro engenhoso e carismático que vive de acordo com suas próprias regras, zombando das leis e autoridades com um sorriso.',
    coreCharacteristic: ['DEX', 'APP'],
    skills: [
      'Arte e Ofício (Atuação)',
      'Avaliação',
      'Chaveiro',
      'Direito',
      'Disfarce',
      'Encontrar',
      'Furtividade',
      'Lábia',
      'Leitura Labial',
      'Prestidigitação',
      'Psicologia'
    ],
    suggestedOccupations: [
      'Animador', 'Apostador', 'Artista', 'Diletante', 'Espião', 'Gatuno', 'Ladrão de Bancos', 'Piloto de Fuga', 'Vigarista'
    ],
    suggestedTalents: ['dois quaisquer (Sortudo ou Fala Mansa)']
  },
  {
    id: 'mistico',
    name: 'Místico',
    description: 'Sensitivo conectado às forças invisíveis do universo, capaz de pressentir energias sutis, auras e distorções da realidade.',
    coreCharacteristic: ['POW'],
    skills: [
      'Arte e Ofício',
      'Clarividência',
      'História',
      'Hipnose',
      'Língua (Outra)',
      'Mundo Natural',
      'Ocultismo',
      'Psicologia',
      'Telecinese'
    ],
    suggestedOccupations: [
      'Artista', 'Astrólogo', 'Curandeiro', 'Líder Espiritual', 'Médium', 'Místico', 'Ocultista'
    ],
    suggestedTalents: ['dois quaisquer (Vontade de Ferro ou Intuição Aguçada)']
  },
  {
    id: 'ocultista',
    name: 'Ocultista',
    description: 'Pesquisador acadêmico ou praticante dedicado aos tomos proibidos, símbolos arcanos e grimórios de eras esquecidas.',
    coreCharacteristic: ['INT'],
    skills: [
      'Antropologia',
      'Arqueologia',
      'Avaliação',
      'História',
      'Língua (Outra)',
      'Mythos de Cthulhu',
      'Ocultismo',
      'Psicologia',
      'Usar Bibliotecas'
    ],
    suggestedOccupations: [
      'Antiquário', 'Arqueólogo', 'Bibliotecário', 'Escritor', 'Historiador', 'Ocultista', 'Professor'
    ],
    suggestedTalents: ['dois quaisquer (Vontade de Ferro ou Mente Blindada)']
  },
  {
    id: 'sangue-frio',
    name: 'Sangue-Frio',
    description: 'Pragmático implacável e calculista. Nunca hesita diante do perigo ou da violência, fazendo o que precisa ser feito sem remorso.',
    coreCharacteristic: ['INT', 'STR'],
    skills: [
      'Armas de Fogo (Pistolas)',
      'Armas de Fogo (Rifles/Espingardas)',
      'Disfarce',
      'Encontrar',
      'Escutar',
      'Furtividade',
      'Intimidação',
      'Lutar (Briga)',
      'Psicologia',
      'Rastrear'
    ],
    suggestedOccupations: [
      'Assassino de Aluguel', 'Caçador de Recompensas', 'Capanga Contratado', 'Gangster', 'Militar', 'Sicário'
    ],
    suggestedTalents: ['dois quaisquer (Sangue Frio ou Rápido no Gatilho)']
  }
];

export function getArchetypeById(id: string): Archetype | undefined {
  return archetypes.find(a => a.id === id);
}

export function searchArchetypes(query: string): Archetype[] {
  if (!query.trim()) return archetypes;
  const lower = query.toLowerCase();
  return archetypes.filter(a => 
    a.name.toLowerCase().includes(lower) ||
    a.description.toLowerCase().includes(lower) ||
    a.suggestedOccupations.some(occ => occ.toLowerCase().includes(lower))
  );
}
