export interface EquipmentTemplate {
    name: string;
    category: 'Sobrevivência' | 'Investigação' | 'Médico' | 'Ferramentas' | 'Documentos' | 'Geral';
    description: string;
    defaultQty?: number;
    weightOrBulk?: string;
}

export const equipmentTemplates: EquipmentTemplate[] = [
    // ==========================================
    // 1. SOBREVIVÊNCIA & EXPLORAÇÃO
    // ==========================================
    {
        name: "Lanterna a Querosene de Tempestade",
        category: "Sobrevivência",
        description: "Ilumina um raio de 10m por até 6 horas de queima contínua. Resistente ao vento e chuva.",
        defaultQty: 1,
        weightOrBulk: "1.2 kg"
    },
    {
        name: "Lanterna Dínamo de Bolso",
        category: "Sobrevivência",
        description: "Lanterna mecânica acionada por manivela/pressão de mola. Não usa pilhas nem querosene.",
        defaultQty: 1,
        weightOrBulk: "0.4 kg"
    },
    {
        name: "Cantil Militar de Alumínio (1 Litro)",
        category: "Sobrevivência",
        description: "Cantil com capa de feltro isolante e caneco acoplável para fervura.",
        defaultQty: 1,
        weightOrBulk: "1.1 kg (cheio)"
    },
    {
        name: "Bússola Militar de Pulso Adrianov",
        category: "Sobrevivência",
        description: "Bússola padrão do Exército Vermelho com mostrador fosforescente a rádio para leitura noturna.",
        defaultQty: 1,
        weightOrBulk: "0.1 kg"
    },
    {
        name: "Caixa de Fósforos Impermeáveis",
        category: "Sobrevivência",
        description: "Caixa de metal vedada com cera contendo fósforos que acendem mesmo após umidade.",
        defaultQty: 2,
        weightOrBulk: "0.05 kg"
    },
    {
        name: "Isqueiro de Trincheira de Latão",
        category: "Sobrevivência",
        description: "Isqueiro a fluido feito com cápsula de munição reaproveitada da Guerra Civil.",
        defaultQty: 1,
        weightOrBulk: "0.08 kg"
    },
    {
        name: "Máscara contra Gases GP-4",
        category: "Sobrevivência",
        description: "Máscara de borracha com mangueira corrugada e filtro de carvão ativado contra vapores tóxicos.",
        defaultQty: 1,
        weightOrBulk: "1.5 kg"
    },
    {
        name: "Rações de Campo do Exército (Pão Preto & Conserva)",
        category: "Sobrevivência",
        description: "Pão de centeio seco (Sukhari) e lata de carne bovina cozida (Tushonka) para 3 dias.",
        defaultQty: 3,
        weightOrBulk: "1.8 kg"
    },
    {
        name: "Casaco Acolchoado de Inverno (Telogreika)",
        category: "Sobrevivência",
        description: "Jaqueta de algodão acolchoada tradicional soviética, indispensável contra o frio siberiano.",
        defaultQty: 1,
        weightOrBulk: "2.0 kg"
    },

    // ==========================================
    // 2. INVESTIGAÇÃO & COMUNICAÇÃO
    // ==========================================
    {
        name: "Caderno de Couro com Lápis de Grafite",
        category: "Investigação",
        description: "Caderno pautado resistente para anotações, desenhos de símbolos arcanos e relatórios de campo.",
        defaultQty: 1,
        weightOrBulk: "0.2 kg"
    },
    {
        name: "Câmera Fotográfica Soviética FED-1",
        category: "Investigação",
        description: "Cópia soviética de alta precisão da Leica II. Rolo com 36 poses de 35mm.",
        defaultQty: 1,
        weightOrBulk: "0.6 kg"
    },
    {
        name: "Lupa de Bolso com Cabo de Latão (5x)",
        category: "Investigação",
        description: "Lente óptica para perícia minuciosa de documentos forjados, pistas e resíduos biológicos.",
        defaultQty: 1,
        weightOrBulk: "0.15 kg"
    },
    {
        name: "Binóculo Militar de Campo 6×30",
        category: "Investigação",
        description: "Óptica da fábrica de Tula com retículo de telêmetro milimétrico para vigilância à distância.",
        defaultQty: 1,
        weightOrBulk: "0.7 kg"
    },
    {
        name: "Fita Métrica de Aço (5 Metros)",
        category: "Investigação",
        description: "Instrumento retrátil para medição balística, pegadas ou dimensões de câmaras e altares.",
        defaultQty: 1,
        weightOrBulk: "0.2 kg"
    },
    {
        name: "Tubos de Ensaio de Vidro com Rolha",
        category: "Investigação",
        description: "Kit com 5 tubos protegidos em estojo de madeira para coletar substâncias e fluidos desconhecidos.",
        defaultQty: 5,
        weightOrBulk: "0.3 kg"
    },
    {
        name: "Giz de Cera & Carvão de Decalque",
        category: "Investigação",
        description: "Usado para tirar decalques rápidos de gravuras em pedra, túmulos ou marcar portas em labirintos.",
        defaultQty: 1,
        weightOrBulk: "0.1 kg"
    },

    // ==========================================
    // 3. MÉDICO & PRIMEIROS SOCORROS
    // ==========================================
    {
        name: "Estojo Individual de Primeiros Socorros (AI)",
        category: "Médico",
        description: "Contém 3 rolos de gaze estéril, torniquete de borracha, alfinetes e pó hemostático.",
        defaultQty: 1,
        weightOrBulk: "0.5 kg"
    },
    {
        name: "Frasco de Tintura de Iodo (100ml)",
        category: "Médico",
        description: "Antisséptico forte para cauterizar feridas abertas e mordidas infectadas.",
        defaultQty: 1,
        weightOrBulk: "0.2 kg"
    },
    {
        name: "Frasco de Álcool Médico 96% (250ml)",
        category: "Médico",
        description: "Usado para desinfecção cirúrgica rápida, limpeza de instrumentos ou como combustível emergencial.",
        defaultQty: 1,
        weightOrBulk: "0.3 kg"
    },
    {
        name: "Ampolas de Morfina com Seringa de Vidro",
        category: "Médico",
        description: "3 ampolas analgésicas de emergência para estancar a dor de ferimentos graves ou traumas.",
        defaultQty: 3,
        weightOrBulk: "0.15 kg"
    },
    {
        name: "Comprimidos de Carvão Ativado",
        category: "Médico",
        description: "Tratamento de emergência para intoxicações estomacais, venenos ingeridos e diarreia.",
        defaultQty: 10,
        weightOrBulk: "0.05 kg"
    },

    // ==========================================
    // 4. FERRAMENTAS & INFILTRAÇÃO
    // ==========================================
    {
        name: "Conjunto de Gazuas e Tensionadores",
        category: "Ferramentas",
        description: "Pás de aço temperado para arrombar fechaduras de cilindro e cadeados civis sem ruído.",
        defaultQty: 1,
        weightOrBulk: "0.1 kg"
    },
    {
        name: "Pé de Cabra de Aço Forjado (45cm)",
        category: "Ferramentas",
        description: "Ferramenta pesada para forçar portas trancadas, caixas de munição e tábuas emperradas.",
        defaultQty: 1,
        weightOrBulk: "1.6 kg"
    },
    {
        name: "Corda de Cânhamo Forte (15m) com Gancho",
        category: "Ferramentas",
        description: "Corda náutica de 12mm de espessura com gancho de ferro dobrável para escaladas e resgates.",
        defaultQty: 1,
        weightOrBulk: "2.5 kg"
    },
    {
        name: "Alicate Corta-Arame de Sapador",
        category: "Ferramentas",
        description: "Corta cercas de arame farpado e cabos de telégrafo com facilidade.",
        defaultQty: 1,
        weightOrBulk: "0.8 kg"
    },
    {
        name: "Fita Isolante de Pano Emborrachada",
        category: "Ferramentas",
        description: "Rolo de fita resistente para consertos elétricos de emergência, amordaçar prisioneiros ou vedar frestas.",
        defaultQty: 1,
        weightOrBulk: "0.2 kg"
    },

    // ==========================================
    // 5. DOCUMENTOS & IDENTIFICAÇÃO
    // ==========================================
    {
        name: "Passaporte Interno Soviético & Propiska",
        category: "Documentos",
        description: "Documento oficial de cidadania com carimbos de registro de moradia e local de trabalho.",
        defaultQty: 1,
        weightOrBulk: "0.05 kg"
    },
    {
        name: "Credencial Oficial / Passe de Livre Trânsito",
        category: "Documentos",
        description: "Autorização assinada por comissariado regional para circulação noturna ou zonas restritas.",
        defaultQty: 1,
        weightOrBulk: "0.05 kg"
    },
    {
        name: "Mapa Topográfico Militar da Região",
        category: "Documentos",
        description: "Carta cartográfica confidencial detalhando estradas, estações ferroviárias, rios e aldeias.",
        defaultQty: 1,
        weightOrBulk: "0.1 kg"
    },
    {
        name: "Carteira de Sindicato / Partido (PCUS / Komsomol)",
        category: "Documentos",
        description: "Livreto vermelho de afiliação política que abre portas com burocratas e oficiais leais.",
        defaultQty: 1,
        weightOrBulk: "0.05 kg"
    }
];
