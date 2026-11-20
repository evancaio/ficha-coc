export interface SkillDetail {
  name: string;
  category: string;
  baseValue: string | number;
  description: string;
  examples?: string[];
  pushConsequence?: string;
  pulpNote?: string;
  isPulp?: boolean;
}

export const skillDescriptions: Record<string, SkillDetail> = {
  // COMBATE
  "Arremessar": {
    name: "Arremessar",
    category: "Combate",
    baseValue: 20,
    description: "Permite atirar objetos como facas, pedras, granadas, coquetéis molotov ou lanças contra um alvo. O dano depende do peso do objeto ou da arma arremessada mais metade do Bônus de Dano do personagem.",
    examples: ["Lançar uma granada por uma janela estreita", "Atirar uma faca no cultista em fuga", "Lançar uma tocha acesa em uma poça de gasolina"],
    pushConsequence: "O projétil atinge um aliado por acidente, acerta o teto e cai aos seus pés, ou a granada ricocheteia."
  },
  "Armas de Fogo (Pistolas)": {
    name: "Armas de Fogo (Pistolas)",
    category: "Combate",
    baseValue: 20,
    description: "Uso de armas curtas como revólveres e pistolas semiautomáticas. Permite disparar de 1 a 3 tiros por rodada (dependendo da cadência de tiro da arma). A queima-roupa (distância em metros igual ou menor a um quinto da DES) concede um Dado de Vantagem.",
    examples: ["Disparar contra um assaltante em um beco", "Manter a mira firme contra uma criatura que avança"],
    pushConsequence: "A arma emperra na rodada seguinte, as balas ricocheteiam atingindo um inocente, ou o recuo faz você derrubar a arma."
  },
  "Armas de Fogo (Rifles/Espingardas)": {
    name: "Armas de Fogo (Rifles/Espingardas)",
    category: "Combate",
    baseValue: 25,
    description: "Capacidade de manusear e disparar rifles de caça, fuzis militares e espingardas (calibre 12, 16, 20). Espingardas causam dano massivo a curto alcance (ex: 4d6 a 10m) e reduzem o dano com a distância.",
    examples: ["Disparar com mira telescópica em um alvo distante", "Descarregar os dois canos de uma espingarda em um monstro prestes a atacar"],
    pushConsequence: "A coronha quebra, o cano aquece demais ou explode, ou o estalo do tiro atrai um enxame de inimigos."
  },
  "Armas de Fogo (Submetralhadoras)": {
    name: "Armas de Fogo (Submetralhadoras)",
    category: "Combate",
    baseValue: 15,
    description: "Uso de armas automáticas leves como a famosa Tommy Gun (Thompson .45). Permite disparar em rajadas curtas ou longas usando a mecânica de disparos múltiplos.",
    examples: ["Disparar uma saraivada para varrer um corredor", "Disparar da janela de um carro em perseguição"],
    pushConsequence: "O pente de tambor trava, o recuo destrói a cobertura ou um tiro perdido perfura o cano de gás."
  },
  "Armas de Fogo (Metralhadoras)": {
    name: "Armas de Fogo (Metralhadoras)",
    category: "Combate",
    baseValue: 10,
    description: "Armas automáticas pesadas tripés ou montadas em veículos (Browning M1917, Vickers). Capazes de fogo de supressão contínuo e saturação de área.",
    examples: ["Defender um ponto fortificado contra dezenas de cultistas"],
    pushConsequence: "Superaquecimento do cano, fita de munição presa ou incapacidade de mirar."
  },
  "Armas de Fogo (Lança-Chamas)": {
    name: "Armas de Fogo (Lança-Chamas)",
    category: "Combate",
    baseValue: 10,
    description: "Armas que projetam jatos de combustível em chamas. Causa 2D6 de dano de fogo na primeira rodada e 1D6 por rodada subsequente até que a vítima apague as chamas.",
    examples: ["Desinfetar um ninho de larvas de Cthulhu", "Incendiar uma barricada infestada"],
    pushConsequence: "O tanque de combustível vaza sobre o operador ou o fogo se espalha para sua própria rota de fuga."
  },
  "Esquivar": {
    name: "Esquivar",
    category: "Combate",
    baseValue: "Metade da DES",
    description: "Permite que o personagem salte, abaixe-se ou fuja da trajetória de golpes corpo a corpo ou projéteis arremessados. Em combate, esquivar é uma das opções ao reagir a um ataque (o defensor só precisa empatar o nível de sucesso do atacante).",
    examples: ["Jogar-se no chão ao ver um cultista erguer a lâmina", "Saltar para trás de um pilar quando um bloco de pedra despenca"],
    pushConsequence: "Não é permitido forçar um teste de Esquivar (é uma reação reflexa imediata)."
  },
  "Lutar (Briga)": {
    name: "Lutar (Briga)",
    category: "Combate",
    baseValue: 25,
    description: "Combate corpo a corpo desarmado (socos, chutes, cabeçadas, agarrões) e com armas improvisadas (garrafas quebradas, cadeiras, canos). Em combate, quem contra-ataca com Lutar causa dano se obtiver um nível de sucesso maior que o atacante.",
    examples: ["Derrubar um segurança no soco", "Imobilizar um cultista enlouquecido", "Golpear com um castiçal de ferro"],
    pushConsequence: "Não é permitido forçar testes de combate corpo a corpo na mesma troca de golpes."
  },
  "Lutar (Espadas)": {
    name: "Lutar (Espadas)",
    category: "Combate",
    baseValue: 20,
    description: "Combate habilidoso com sabres de cavalaria, floretes, espadas cerimoniais e catanas.",
    examples: ["Duels de esgrima", "Defender-se contra uma besta usando uma espada antiga de museu"]
  },
  "Lutar (Machados)": {
    name: "Lutar (Machados)",
    category: "Combate",
    baseValue: 15,
    description: "Uso de machados de lenhador, machadinhas e armas de corte pesadas. Causa dano cortante com empalamento em sucessos extremos."
  },
  "Lutar (Chicotes)": {
    name: "Lutar (Chicotes)",
    category: "Combate",
    baseValue: 5,
    description: "Típico dos heróis de aventura e exploração, permite desarmar, puxar itens à distância e golpear mantendo distância segura."
  },

  // INTERPESSOAL
  "Charme": {
    name: "Charme",
    category: "Interpessoal",
    baseValue: 15,
    description: "A arte de seduzir, bajular, cativar e gerar simpatia calorosa. Ao contrário da Lábia, o Charme convence a pessoa porque ela genuinamente gosta de você e quer te ajudar.",
    examples: ["Convencer a recepcionista a liberar uma visita fora do horário", "Encantar um nobre rico para ser convidado para o leilão secreto", "Fazer um guarda esquecer a grosseria de um companheiro"],
    pushConsequence: "Você passa dos limites e parece um bajulador vulgar, um predador arrogante ou ofende profundamente a pessoa."
  },
  "Lábia": {
    name: "Lábia",
    category: "Interpessoal",
    baseValue: 5,
    description: "A arte do embuste rápido, da mentira convincente, da trapaça e do 'conto do vigário'. Faz o alvo acreditar em algo falso tempo suficiente para você conseguir o que quer e sair de fininho.",
    examples: ["Fingir ser o inspetor sanitário para entrar na fábrica", "Inventar uma desculpa esfarrapada para estar revirando a mesa do diretor", "Fazer um comerciante aceitar uma nota promissória sem fundos"],
    pushConsequence: "A mentira é desmascarada no meio da conversa; a polícia é chamada imediatamente ou o alvo se torna hostil e vigilante."
  },
  "Persuasão": {
    name: "Persuasão",
    category: "Interpessoal",
    baseValue: 10,
    description: "Convencer alguém através de argumentos lógicos, apelo à razão, debate e fatos verdadeiros. A Persuasão não envolve mentiras ou ameaças; ela muda genuinamente a convicção do interlocutor.",
    examples: ["Convencer o prefeito a decretar toque de recolher na cidade", "Debater com o bibliotecário para ter acesso à ala de manuscritos raros", "Persuadir um colega de equipe a não desistir da investigação"],
    pushConsequence: "O interlocutor se fecha em suas convicções e se recusa terminantemente a debater o assunto com você novamente."
  },
  "Intimidação": {
    name: "Intimidação",
    category: "Interpessoal",
    baseValue: 15,
    description: "Forçar alguém a cooperar por medo, ameaça de violência física, chantagem moral ou pura imposição de autoridade e terror.",
    examples: ["Pressionar um informante contra a parede de um beco", "Ameaçar queimar a loja de um contrabandista se ele não falar a verdade", "Fazer um valentão hesitar antes de sacar sua navalha"],
    pushConsequence: "A vítima decide lutar pela própria vida ou foge gritando por socorro, denunciando você publicamente."
  },
  "Psicologia": {
    name: "Psicologia",
    category: "Conhecimento",
    baseValue: 10,
    description: "Capacidade de 'ler' as pessoas: perceber mentiras, intenções ocultas, estado mental e emoções reais através de linguagem corporal, tom de voz e expressões faciais. É o teste resistido padrão contra Lábia.",
    examples: ["Perceber se o suspeito está escondendo o paradeiro da vítima", "Notar que o médico do asilo está apavorado com algo no porão", "Descobrir o ponto fraco emocional de um rival para usar em uma negociação"],
    pushConsequence: "Você tira uma conclusão completamente errada e paranoica sobre o alvo, confiando em um traidor ou acusando um inocente."
  },
  "Língua (Nativa)": {
    name: "Língua (Nativa)",
    category: "Interpessoal",
    baseValue: "EDU",
    description: "Fluência total, leitura, escrita e compreensão das nuances culturais da sua língua materna (geralmente Português ou Inglês nos anos 1920)."
  },
  "Língua (Outra)": {
    name: "Língua (Outra)",
    category: "Interpessoal",
    baseValue: 1,
    description: "Capacidade de falar, ler e escrever em idiomas estrangeiros (como Latim, Francês, Alemão, Grego, Árabe clássico). Fundamental para traduzir tomos antigos."
  },

  // INVESTIGAÇÃO
  "Encontrar": {
    name: "Encontrar",
    category: "Investigação",
    baseValue: 25,
    description: "A mais importante perícia de busca visual. Permite notar pistas escondidas, compartimentos secretos, objetos caídos no chão, pegadas quase apagadas e pessoas escondidas nas sombras.",
    examples: ["Encontrar o diário falso em meio a centenas de livros", "Localizar a alavanca oculta que abre a passagem na cripta", "Notar resquícios de pó estranho nas roupas da vítima"],
    pushConsequence: "Você revira e destrói o local, derrubando um vaso que chama a atenção do vigia ou contaminando a cena do crime."
  },
  "Escutar": {
    name: "Escutar",
    category: "Investigação",
    baseValue: 20,
    description: "Atenção auditiva para detectar passos lentos no corredor, sussurros através de uma porta trancada, o estalo de uma madeira rangendo ou o canto distante de cultistas.",
    examples: ["Ouvir passos no teto de madeira antes de uma emboscada", "Tentar decifrar a conversa abafada atrás da porta do laboratório"],
    pushConsequence: "Você faz barulho ao tentar encostar o ouvido ou é flagrado com a cabeça na porta no momento em que ela se abre."
  },
  "Usar Bibliotecas": {
    name: "Usar Bibliotecas",
    category: "Investigação",
    baseValue: 20,
    description: "Habilidade de pesquisar em arquivos públicos, cartórios, bibliotecas universitárias e jornais antigos para encontrar registros históricos, certidões de óbito e menções a linhagens amaldiçoadas.",
    examples: ["Encontrar notícias sobre o naufrágio misterioso de 1888", "Descobrir o nome do arquiteto que construiu o casarão em ruínas"],
    pushConsequence: "O bibliotecário expulsa você por suspeita de danificar os livros ou confisca o tomo proibido."
  },
  "Rastrear": {
    name: "Rastrear",
    category: "Investigação",
    baseValue: 10,
    description: "Seguir pegadas de homens, animais ou criaturas no solo, galhos quebrados, sangue e sinais de passagem por florestas, pântanos ou ruínas."
  },
  "Avaliação": {
    name: "Avaliação",
    category: "Investigação",
    baseValue: 5,
    description: "Determinar o valor de mercado, autenticidade e idade de joias, antiguidades, obras de arte e artefatos raros. Ajuda a identificar falsificações."
  },

  // MANIPULAÇÃO & TÉCNICAS
  "Chaveiro": {
    name: "Chaveiro",
    category: "Manipulação",
    baseValue: 1,
    description: "Abrir fechaduras trancadas sem chave, desarmar travas mecânicas simples e arrombar trincos sem danificar a porta.",
    examples: ["Gazuetear o cadeado da adega secreta", "Abrir a gaveta trancada da escrivaninha do reitor"],
    pushConsequence: "A gazua quebra dentro do miolo da fechadura, bloqueando-a definitivamente e deixando suas digitais."
  },
  "Consertos Elétricos": {
    name: "Consertos Elétricos",
    category: "Manipulação",
    baseValue: 10,
    description: "Reparar circuitos elétricos, geradores, cabos de força, disjuntores e sistemas de iluminação dos anos 1920.",
    examples: ["Restabelecer a energia elétrica da mansão durante a tempestade", "Desarmar um alarme eletrônico primitivo"],
    pushConsequence: "Você leva um choque severo (dano) e queima todo o painel de força com um estouro barulhento."
  },
  "Consertos Mecânicos": {
    name: "Consertos Mecânicos",
    category: "Manipulação",
    baseValue: 10,
    description: "Montar, desmontar e consertar máquinas, motores a combustão, armas de fogo emperradas, engrenagens e encanamentos.",
    examples: ["Consertar o motor do carro para fugir dos monstros", "Fabricar uma peça de substituição para a caldeira"],
    pushConsequence: "A peça quebra no meio da tentativa ou você prende os dedos nas engrenagens."
  },
  "Disfarce": {
    name: "Disfarce",
    category: "Manipulação",
    baseValue: 5,
    description: "Alterar sua aparência física com maquiagem, roupas, perucas e maneirismos para se passar por outra pessoa ou ocultar sua identidade.",
    examples: ["Disfarçar-se de enfermeiro para entrar no sanatório", "Vestir os mantos rituais para se infiltrar no culto sem ser notado"]
  },
  "Prestidigitação": {
    name: "Prestidigitação",
    category: "Manipulação",
    baseValue: 10,
    description: "Agilidade manual para bater carteiras, ocultar pequenos objetos nas mãos ou mangas, plantar provas e truques de mágica de salão.",
    examples: ["Tirar a chave do bolso do guarda enquanto esbarra nele", "Esconder a pedra sagrada na manga antes de ser revistado"]
  },
  "Demolições": {
    name: "Demolições",
    category: "Manipulação",
    baseValue: 1,
    description: "Manuseio seguro, preparação e detonação de dinamite, pólvora e explosivos para abrir túneis ou colapsar estruturas amaldiçoadas."
  },

  // CONHECIMENTO & CIÊNCIA
  "Medicina": {
    name: "Medicina",
    category: "Conhecimento",
    baseValue: 1,
    description: "Conhecimento profissional para diagnosticar doenças, prescrever tratamentos, realizar cirurgias e estabilizar feridos graves. Em Call of Cthulhu, um teste de Medicina bem-sucedido recupera 1D3 PV (ou 1D3+1D6 no Pulp com gasto de Sorte) e reverte o estado Morrendo.",
    examples: ["Suturar ferimentos profundos após um combate", "Diagnosticar a causa da morte em uma necropsia", "Tratar infecções causadas por venenos alienígenas"],
    pushConsequence: "O paciente sofre hemorragia severa ou infecção generalizada, piorando sua condição."
  },
  "Primeiros Socorros": {
    name: "Primeiros Socorros",
    category: "Conhecimento",
    baseValue: 30,
    description: "Atendimento emergencial rápido (bandagens, torniquetes, massagem cardíaca). Recupera 1 PV imediatamente se aplicado na mesma hora em que o ferimento ocorreu. Pode estabilizar um personagem Morrendo.",
    examples: ["Enfaixar um amigo ferido por garras", "Tirar uma vítima de sufocamento antes que perca os sentidos"]
  },
  "Psicanálise": {
    name: "Psicanálise",
    category: "Conhecimento",
    baseValue: 1,
    description: "Tratamento psicológico e psiquiátrico profundo. Permite acalmar surtos imediatos de insanidade (parando a fobia ou mania) e, ao longo de semanas de terapia, restaurar pontos de Sanidade (SAN) perdidos.",
    examples: ["Acalmar um companheiro em pânico histérico no meio da cripta", "Terapia para remover a fobia de água adquirida após ver Dagon"]
  },
  "Ocultismo": {
    name: "Ocultismo",
    category: "Conhecimento",
    baseValue: 5,
    description: "Conhecimento sobre folclore, superstições humanas, rituais de sociedades secretas, cabala, espiritismo e lendas urbanas. IMPORTANTE: Ocultismo cobre as crenças humanas falsas ou distorcidas; o conhecimento real dos deuses cósmicos pertence a Mythos de Cthulhu.",
    examples: ["Reconhecer um símbolo mágico hermético", "Saber o mito folclórico de um vilarejo sobre lobisomens"]
  },
  "Mythos de Cthulhu": {
    name: "Mythos de Cthulhu",
    category: "Mythos",
    baseValue: 0,
    description: "O conhecimento aterrorizante da verdadeira realidade do universo: os Grandes Antigos, Deuses Exteriores, feitiços alienígenas e dimensões além do tempo. Nunca pode receber pontos na criação. Aumenta ao ler tomos proibidos ou testemunhar horrores cósmicos, e reduz permanentemente o valor máximo de Sanidade do personagem.",
    examples: ["Compreender os encantamentos do Necronomicon", "Reconhecer uma criatura das profundezas"]
  },
  "História": {
    name: "História",
    category: "Conhecimento",
    baseValue: 5,
    description: "Conhecimento sobre civilizações antigas, guerras, tratados, figuras históricas e linhagens familiares."
  },
  "Direito": {
    name: "Direito",
    category: "Conhecimento",
    baseValue: 5,
    description: "Conhecimento de leis civis, criminais, procedimentos policiais, mandados de busca e precedentes legais."
  },
  "Contabilidade": {
    name: "Contabilidade",
    category: "Conhecimento",
    baseValue: 5,
    description: "Auditoria e análise de livros contábeis, extratos bancários e transações financeiras para descobrir lavagem de dinheiro, corrupção e doações para cultos."
  },
  "Mundo Natural": {
    name: "Mundo Natural",
    category: "Conhecimento",
    baseValue: 10,
    description: "Compreensão prática da vida selvagem, animais, plantas, clima e ecossistemas naturais da Terra."
  },

  // FÍSICAS
  "Furtividade": {
    name: "Furtividade",
    category: "Físicas",
    baseValue: 20,
    description: "Mover-se em silêncio absoluto, esconder-se nas sombras e evitar detecção visual ou auditiva de guardas e monstros.",
    examples: ["Passar despercebido por cultistas em vigília", "Infiltrar-se nos fundos do armazém sem fazer barulho"],
    pushConsequence: "Você derruba algo com estrondo ou pisa em uma tábua frouxa que geme alto."
  },
  "Escalar": {
    name: "Escalar",
    category: "Físicas",
    baseValue: 20,
    description: "Subir muros, penhascos, fachadas de edifícios, árvores e cordas sem equipamento moderno."
  },
  "Saltar": {
    name: "Saltar",
    category: "Físicas",
    baseValue: 20,
    description: "Pular horizontalmente entre telhados ou desfiladeiros, ou saltar verticalmente para amortecer quedas perigosas."
  },
  "Natação": {
    name: "Natação",
    category: "Físicas",
    baseValue: 20,
    description: "Manter-se à tona e nadar em águas calmas ou revoltas. Evita afogamento quando arremessado no mar."
  },
  "Dirigir Automóveis": {
    name: "Dirigir Automóveis",
    category: "Físicas",
    baseValue: 20,
    description: "Manobrar carros normais em condições extremas, perseguições em alta velocidade, estradas de terra enlameadas e derrapagens controladas."
  },
  "Pilotar": {
    name: "Pilotar",
    category: "Físicas",
    baseValue: 1,
    description: "Pilotar aviões biplanos, hidroaviões, barcos a vapor ou aeronaves especiais."
  },
  "Sobrevivência": {
    name: "Sobrevivência",
    category: "Físicas",
    baseValue: 10,
    description: "Sobreviver em ambientes hostis (desertos, selvas, ártico): encontrar água potável, construir abrigos e evitar hipotermia."
  },

  // PULP CTHULHU ESPECIAIS
  "Ciência Estranha": {
    name: "Ciência Estranha",
    category: "Manipulação",
    baseValue: 1,
    isPulp: true,
    description: "A ciência dos gênios inventores e cientistas loucos de Pulp Cthulhu. Permite projetar, construir e consertar protótipos de alta tecnologia futurista ou absurda: armas de raios da morte, soros de invisibilidade, capacetes telepáticos e máquinas do tempo.",
    examples: ["Construir uma pistola de calor iônico", "Reparar um aparato alienígena de teletransporte"],
    pulpNote: "Exclusiva de Pulp Cthulhu para inventores e arquétipos como Gênio/Cientista."
  },
  "Clarividência": {
    name: "Clarividência",
    category: "Especiais",
    baseValue: 0,
    isPulp: true,
    description: "Habilidade psíquica de receber visões do presente em locais distantes ou vislumbres do futuro imediato.",
    pulpNote: "Poder psíquico opcional de Pulp Cthulhu."
  },
  "Psicometria": {
    name: "Psicometria",
    category: "Especiais",
    baseValue: 0,
    isPulp: true,
    description: "Capacidade psíquica de tocar um objeto ou local e vivenciar memórias ou emoções residuais de quem o segurou no passado.",
    pulpNote: "Poder psíquico opcional de Pulp Cthulhu."
  },
  "Telecinese": {
    name: "Telecinese",
    category: "Especiais",
    baseValue: 0,
    isPulp: true,
    description: "Mover e manipular objetos físicos usando apenas a força da mente e Pontos de Magia.",
    pulpNote: "Poder psíquico opcional de Pulp Cthulhu."
  },
  "Telepatia": {
    name: "Telepatia",
    category: "Especiais",
    baseValue: 0,
    isPulp: true,
    description: "Comunicação mental direta entre mentes e leitura de pensamentos superficiais.",
    pulpNote: "Poder psíquico opcional de Pulp Cthulhu."
  }
};

export function getSkillDescription(skillName: string): SkillDetail {
  // Direct match
  if (skillDescriptions[skillName]) {
    return skillDescriptions[skillName];
  }

  // Prefix match (e.g., "Ciência (Química)" matches "Ciência")
  for (const key of Object.keys(skillDescriptions)) {
    if (skillName.startsWith(key)) {
      return {
        ...skillDescriptions[key],
        name: skillName
      };
    }
  }

  // Fallback
  return {
    name: skillName,
    category: "Geral",
    baseValue: 1,
    description: `Perícia de ${skillName}. Permite realizar testes relacionados a este campo de conhecimento ou habilidade física sob tensão.`
  };
}
