// Lista completa de perícias do Call of Cthulhu 7ª Edição em Português

export interface SkillDefinition {
    name: string;
    baseValue: number | string; // Pode ser número ou fórmula como "metade da DES"
    category: string;
    requiresSpecialization?: boolean;
    uncommon?: boolean;
    modern?: boolean;
}

export const skillCategories = [
    "Combate",
    "Interpessoal",
    "Investigação",
    "Manipulação",
    "Conhecimento",
    "Físicas",
    "Técnicas",
    "Mythos"
];

export const skills: SkillDefinition[] = [
    // Combate
    { name: "Arremessar", baseValue: 20, category: "Combate" },
    { name: "Armas de Fogo (Pistolas)", baseValue: 20, category: "Combate" },
    { name: "Armas de Fogo (Rifles/Espingardas)", baseValue: 25, category: "Combate" },
    { name: "Armas de Fogo (Submetralhadoras)", baseValue: 15, category: "Combate" },
    { name: "Armas de Fogo (Metralhadoras)", baseValue: 10, category: "Combate" },
    { name: "Armas de Fogo (Lança-Chamas)", baseValue: 10, category: "Combate" },
    { name: "Artilharia", baseValue: 1, category: "Combate", uncommon: true },
    { name: "Esquivar", baseValue: "metade da DES", category: "Combate" },
    { name: "Lutar (Briga)", baseValue: 25, category: "Combate" },
    { name: "Lutar (Chicotes)", baseValue: 5, category: "Combate" },
    { name: "Lutar (Espadas)", baseValue: 20, category: "Combate" },
    { name: "Lutar (Garrote)", baseValue: 15, category: "Combate" },
    { name: "Lutar (Lanças)", baseValue: 20, category: "Combate" },
    { name: "Lutar (Machados)", baseValue: 15, category: "Combate" },
    { name: "Lutar (Manguais)", baseValue: 10, category: "Combate" },
    { name: "Lutar (Motosserras)", baseValue: 10, category: "Combate" },

    // Interpessoal
    { name: "Charme", baseValue: 15, category: "Interpessoal" },
    { name: "Intimidação", baseValue: 15, category: "Interpessoal" },
    { name: "Lábia", baseValue: 5, category: "Interpessoal" },
    { name: "Persuasão", baseValue: 10, category: "Interpessoal" },
    { name: "Língua (Nativa)", baseValue: "EDU", category: "Interpessoal" },
    { name: "Língua (Outra)", baseValue: 1, category: "Interpessoal", requiresSpecialization: true },

    // Investigação
    { name: "Encontrar", baseValue: 25, category: "Investigação" },
    { name: "Escutar", baseValue: 20, category: "Investigação" },
    { name: "Rastrear", baseValue: 10, category: "Investigação" },
    { name: "Usar Bibliotecas", baseValue: 20, category: "Investigação" },
    { name: "Avaliação", baseValue: 5, category: "Investigação" },

    // Manipulação
    { name: "Chaveiro", baseValue: 1, category: "Manipulação" },
    { name: "Consertos Elétricos", baseValue: 10, category: "Manipulação" },
    { name: "Consertos Mecânicos", baseValue: 10, category: "Manipulação" },
    { name: "Demolições", baseValue: 1, category: "Manipulação", uncommon: true },
    { name: "Disfarce", baseValue: 5, category: "Manipulação" },
    { name: "Eletrônica", baseValue: 1, category: "Manipulação", modern: true },
    { name: "Falsificação", baseValue: 5, category: "Manipulação" },
    { name: "Fotografia", baseValue: 5, category: "Manipulação" },
    { name: "Operar Maquinário Pesado", baseValue: 1, category: "Manipulação" },
    { name: "Prestidigitação", baseValue: 10, category: "Manipulação" },
    { name: "Usar Computadores", baseValue: 5, category: "Manipulação", modern: true },

    // Conhecimento
    { name: "Contabilidade", baseValue: 5, category: "Conhecimento" },
    { name: "Direito", baseValue: 5, category: "Conhecimento" },
    { name: "História", baseValue: 5, category: "Conhecimento" },
    { name: "Medicina", baseValue: 1, category: "Conhecimento" },
    { name: "Mundo Natural", baseValue: 10, category: "Conhecimento" },
    { name: "Ocultismo", baseValue: 5, category: "Conhecimento" },
    { name: "Psicanálise", baseValue: 1, category: "Conhecimento" },
    { name: "Psicologia", baseValue: 10, category: "Conhecimento" },
    { name: "Primeiros Socorros", baseValue: 30, category: "Conhecimento" },
    { name: "Ciência (Astronomia)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Biologia)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Botânica)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Ciência Forense)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Criptografia)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Engenharia)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Farmácia)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Física)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Geologia)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Matemática)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Meteorologia)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Química)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Ciência (Zoologia)", baseValue: 1, category: "Conhecimento", requiresSpecialization: true },
    { name: "Conhecimento", baseValue: 1, category: "Conhecimento", requiresSpecialization: true, uncommon: true },
    { name: "Arte e Ofício", baseValue: 5, category: "Conhecimento", requiresSpecialization: true },

    // Físicas
    { name: "Cavalgar", baseValue: 5, category: "Físicas" },
    { name: "Dirigir Automóveis", baseValue: 20, category: "Físicas" },
    { name: "Escalar", baseValue: 20, category: "Físicas" },
    { name: "Furtividade", baseValue: 20, category: "Físicas" },
    { name: "Mergulho", baseValue: 1, category: "Físicas" },
    { name: "Natação", baseValue: 20, category: "Físicas" },
    { name: "Navegação", baseValue: 10, category: "Físicas" },
    { name: "Pilotar", baseValue: 1, category: "Físicas", requiresSpecialization: true },
    { name: "Saltar", baseValue: 20, category: "Físicas" },
    { name: "Sobrevivência", baseValue: 10, category: "Físicas", requiresSpecialization: true },

    // Técnicas
    { name: "Hipnose", baseValue: 1, category: "Técnicas", uncommon: true },
    { name: "Leitura Labial", baseValue: 1, category: "Técnicas", uncommon: true },
    { name: "Treinar Animais", baseValue: 5, category: "Técnicas", uncommon: true },

    // Especiais
    { name: "Nível de Crédito", baseValue: 0, category: "Especiais" },
    { name: "Mythos de Cthulhu", baseValue: 0, category: "Mythos" },
];

// Função auxiliar para obter o valor base de uma perícia
export function getSkillBaseValue(skillName: string, characteristics?: any): number {
    const skill = skills.find(s => s.name === skillName);
    if (!skill) return 0;

    if (typeof skill.baseValue === 'number') {
        return skill.baseValue;
    }

    // Tratamento de fórmulas especiais
    if (skill.baseValue === "metade da DES" && characteristics) {
        return Math.floor(characteristics.DEX / 2);
    }

    if (skill.baseValue === "EDU" && characteristics) {
        return characteristics.EDU;
    }

    return 0;
}
