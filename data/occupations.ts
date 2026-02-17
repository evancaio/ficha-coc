// Lista completa de ocupações do Call of Cthulhu 7ª Edição em Português

export interface SkillChoice {
    count: number; // Quantas perícias escolher
    options: string[]; // Opções disponíveis
    description: string; // Descrição da escolha (ex: "duas perícias interpessoais")
}

export interface Occupation {
    name: string;
    skillPoints: string; // Fórmula para calcular pontos
    creditRating: string; // Faixa de nível de crédito
    suggestedSkills: string[]; // Perícias fixas sugeridas
    skillChoices?: SkillChoice[]; // Escolhas de perícias opcionais
    era?: 'classic' | 'modern'; // Algumas ocupações são específicas de era
}

export const occupations: Occupation[] = [
    {
        name: "Acrobata",
        skillPoints: "EDU × 2 + DES × 2",
        creditRating: "9–20",
        suggestedSkills: ["Arremessar", "Encontrar", "Escalar", "Esquivar", "Natação", "Saltar"],
        skillChoices: [
            {
                count: 2,
                options: [],
                description: "2 outras da era"
            }
        ]
    },
    {
        name: "Agente Federal",
        skillPoints: "EDU × 4",
        creditRating: "20–40",
        suggestedSkills: ["Armas de Fogo", "Direito", "Dirigir Automóveis", "Encontrar", "Furtividade", "Lutar (Briga)", "Persuasão"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "1 à escolha"
            }
        ]
    },
    {
        name: "Agente Funerário",
        skillPoints: "EDU × 4",
        creditRating: "20–40",
        suggestedSkills: ["Ciência (Biologia)", "Ciência (Química)", "Contabilidade", "Dirigir Automóveis", "História", "Ocultismo", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "1 interpessoal"
            }
        ]
    },
    {
        name: "Agricultor",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Arte/Ofício (Agricultura)", "Consertos Mecânicos", "Mundo Natural", "Operar Maquinário Pesado", "Rastrear"],
        skillChoices: [
            {
                count: 1,
                options: ["Dirigir Automóveis", "Cavalgar"],
                description: "Dirigir Automóveis ou Cavalgar"
            },
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "1 interpessoal"
            }
        ]
    },
    {
        name: "Alienista",
        skillPoints: "EDU × 4",
        creditRating: "10–60",
        suggestedSkills: ["Ciência (Biologia)", "Ciência (Química)", "Direito", "Escutar", "Medicina", "Psicanálise", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            }
        ],
        era: "classic"
    },
    {
        name: "Alpinista",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "30–60",
        suggestedSkills: ["Escalar", "Escutar", "Navegação", "Primeiros Socorros", "Rastrear", "Saltar", "Sobrevivência"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            }
        ]
    },
    {
        name: "Andarilho",
        skillPoints: "EDU × 2 + (APA × 2 ou DES × 2 ou FOR × 2)",
        creditRating: "0–5",
        suggestedSkills: ["Escalar", "Escutar", "Furtividade", "Navegação", "Saltar"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "1 interpessoal"
            },
            {
                count: 2,
                options: [],
                description: "2 outras"
            }
        ]
    },
    {
        name: "Animador",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "9–70",
        suggestedSkills: ["Disfarce", "Escutar", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Arte/Ofício (especificar)"
            },
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "2 interpessoais"
            },
            {
                count: 2,
                options: [],
                description: "2 outras"
            }
        ]
    },
    {
        name: "Antiquário",
        skillPoints: "EDU × 4",
        creditRating: "30–70",
        suggestedSkills: ["Avaliação", "Encontrar", "História", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Arte/Ofício"
            },
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "1 interpessoal"
            },
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            },
            {
                count: 1,
                options: [],
                description: "1 outra"
            }
        ]
    },
    {
        name: "Apostador",
        skillPoints: "EDU × 2 + (APA × 2 ou DES × 2)",
        creditRating: "8–50",
        suggestedSkills: ["Arte/Ofício (Atuação)", "Contabilidade", "Encontrar", "Escutar", "Prestidigitação", "Psicologia"],
        skillChoices: [
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "2 interpessoais"
            }
        ]
    },
    {
        name: "Arqueólogo",
        skillPoints: "EDU × 4",
        creditRating: "10–40",
        suggestedSkills: ["Avaliação", "Consertos Mecânicos", "Encontrar", "História", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            },
            {
                count: 1,
                options: ["Navegação", "Ciência"],
                description: "Navegação ou Ciência"
            }
        ]
    },
    {
        name: "Arquiteto",
        skillPoints: "EDU × 4",
        creditRating: "30–70",
        suggestedSkills: ["Arte/Ofício (Desenho Técnico)", "Ciência (Matemática)", "Contabilidade", "Direito", "Persuasão", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Língua Nativa"
            },
            {
                count: 1,
                options: ["Usar Computadores", "Usar Bibliotecas"],
                description: "Usar Computadores ou Usar Bibliotecas"
            }
        ]
    },
    {
        name: "Artesão",
        skillPoints: "EDU × 2 + DES × 2",
        creditRating: "10–40",
        suggestedSkills: ["Consertos Mecânicos", "Contabilidade", "Encontrar", "Mundo Natural"],
        skillChoices: [
            {
                count: 2,
                options: [],
                description: "Arte/Ofício x2"
            },
            {
                count: 2,
                options: [],
                description: "2 outras"
            }
        ]
    },
    {
        name: "Artista",
        skillPoints: "EDU × 2 + (DES × 2 ou POD × 2)",
        creditRating: "9–50",
        suggestedSkills: ["Encontrar", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Arte/Ofício"
            },
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "1 interpessoal"
            },
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            },
            {
                count: 1,
                options: ["História", "Mundo Natural"],
                description: "História ou Mundo Natural"
            },
            {
                count: 2,
                options: [],
                description: "2 outras"
            }
        ]
    },
    {
        name: "Assistente de Sanatório",
        skillPoints: "EDU × 2 + (FOR × 2 ou DES × 2)",
        creditRating: "8–20",
        suggestedSkills: ["Escutar", "Esquivar", "Furtividade", "Lutar (Briga)", "Primeiros Socorros", "Psicologia"]
    },
    {
        name: "Atleta",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–70",
        suggestedSkills: ["Arremessar", "Cavalgar", "Escalar", "Lutar (Briga)", "Natação", "Saltar"]
    },
    {
        name: "Ator de Teatro",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "9–40",
        suggestedSkills: ["Arte/Ofício (Atuação)", "Disfarce", "História", "Psicologia"]
    },
    {
        name: "Estrela de Cinema",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "20–90",
        suggestedSkills: ["Arte/Ofício (Atuação)", "Dirigir Automóveis", "Disfarce", "Psicologia"]
    },
    {
        name: "Auxiliar de Laboratório",
        skillPoints: "EDU × 4",
        creditRating: "10–30",
        suggestedSkills: ["Ciência (Química)", "Consertos Elétricos", "Encontrar", "Usar Bibliotecas"]
    },
    {
        name: "Bartender",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "8–25",
        suggestedSkills: ["Contabilidade", "Encontrar", "Escutar", "Lutar (Briga)", "Psicologia"]
    },
    {
        name: "Bibliotecário",
        skillPoints: "EDU × 4",
        creditRating: "9–35",
        suggestedSkills: ["Contabilidade", "Usar Bibliotecas"]
    },
    {
        name: "Bombeiro",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Arremessar", "Consertos Mecânicos", "Dirigir Automóveis", "Escalar", "Esquivar", "Operar Maquinário Pesado", "Primeiros Socorros", "Saltar"]
    },
    {
        name: "Caçador de Grandes Presas",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "20–50",
        suggestedSkills: ["Armas de Fogo", "Ciência (Biologia)", "Furtividade", "Mundo Natural", "Navegação", "Rastrear", "Sobrevivência"]
    },
    {
        name: "Caçador de Recompensas",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Direito", "Dirigir Automóveis", "Furtividade", "Psicologia", "Rastrear"]
    },
    {
        name: "Cavalheiro/Dama",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "40–90",
        suggestedSkills: ["Armas de Fogo (Rifles/Espingardas)", "Arte/Ofício", "Cavalgar", "História", "Navegação"]
    },
    {
        name: "Cientista",
        skillPoints: "EDU × 4",
        creditRating: "9–50",
        suggestedSkills: ["Ciência", "Encontrar", "Usar Bibliotecas"]
    },
    {
        name: "Cirurgião Forense",
        skillPoints: "EDU × 4",
        creditRating: "40–60",
        suggestedSkills: ["Ciência (Biologia)", "Ciência (Forense)", "Ciência (Farmácia)", "Encontrar", "Medicina", "Persuasão", "Usar Bibliotecas"]
    },
    {
        name: "Clero, Membro do",
        skillPoints: "EDU × 4",
        creditRating: "9–60",
        suggestedSkills: ["Contabilidade", "Escutar", "História", "Psicologia", "Usar Bibliotecas"]
    },
    {
        name: "Contador",
        skillPoints: "EDU × 4",
        creditRating: "30–70",
        suggestedSkills: ["Contabilidade", "Direito", "Encontrar", "Escutar", "Persuasão", "Usar Bibliotecas"]
    },
    {
        name: "Correspondente Estrangeiro",
        skillPoints: "EDU × 4",
        creditRating: "10–40",
        suggestedSkills: ["Escutar", "História", "Psicologia"]
    },
    {
        name: "Cowboy/Cowgirl",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–20",
        suggestedSkills: ["Arremessar", "Cavalgar", "Esquivar", "Primeiros Socorros", "Rastrear", "Saltar", "Sobrevivência", "Mundo Natural"]
    },
    {
        name: "Criminoso - Assassino",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "30–60",
        suggestedSkills: ["Armas de Fogo", "Chaveiro", "Consertos Elétricos", "Consertos Mecânicos", "Disfarce", "Furtividade", "Lutar", "Psicologia"]
    },
    {
        name: "Criminoso - Assaltante de Banco",
        skillPoints: "EDU × 2 + (FOR × 2 ou DES × 2)",
        creditRating: "5–75",
        suggestedSkills: ["Armas de Fogo", "Chaveiro", "Dirigir Automóveis", "Intimidação", "Lutar", "Operar Maquinário Pesado"]
    },
    {
        name: "Criminoso - Arrombador",
        skillPoints: "EDU × 2 + DES × 2",
        creditRating: "5–40",
        suggestedSkills: ["Avaliação", "Chaveiro", "Encontrar", "Escalar", "Escutar", "Furtividade", "Prestidigitação"]
    },
    {
        name: "Criminoso - Golpista",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "10–65",
        suggestedSkills: ["Arte/Ofício (Atuação)", "Avaliação", "Direito", "Escutar", "Prestidigitação", "Psicologia"]
    },
    {
        name: "Criminoso - Falsificador",
        skillPoints: "EDU × 4",
        creditRating: "20–60",
        suggestedSkills: ["Arte/Ofício (Falsificação)", "Avaliação", "Contabilidade", "Encontrar", "História", "Prestidigitação", "Usar Bibliotecas"]
    },
    {
        name: "Curador de Museu",
        skillPoints: "EDU × 4",
        creditRating: "20–40",
        suggestedSkills: ["Avaliação", "Contabilidade", "Encontrar", "História", "Ocultismo", "Usar Bibliotecas"]
    },
    {
        name: "Designer",
        skillPoints: "EDU × 4",
        creditRating: "10–40",
        suggestedSkills: ["Arte/Ofício", "Consertos Mecânicos", "Contabilidade", "Encontrar", "Psicologia"]
    },
    {
        name: "Desprogramador",
        skillPoints: "EDU × 4",
        creditRating: "10–30",
        suggestedSkills: ["Dirigir Automóveis", "Furtividade", "História", "Ocultismo", "Psicologia"],
        era: "modern"
    },
    {
        name: "Detetive de Agência",
        skillPoints: "EDU × 2 + (FOR × 2 ou DES × 2)",
        creditRating: "20–45",
        suggestedSkills: ["Armas de Fogo", "Direito", "Furtividade", "Lutar (Briga)", "Psicologia", "Rastrear", "Usar Bibliotecas"]
    },
    {
        name: "Detetive Particular",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Arte/Ofício (Fotografia)", "Direito", "Disfarce", "Encontrar", "Psicologia", "Usar Bibliotecas"]
    },
    {
        name: "Diletante",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "50–99",
        suggestedSkills: ["Armas de Fogo", "Arte/Ofício", "Cavalgar"], // Mantendo como sugestão geral, mas definindo a escolha abaixo
        skillChoices: [
            {
                count: 1,
                options: ["Arte/Ofício", "Armas de Fogo", "Cavalgar"], // Opções explícitas
                description: "Arte e Ofício (qualquer), Armas de Fogo ou Cavalgar"
            },
            {
                count: 1,
                options: [],
                description: "Uma outra perícia como especialidade pessoal ou da era" // Geralmente Diletantes tem isso
            },
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"], // E perícias interpessoais
                description: "Duas perícias interpessoais"
            }
        ]
    },
    {
        name: "Dublê",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "10–50",
        suggestedSkills: ["Cavalgar", "Dirigir Automóveis", "Escalar", "Esquivar", "Lutar", "Mergulho", "Natação", "Pilotar", "Primeiros Socorros", "Saltar"]
    },
    {
        name: "Editor",
        skillPoints: "EDU × 4",
        creditRating: "10–30",
        suggestedSkills: ["Contabilidade", "Encontrar", "História", "Psicologia"]
    },
    {
        name: "Enfermeiro",
        skillPoints: "EDU × 4",
        creditRating: "9–30",
        suggestedSkills: ["Ciência (Biologia)", "Ciência (Química)", "Encontrar", "Escutar", "Medicina", "Primeiros Socorros", "Psicologia"]
    },
    {
        name: "Engenheiro",
        skillPoints: "EDU × 4",
        creditRating: "30–60",
        suggestedSkills: ["Arte/Ofício (Desenho Técnico)", "Ciência (Engenharia)", "Ciência (Física)", "Consertos Elétricos", "Consertos Mecânicos", "Operar Maquinário Pesado", "Usar Bibliotecas"]
    },
    {
        name: "Escritor",
        skillPoints: "EDU × 4",
        creditRating: "9–30",
        suggestedSkills: ["História", "Mundo Natural", "Ocultismo", "Psicologia", "Usar Bibliotecas"]
    },
    {
        name: "Espião",
        skillPoints: "EDU × 2 + (APA × 2 ou DES × 2)",
        creditRating: "20–60",
        suggestedSkills: ["Armas de Fogo", "Arte/Ofício (Atuação)", "Disfarce", "Escutar", "Furtividade", "Prestidigitação", "Psicologia"]
    },
    {
        name: "Estudante/Estagiário",
        skillPoints: "EDU × 4",
        creditRating: "5–10",
        suggestedSkills: ["Escutar", "Usar Bibliotecas"]
    },
    {
        name: "Explorador",
        skillPoints: "EDU × 2 + (APA × 2 ou DES × 2 ou FOR × 2)",
        creditRating: "55–80",
        suggestedSkills: ["Armas de Fogo", "Escalar", "História", "Mundo Natural", "Natação", "Navegação", "Saltar", "Sobrevivência"],
        era: "classic"
    },
    {
        name: "Fanático",
        skillPoints: "EDU × 2 + (APA × 2 ou POD × 2)",
        creditRating: "0–30",
        suggestedSkills: ["Furtividade", "História", "Psicologia"]
    },
    {
        name: "Farmacêutico",
        skillPoints: "EDU × 4",
        creditRating: "35–75",
        suggestedSkills: ["Ciência (Farmácia)", "Ciência (Química)", "Contabilidade", "Primeiros Socorros", "Psicologia", "Usar Bibliotecas"]
    },
    {
        name: "Fotógrafo",
        skillPoints: "EDU × 4",
        creditRating: "9–30",
        suggestedSkills: ["Arte/Ofício (Fotografia)", "Ciência (Química)", "Encontrar", "Furtividade", "Psicologia"]
    },
    {
        name: "Gangster - Chefão",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "60–95",
        suggestedSkills: ["Armas de Fogo", "Direito", "Encontrar", "Escutar", "Lutar", "Psicologia"]
    },
    {
        name: "Gangster - Subalterno",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–20",
        suggestedSkills: ["Armas de Fogo", "Dirigir Automóveis", "Lutar", "Psicologia"]
    },
    {
        name: "Garçonete/Garçom",
        skillPoints: "EDU × 2 + (APA × 2 ou DES × 2)",
        creditRating: "9–20",
        suggestedSkills: ["Arte/Ofício", "Contabilidade", "Escutar", "Esquivar", "Psicologia"]
    },
    {
        name: "Vagabundo",
        skillPoints: "EDU × 2 + (APA × 2 ou DES × 2)",
        creditRating: "0–5",
        suggestedSkills: ["Escalar", "Escutar", "Furtividade", "Navegação", "Saltar"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Arte/Ofício (qualquer)"
            },
            {
                count: 1,
                options: ["Chaveiro", "Prestidigitação"],
                description: "Chaveiro ou Prestidigitação"
            },
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Vendedor",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "9–40",
        suggestedSkills: ["Contabilidade", "Dirigir Automóveis", "Escutar", "Psicologia"],
        skillChoices: [
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "duas perícias interpessoais"
            },
            {
                count: 1,
                options: ["Furtividade", "Prestidigitação"],
                description: "Furtividade ou Prestidigitação"
            },
            {
                count: 1,
                options: [], // Empty means "any skill"
                description: "qualquer outra perícia"
            }
        ]
    },
    {
        name: "Tribal",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "0–15",
        suggestedSkills: ["Encontrar", "Escalar", "Escutar", "Mundo Natural", "Natação", "Ocultismo", "Sobrevivência"],
        skillChoices: [
            {
                count: 1,
                options: ["Lutar", "Arremessar"],
                description: "Lutar ou Arremessar"
            }
        ]
    },
    {
        name: "Garimpeiro",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Ciência (Geologia)", "Consertos Mecânicos", "Encontrar", "Escalar", "História", "Navegação", "Primeiros Socorros"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Jornalista Investigativo",
        skillPoints: "EDU × 4",
        creditRating: "9–30",
        suggestedSkills: ["História", "Língua Nativa", "Psicologia", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Arte/Ofício (Arte ou Fotografia)"
            },
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            },
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades pessoais ou da era"
            }
        ]
    },
    {
        name: "Repórter",
        skillPoints: "EDU × 4",
        creditRating: "9–30",
        suggestedSkills: ["Arte/Ofício (Atuação)", "Encontrar", "Escutar", "Furtividade", "História", "Língua Nativa", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            }
        ]
    },
    {
        name: "Juiz",
        skillPoints: "EDU × 4",
        creditRating: "60–90",
        suggestedSkills: ["Direito", "Escutar", "História", "Intimidação", "Língua Nativa", "Persuasão", "Psicologia", "Usar Bibliotecas"]
    },
    {
        name: "Jurista",
        skillPoints: "EDU × 4",
        creditRating: "30–80",
        suggestedSkills: ["Contabilidade", "Direito", "Psicologia", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Duas perícias interpessoais"
            },
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias"
            }
        ]
    },
    {
        name: "Líder de Culto",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "30–60",
        suggestedSkills: ["Contabilidade", "Encontrar", "Ocultismo", "Psicologia"],
        skillChoices: [
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Duas perícias interpessoais"
            },
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades"
            }
        ]
    },
    {
        name: "Livreiro",
        skillPoints: "EDU × 4",
        creditRating: "20–40",
        suggestedSkills: ["Avaliação", "Contabilidade", "Dirigir Automóveis", "História", "Língua Nativa", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            },
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            }
        ]
    },
    {
        name: "Lojista",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "20–40",
        suggestedSkills: ["Consertos Elétricos", "Consertos Mecânicos", "Contabilidade", "Encontrar", "Escutar", "Psicologia"],
        skillChoices: [
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Duas perícias interpessoais"
            }
        ]
    },
    {
        name: "Marinheiro Naval",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Armas de Fogo", "Lutar", "Natação", "Navegação", "Pilotar (Barcos)", "Primeiros Socorros", "Sobrevivência (Mar)"],
        skillChoices: [
            {
                count: 1,
                options: ["Consertos Elétricos", "Consertos Mecânicos"],
                description: "Consertos Elétricos ou Consertos Mecânicos"
            }
        ]
    },
    {
        name: "Marinheiro Mercante",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Consertos Mecânicos", "Encontrar", "Mundo Natural", "Natação", "Navegação", "Primeiros Socorros", "Pilotar (Barcos)"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            }
        ]
    },
    {
        name: "Mecânico",
        skillPoints: "EDU × 4",
        creditRating: "20–40",
        suggestedSkills: ["Consertos Elétricos", "Consertos Mecânicos", "Dirigir Automóveis", "Escalar", "Operar Maquinário Pesado"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Arte/Ofício (ex.: Carpintaria, Encanamento, Soldagem, etc.)"
            },
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades pessoais, da era ou do ofício"
            }
        ]
    },
    {
        name: "Médico",
        skillPoints: "EDU × 4",
        creditRating: "30–80",
        suggestedSkills: ["Ciência (Biologia)", "Ciência (Farmácia)", "Medicina", "Primeiros Socorros", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Outra Língua (Latim)"
            },
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades acadêmicas ou pessoais"
            }
        ],
        era: "classic"
    },
    {
        name: "Mergulhador",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Ciência (Biologia)", "Consertos Mecânicos", "Encontrar", "Mergulho", "Natação", "Pilotar (Barcos)", "Primeiros Socorros"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Missionário",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "0–30",
        suggestedSkills: ["Consertos Mecânicos", "Medicina", "Mundo Natural", "Primeiros Socorros"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Arte/Ofício (qualquer)"
            },
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            },
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades pessoais ou da era"
            }
        ]
    },
    {
        name: "Mordomo",
        skillPoints: "EDU × 4",
        creditRating: "30–60",
        suggestedSkills: ["Encontrar", "Escutar", "Primeiros Socorros", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Arte/Ofício (qualquer — ex.: Alfaiataria, Barbearia, Culinária)"
            },
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            },
            {
                count: 1,
                options: ["Avaliação", "Contabilidade"],
                description: "Avaliação ou Contabilidade"
            },
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades pessoais ou da era"
            }
        ]
    },
    {
        name: "Chofer",
        skillPoints: "EDU × 2 + DES × 2",
        creditRating: "10–40",
        suggestedSkills: ["Consertos Mecânicos", "Dirigir Automóveis", "Encontrar", "Escutar", "Navegação"],
        skillChoices: [
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Duas perícias interpessoais"
            },
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Motorista",
        skillPoints: "EDU × 2 + DES × 2",
        creditRating: "9–20",
        suggestedSkills: ["Consertos Mecânicos", "Contabilidade", "Dirigir Automóveis", "Escutar", "Navegação", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            },
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Taxista",
        skillPoints: "EDU × 2 + DES × 2",
        creditRating: "9–30",
        suggestedSkills: ["Consertos Elétricos", "Consertos Mecânicos", "Contabilidade", "Dirigir Automóveis", "Encontrar", "Lábia", "Navegação"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Músico",
        skillPoints: "EDU × 2 + (APA × 2 ou DES × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Escutar", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Arte/Ofício (Instrumento)"
            },
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            },
            {
                count: 4,
                options: [],
                description: "Quaisquer quatro outras perícias"
            }
        ]
    },
    {
        name: "Negociador de Antiguidades",
        skillPoints: "EDU × 4",
        creditRating: "30–50",
        suggestedSkills: ["Avaliação", "Contabilidade", "Dirigir Automóveis", "História", "Navegação", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Duas perícias interpessoais"
            }
        ]
    },
    {
        name: "Ocultista",
        skillPoints: "EDU × 4",
        creditRating: "9–65",
        suggestedSkills: ["Antropologia", "Ciência (Astronomia)", "História", "Ocultismo", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            },
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            },
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Oficial Militar",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "20–70",
        suggestedSkills: ["Armas de Fogo", "Contabilidade", "Navegação", "Primeiros Socorros", "Psicologia"],
        skillChoices: [
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Duas perícias interpessoais"
            },
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Oficial de Polícia",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "20–50",
        suggestedSkills: ["Armas de Fogo", "Direito", "Encontrar", "Escutar", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            },
            {
                count: 1,
                options: ["Arte/Ofício (Atuação)", "Disfarce"],
                description: "Arte/Ofício (Atuação) ou Disfarce"
            },
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Oficial Uniformizado",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Armas de Fogo", "Direito", "Encontrar", "Lutar (Briga)", "Primeiros Socorros", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            },
            {
                count: 1,
                options: ["Cavalgar", "Dirigir Automóveis"],
                description: "Cavalgar ou Dirigir Automóveis (especialidade pessoal)"
            }
        ]
    },
    {
        name: "Operário Não Qualificado",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "5–10",
        suggestedSkills: ["Arremessar", "Consertos Elétricos", "Consertos Mecânicos", "Dirigir Automóveis", "Lutar", "Operar Maquinário Pesado", "Primeiros Socorros"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Lenhador",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–20",
        suggestedSkills: ["Arremessar", "Consertos Mecânicos", "Escalar", "Esquivar", "Lutar (Motosserra)", "Primeiros Socorros", "Saltar"],
        skillChoices: [
            {
                count: 1,
                options: ["Ciência (Biologia)", "Ciência (Botânica)", "Mundo Natural"],
                description: "Ciência (Biologia ou Botânica) ou Mundo Natural"
            }
        ]
    },
    {
        name: "Mineiro",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Consertos Mecânicos", "Encontrar", "Escalar", "Furtividade", "Geologia", "Operar Maquinário Pesado", "Saltar"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Parapsicólogo",
        skillPoints: "EDU × 4",
        creditRating: "9–30",
        suggestedSkills: ["Antropologia", "Arte/Ofício (Fotografia)", "História", "Ocultismo", "Psicologia", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            },
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Pesquisador",
        skillPoints: "EDU × 4",
        creditRating: "9–40",
        suggestedSkills: ["Encontrar", "História", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            },
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            },
            {
                count: 3,
                options: [],
                description: "Quaisquer três campos de estudo (perícias adicionais de acordo com a área de pesquisa)"
            }
        ]
    },
    {
        name: "Piloto",
        skillPoints: "EDU × 2 + DES × 2",
        creditRating: "20–70",
        suggestedSkills: ["Ciência (Astronomia)", "Consertos Elétricos", "Consertos Mecânicos", "Navegação", "Operar Maquinário Pesado", "Pilotar (Aeronaves)"],
        skillChoices: [
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades pessoais ou da era"
            }
        ]
    },
    {
        name: "Aviador",
        skillPoints: "EDU × 2 + DES × 2",
        creditRating: "30–60",
        suggestedSkills: ["Consertos Elétricos", "Consertos Mecânicos", "Contabilidade", "Encontrar", "Escutar", "Navegação", "Pilotar (Aeronaves)"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Político Eleito",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "50–90",
        suggestedSkills: ["Charme", "Escutar", "História", "Intimidação", "Lábia", "Língua Nativa", "Persuasão", "Psicologia"]
    },
    {
        name: "Professor",
        skillPoints: "EDU × 4",
        creditRating: "20–70",
        suggestedSkills: ["Língua Nativa", "Psicologia", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            },
            {
                count: 4,
                options: [],
                description: "Quaisquer quatro outras perícias como especialidades pessoais, acadêmicas ou da era"
            }
        ],
        era: "classic"
    },
    {
        name: "Programador",
        skillPoints: "EDU × 4",
        creditRating: "10–65",
        suggestedSkills: ["Ciência (Matemática)", "Consertos Elétricos", "Eletrônica", "Encontrar", "Usar Bibliotecas", "Usar Computadores"],
        skillChoices: [
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades pessoais ou da era"
            }
        ],
        era: "modern"
    },
    {
        name: "Hacker",
        skillPoints: "EDU × 4",
        creditRating: "10–70",
        suggestedSkills: ["Consertos Elétricos", "Eletrônica", "Encontrar", "Usar Bibliotecas", "Usar Computadores"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            },
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias"
            }
        ],
        era: "modern"
    },
    {
        name: "Prostituta",
        skillPoints: "EDU × 2 + APA × 2",
        creditRating: "5–50",
        suggestedSkills: ["Esquivar", "Furtividade", "Prestidigitação", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Arte/Ofício (qualquer)"
            },
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Duas perícias interpessoais"
            },
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Psicólogo",
        skillPoints: "EDU × 4",
        creditRating: "10–60",
        suggestedSkills: ["Contabilidade", "Escutar", "Persuasão", "Psicanálise", "Psicologia", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades pessoais ou acadêmicas"
            }
        ]
    },
    {
        name: "Psiquiatra",
        skillPoints: "EDU × 4",
        creditRating: "30–80",
        suggestedSkills: ["Ciência (Biologia)", "Ciência (Química)", "Escutar", "Medicina", "Persuasão", "Psicanálise", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            }
        ]
    },
    {
        name: "Pugilista",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–60",
        suggestedSkills: ["Encontrar", "Esquivar", "Intimidação", "Lutar (Briga)", "Psicologia", "Saltar"],
        skillChoices: [
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades pessoais ou da era"
            }
        ]
    },
    {
        name: "Secretário",
        skillPoints: "EDU × 4",
        creditRating: "9–30",
        suggestedSkills: ["Contabilidade", "Língua Nativa", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Arte/Ofício (Datilografia ou Taquigrafia)"
            },
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Duas perícias interpessoais"
            },
            {
                count: 1,
                options: ["Usar Bibliotecas", "Usar Computadores"],
                description: "Usar Bibliotecas ou Usar Computadores"
            },
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    },
    {
        name: "Sindicalista",
        skillPoints: "EDU × 2 + (FOR × 2 ou APA × 2)",
        creditRating: "5–30",
        suggestedSkills: ["Contabilidade", "Direito", "Escutar", "Lutar (Briga)", "Operar Maquinário Pesado", "Psicologia"],
        skillChoices: [
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Duas perícias interpessoais"
            }
        ]
    },
    {
        name: "Sobrevivencialista",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "5–30",
        suggestedSkills: ["Armas de Fogo", "Escutar", "Encontrar", "Mundo Natural", "Navegação", "Primeiros Socorros", "Rastrear", "Sobrevivência"]
    },
    {
        name: "Soldado",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Armas de Fogo", "Esquivar", "Furtividade", "Lutar", "Sobrevivência"],
        skillChoices: [
            {
                count: 1,
                options: ["Escalar", "Natação"],
                description: "Escalar ou Natação"
            },
            {
                count: 2,
                options: ["Primeiros Socorros", "Consertos Mecânicos", "Outra Língua"],
                description: "Duas entre: Primeiros Socorros, Consertos Mecânicos, ou Outra Língua"
            }
        ]
    },
    {
        name: "Técnico de Higienização",
        skillPoints: "EDU × 2 + (DES × 2 ou FOR × 2)",
        creditRating: "6–15",
        suggestedSkills: ["Consertos Elétricos", "Consertos Mecânicos", "Escutar", "Furtividade", "Lutar (Briga)", "Primeiros Socorros", "Psicologia"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            }
        ]
    },
    {
        name: "Empregado de Escritório",
        skillPoints: "EDU × 4",
        creditRating: "9–30",
        suggestedSkills: ["Contabilidade", "Direito", "Escutar", "Usar Bibliotecas"],
        skillChoices: [
            {
                count: 1,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Uma perícia interpessoal"
            },
            {
                count: 1,
                options: [],
                description: "Língua (nativa ou outra)"
            },
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades pessoais ou da era"
            }
        ]
    },
    {
        name: "Gerente",
        skillPoints: "EDU × 4",
        creditRating: "40–90",
        suggestedSkills: ["Contabilidade", "Direito", "Psicologia"],
        skillChoices: [
            {
                count: 2,
                options: ["Charme", "Intimidação", "Lábia", "Persuasão"],
                description: "Duas perícias interpessoais"
            },
            {
                count: 1,
                options: [],
                description: "Outra Língua"
            },
            {
                count: 2,
                options: [],
                description: "Quaisquer outras duas perícias como especialidades pessoais ou da era"
            }
        ]
    },
    {
        name: "Tratador de Zoológico",
        skillPoints: "EDU × 4",
        creditRating: "20–40",
        suggestedSkills: ["Ciência (Farmácia)", "Ciência (Zoologia)", "Contabilidade", "Esquivar", "Medicina", "Mundo Natural", "Primeiros Socorros", "Treinar Animais"]
    },
    {
        name: "Treinador de Animais",
        skillPoints: "EDU × 2 + (APA × 2 ou FOR × 2)",
        creditRating: "9–30",
        suggestedSkills: ["Ciência (Zoologia)", "Escutar", "Furtividade", "Mundo Natural", "Rastrear", "Saltar", "Treinar Animais"],
        skillChoices: [
            {
                count: 1,
                options: [],
                description: "Qualquer outra perícia como especialidade pessoal ou da era"
            }
        ]
    }
];

// Função para filtrar ocupações por nome
export function searchOccupations(query: string): Occupation[] {
    if (!query) return occupations;

    const lowerQuery = query.toLowerCase();
    return occupations.filter(occ =>
        occ.name.toLowerCase().includes(lowerQuery)
    );
}

// Função para obter ocupação por nome exato
export function getOccupationByName(name: string): Occupation | undefined {
    return occupations.find(occ => occ.name === name);
}
