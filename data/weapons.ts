export interface WeaponDefinition {
    name: string;
    skill: string;
    damage: string;
    range: string;
    attacks: string;
    ammo: string;
    malfunction: string;
    category: string;
    cost?: string;
    era?: string;
    image?: string;
}

export const weaponDefinitions: WeaponDefinition[] = [
    // ==========================================
    // 1. CORPO A CORPO (Armas Brancas & Contundentes)
    // ==========================================
    { 
        name: "Sabre Shashka Cossaco (M1881/1927)", 
        skill: "Lutar (Espadas)", 
        damage: "1d8 + 1 + {db}", 
        range: "Toque", 
        attacks: "1", 
        ammo: "-", 
        malfunction: "-", 
        category: "Corpo a Corpo", 
        era: "Cavalaria Vermelha / Cossaca" 
    },
    { 
        name: "Faca de Combate NR-40", 
        skill: "Lutar (Briga)", 
        damage: "1d4 + 2 + {db}", 
        range: "Toque", 
        attacks: "1", 
        ammo: "-", 
        malfunction: "-", 
        category: "Corpo a Corpo", 
        era: "Soviética (1940)" 
    },
    { 
        name: "Pá de Trincheira Afiada (MPL-50)", 
        skill: "Lutar (Briga)", 
        damage: "1d6 + 1 + {db}", 
        range: "Toque", 
        attacks: "1", 
        ammo: "-", 
        malfunction: "-", 
        category: "Corpo a Corpo", 
        era: "Infantaria do Exército Vermelho" 
    },
    { 
        name: "Adaga Kindjal Caucasiana", 
        skill: "Lutar (Briga)", 
        damage: "1d6 + {db}", 
        range: "Toque", 
        attacks: "1", 
        ammo: "-", 
        malfunction: "-", 
        category: "Corpo a Corpo", 
        era: "Tradição Russa / Cáucaso" 
    },
    { 
        name: "Soco Inglês de Ferro", 
        skill: "Lutar (Briga)", 
        damage: "1d3 + 1 + {db}", 
        range: "Toque", 
        attacks: "1", 
        ammo: "-", 
        malfunction: "-", 
        category: "Corpo a Corpo", 
        era: "Submundo / Cheka (Anos 20)" 
    },
    { 
        name: "Cassetete da Militsiya", 
        skill: "Lutar (Briga)", 
        damage: "1d6 + {db}", 
        range: "Toque", 
        attacks: "1", 
        ammo: "-", 
        malfunction: "-", 
        category: "Corpo a Corpo", 
        era: "Polícia Soviética" 
    },

    // ==========================================
    // 2. ARREMESSO & EXPLOSIVOS
    // ==========================================
    { 
        name: "Granada RGD-33 (Fragmentação)", 
        skill: "Arremessar", 
        damage: "4d10 (3m)", 
        range: "FOR/5 m", 
        attacks: "1/2", 
        ammo: "Uso Único", 
        malfunction: "99", 
        category: "Arremesso", 
        era: "Soviética (1933)" 
    },
    { 
        name: "Granada F-1 'Limonka'", 
        skill: "Arremessar", 
        damage: "4d10 (3m)", 
        range: "FOR/5 m", 
        attacks: "1/2", 
        ammo: "Uso Único", 
        malfunction: "99", 
        category: "Arremesso", 
        era: "Defensiva (1939)" 
    },
    { 
        name: "Coquetel Molotov", 
        skill: "Arremessar", 
        damage: "2d6 + queimar", 
        range: "FOR/5 m", 
        attacks: "1/2", 
        ammo: "Uso Único", 
        malfunction: "95", 
        category: "Arremesso", 
        era: "Garrafa Incendiária" 
    },
    { 
        name: "Granada Antitanque RPG-40", 
        skill: "Arremessar", 
        damage: "5d10 (2m)", 
        range: "FOR/5 m", 
        attacks: "1/2", 
        ammo: "Uso Único", 
        malfunction: "99", 
        category: "Arremesso", 
        era: "Alto Explosivo (1940)" 
    },

    // ==========================================
    // 3. PISTOLAS & REVÓLVERES
    // ==========================================
    { 
        name: "Revólver Nagant M1895 (7.62mm)", 
        skill: "Armas de Fogo (Pistolas)", 
        damage: "1d8", 
        range: "15m", 
        attacks: "1 (3)", 
        ammo: "7", 
        malfunction: "100", 
        category: "Pistolas", 
        era: "Padrão Soviético (1895-1945)", 
        image: "/weapons/nagant-m1895.jpg" 
    },
    { 
        name: "Pistola TT-33 Tokarev (7.62mm)", 
        skill: "Armas de Fogo (Pistolas)", 
        damage: "1d8", 
        range: "15m", 
        attacks: "1 (3)", 
        ammo: "8", 
        malfunction: "99", 
        category: "Pistolas", 
        era: "Soviética (1933)", 
        image: "/weapons/tt-33.jpg" 
    },
    { 
        name: "Mauser C96 'Bolo' (7.63mm)", 
        skill: "Armas de Fogo (Pistolas)", 
        damage: "1d8", 
        range: "20m", 
        attacks: "1 (3)", 
        ammo: "10", 
        malfunction: "99", 
        category: "Pistolas", 
        era: "Bolchevique (Anos 20)" 
    },
    { 
        name: "Pistola Korovin TK (6.35mm)", 
        skill: "Armas de Fogo (Pistolas)", 
        damage: "1d6", 
        range: "10m", 
        attacks: "1 (3)", 
        ammo: "8", 
        malfunction: "99", 
        category: "Pistolas", 
        era: "Oficiais & NKVD (1926)" 
    },
    { 
        name: "Pistola Sinalizadora SPSh (26mm)", 
        skill: "Armas de Fogo (Pistolas)", 
        damage: "1d10 + 1d3 queim.", 
        range: "10m", 
        attacks: "1/2", 
        ammo: "1", 
        malfunction: "100", 
        category: "Pistolas", 
        era: "Sinalizador de Campo" 
    },

    // ==========================================
    // 4. RIFLES, FUZIS & CARABINAS
    // ==========================================
    { 
        name: "Fuzil Mosin-Nagant M1891/30 (7.62mm)", 
        skill: "Armas de Fogo (Rifles/Espingardas)", 
        damage: "2d6 + 4", 
        range: "110m", 
        attacks: "1", 
        ammo: "5", 
        malfunction: "100", 
        category: "Rifles/Arcos", 
        era: "Fuzil Padrão (1930)", 
        image: "/weapons/mosin-m91-30.jpg" 
    },
    { 
        name: "Carabina Mosin-Nagant M1938", 
        skill: "Armas de Fogo (Rifles/Espingardas)", 
        damage: "2d6 + 3", 
        range: "90m", 
        attacks: "1", 
        ammo: "5", 
        malfunction: "100", 
        category: "Rifles/Arcos", 
        era: "Cavalaria & Engenharia (1938)" 
    },
    { 
        name: "Fuzil Semi-Auto SVT-40 Tokarev", 
        skill: "Armas de Fogo (Rifles/Espingardas)", 
        damage: "2d6 + 4", 
        range: "110m", 
        attacks: "1 (2)", 
        ammo: "10", 
        malfunction: "98", 
        category: "Rifles/Arcos", 
        era: "Soviética (1940)" 
    },
    { 
        name: "Fedorov Avtomat (6.5mm)", 
        skill: "Armas de Fogo (Rifles/Espingardas)", 
        damage: "2d6", 
        range: "90m", 
        attacks: "1 (2) ou Auto", 
        ammo: "25", 
        malfunction: "96", 
        category: "Rifles/Arcos", 
        era: "Pioneiro Automático (1916)" 
    },
    { 
        name: "Carabina Winchester M1895 Russa", 
        skill: "Armas de Fogo (Rifles/Espingardas)", 
        damage: "2d6 + 2", 
        range: "70m", 
        attacks: "1", 
        ammo: "5", 
        malfunction: "98", 
        category: "Rifles/Arcos", 
        era: "Contrato Imperial (Alavanca)" 
    },

    // ==========================================
    // 5. ESPINGARDAS (Shotguns & Caça)
    // ==========================================
    { 
        name: "Espingarda Tula TOZ-B (Canos Duplos)", 
        skill: "Armas de Fogo (Rifles/Espingardas)", 
        damage: "4d6 / 2d6 / 1d6", 
        range: "10/20/50m", 
        attacks: "1 ou 2", 
        ammo: "2", 
        malfunction: "100", 
        category: "Espingardas", 
        era: "Caça Civil Tula (Dois Canos)" 
    },
    { 
        name: "Escopeta Serrada 'Obrez' (Mosin-Nagant)", 
        skill: "Armas de Fogo (Rifles/Espingardas)", 
        damage: "2d6 + 2 / 1d6", 
        range: "5/10m", 
        attacks: "1", 
        ammo: "5", 
        malfunction: "95", 
        category: "Espingardas", 
        era: "Partisans / Ocultável" 
    },
    { 
        name: "Espingarda Frolovka (Ferrolho Civil)", 
        skill: "Armas de Fogo (Rifles/Espingardas)", 
        damage: "2d6 / 1d6 / 1d3", 
        range: "10/20/50m", 
        attacks: "1", 
        ammo: "2", 
        malfunction: "98", 
        category: "Espingardas", 
        era: "Conversão Civil (Anos 20)" 
    },

    // ==========================================
    // 6. SUBMETRALHADORAS (SMGs)
    // ==========================================
    { 
        name: "Submetralhadora PPSh-41 'Papasha'", 
        skill: "Armas de Fogo (Submetralhadoras)", 
        damage: "1d10", 
        range: "25m", 
        attacks: "1 ou Auto", 
        ammo: "71", 
        malfunction: "96", 
        category: "Automáticas", 
        era: "Tambor 71 Tiros (1941)", 
        image: "/weapons/ppsh-41.jpg" 
    },
    { 
        name: "Submetralhadora PPS-43 (Sudaev)", 
        skill: "Armas de Fogo (Submetralhadoras)", 
        damage: "1d10", 
        range: "25m", 
        attacks: "1 (2) ou Auto", 
        ammo: "35", 
        malfunction: "98", 
        category: "Automáticas", 
        era: "Leningrado Estampada (1943)" 
    },
    { 
        name: "Submetralhadora PPD-40 (Degtyaryov)", 
        skill: "Armas de Fogo (Submetralhadoras)", 
        damage: "1d10", 
        range: "25m", 
        attacks: "1 (2) ou Auto", 
        ammo: "71", 
        malfunction: "96", 
        category: "Automáticas", 
        era: "Pré-Guerra Usinada (1940)" 
    },
    { 
        name: "Submetralhadora Thompson (Lend-Lease)", 
        skill: "Armas de Fogo (Submetralhadoras)", 
        damage: "1d10 + 2", 
        range: "20m", 
        attacks: "1 ou Auto", 
        ammo: "30", 
        malfunction: "96", 
        category: "Automáticas", 
        era: "Fornecimento Aliado Lend-Lease" 
    },

    // ==========================================
    // 7. METRALHADORAS & ARMAS PESADAS
    // ==========================================
    { 
        name: "Metralhadora Leve DP-27 Degtyaryov", 
        skill: "Armas de Fogo (Metralhadoras)", 
        damage: "2d6 + 4", 
        range: "90m", 
        attacks: "1 (2) ou Auto", 
        ammo: "47", 
        malfunction: "98", 
        category: "Pesadas", 
        era: "Prato Giratório (1927)" 
    },
    { 
        name: "Metralhadora Pesada Maxim M1910", 
        skill: "Armas de Fogo (Metralhadoras)", 
        damage: "2d6 + 4", 
        range: "150m", 
        attacks: "Auto", 
        ammo: "250", 
        malfunction: "96", 
        category: "Pesadas", 
        era: "Rodas Sokolov & Escudo" 
    },
    { 
        name: "Fuzil Antitanque PTRD-41 (14.5mm)", 
        skill: "Armas de Fogo (Rifles/Espingardas)", 
        damage: "3d10 + 6", 
        range: "200m", 
        attacks: "1/2", 
        ammo: "1", 
        malfunction: "98", 
        category: "Pesadas", 
        era: "Degtyaryov Antiblindagem" 
    },
    { 
        name: "Lança-Chamas ROKS-2", 
        skill: "Armas de Fogo (Lança-Chamas)", 
        damage: "2d6 + queimar", 
        range: "25m", 
        attacks: "1", 
        ammo: "10", 
        malfunction: "94", 
        category: "Pesadas", 
        era: "Disfarçado de Fuzil (1940)" 
    }
];
