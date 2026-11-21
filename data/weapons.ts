export interface WeaponDefinition {
    name: string;
    skill: string;
    damage: string;
    range: string;
    attacks: string; // string to handle "1 (3)" or "1/2"
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
    { name: "Desarmado (Punhos / Chutes)", skill: "Lutar (Briga)", damage: "1d3 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Universal" },
    { name: "Soco Inglês / Soqueira de Ferro", skill: "Lutar (Briga)", damage: "1d3 + 1 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Soviética (Anos 20)" },
    { name: "Sabre Shashka Cossaco (Шашка M1881/1927)", skill: "Lutar (Espadas)", damage: "1d8 + 1 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Soviética (Cavalaria)" },
    { name: "Pá de Trincheira Afiada (MPL-50)", skill: "Lutar (Briga)", damage: "1d6 + 1 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Soviética (Infantaria)" },
    { name: "Faca de Combate / Batedor (NR-40)", skill: "Lutar (Briga)", damage: "1d4 + 2 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Soviética (1940)" },
    { name: "Adaga Kindjal Caucasiana (Кинжал)", skill: "Lutar (Briga)", damage: "1d6 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Russa / Cossaca" },
    { name: "Baioneta Mosin-Nagant (Estocada)", skill: "Lutar (Lanças)", damage: "1d6 + 1 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Soviética (1891/1930)" },
    { name: "Machado de Lenhador Soviético", skill: "Lutar (Machados)", damage: "1d8 + 2 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Civil / Pioneiros" },
    { name: "Machadinha de Sapador", skill: "Lutar (Machados)", damage: "1d6 + 1 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Militar" },
    { name: "Cassetete da Militsiya / Porrete", skill: "Lutar (Briga)", damage: "1d6 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Polícia / Cheka" },
    { name: "Garrote de Arame da Cheka / OGPU", skill: "Lutar (Garrote)", damage: "1d6 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Serviço Secreto" },
    { name: "Chicote Nagaika Cossaco (Нагайка)", skill: "Lutar (Chicotes)", damage: "1d3 + {db}/2", range: "3m", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Cavalaria Cossaca" },
    { name: "Canivete de Bolso Soviético", skill: "Lutar (Briga)", damage: "1d4 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Civil" },
    { name: "Tocha Acesa / Facho", skill: "Lutar (Briga)", damage: "1d6 + queimar", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo", era: "Rústica" },

    // ==========================================
    // 2. ARREMESSO & EXPLOSIVOS
    // ==========================================
    { name: "Granada RGD-33 (Fragmentação)", skill: "Arremessar", damage: "4d10 (3m)", range: "FOR/5 m", attacks: "1/2", ammo: "Uso Único", malfunction: "99", category: "Arremesso", era: "Soviética (1933)" },
    { name: "Granada F-1 'Limonka' (Defensiva)", skill: "Arremessar", damage: "4d10 (3m)", range: "FOR/5 m", attacks: "1/2", ammo: "Uso Único", malfunction: "99", category: "Arremesso", era: "Soviética (1939)" },
    { name: "Granada M1914/30 (Novitsky)", skill: "Arremessar", damage: "4d10 (3m)", range: "FOR/5 m", attacks: "1/2", ammo: "Uso Único", malfunction: "99", category: "Arremesso", era: "Russa / Soviética" },
    { name: "Granada Antitanque RPG-40", skill: "Arremessar", damage: "5d10 (2m)", range: "FOR/5 m", attacks: "1/2", ammo: "Uso Único", malfunction: "99", category: "Arremesso", era: "Soviética (1940)" },
    { name: "Coquetel Molotov (Garrafa Incendiária)", skill: "Arremessar", damage: "2d6 + queimar", range: "FOR/5 m", attacks: "1/2", ammo: "Uso Único", malfunction: "95", category: "Arremesso", era: "Guerra de Inverno" },
    { name: "Carga Concentrada de TNT (200g)", skill: "Arremessar", damage: "4d10 (3m)", range: "FOR/5 m", attacks: "1/2", ammo: "Uso Único", malfunction: "99", category: "Arremesso", era: "Soviética (Militar)" },
    { name: "Faca Arremessada", skill: "Arremessar", damage: "1d4 + {db}/2", range: "FOR/5 m", attacks: "1", ammo: "Uso Único", malfunction: "-", category: "Arremesso", era: "Universal" },

    // ==========================================
    // 3. PISTOLAS & REVÓLVERES
    // ==========================================
    { name: "Revólver Nagant M1895 (7.62mm)", skill: "Armas de Fogo (Pistolas)", damage: "1d8", range: "15m", attacks: "1 (3)", ammo: "7", malfunction: "100", category: "Pistolas", era: "Soviética (Padrão 1895-1945)", image: "/weapons/nagant-m1895.jpg" },
    { name: "Revólver Nagant M1895 Silenciado (Bramit)", skill: "Armas de Fogo (Pistolas)", damage: "1d8 - 1", range: "10m", attacks: "1 (3)", ammo: "7", malfunction: "98", category: "Pistolas", era: "Cheka / Reconhecimento", image: "/weapons/nagant-m1895.jpg" },
    { name: "Pistola TT-30 / TT-33 Tokarev (7.62mm)", skill: "Armas de Fogo (Pistolas)", damage: "1d8", range: "15m", attacks: "1 (3)", ammo: "8", malfunction: "99", category: "Pistolas", era: "Soviética (1930/1933)", image: "/weapons/tt-33.jpg" },
    { name: "Pistola Korovin TK (6.35mm / .25)", skill: "Armas de Fogo (Pistolas)", damage: "1d6", range: "10m", attacks: "1 (3)", ammo: "8", malfunction: "99", category: "Pistolas", era: "Soviética (1926)" },
    { name: "Mauser C96 'Bolo' (7.63mm)", skill: "Armas de Fogo (Pistolas)", damage: "1d8", range: "20m", attacks: "1 (3)", ammo: "10", malfunction: "99", category: "Pistolas", era: "Bolchevique (Anos 20)" },
    { name: "Pistola Browning M1903 (9mm Browning)", skill: "Armas de Fogo (Pistolas)", damage: "1d10", range: "15m", attacks: "1 (3)", ammo: "7", malfunction: "99", category: "Pistolas", era: "Polícia Czarista / Revolução" },
    { name: "Pistola Dreyse M1907 (7.65mm)", skill: "Armas de Fogo (Pistolas)", damage: "1d8", range: "15m", attacks: "1 (3)", ammo: "8", malfunction: "98", category: "Pistolas", era: "Guerra Civil Russa" },
    { name: "Pistola Sinalizadora SPSh (26mm)", skill: "Armas de Fogo (Pistolas)", damage: "1d10 + 1d3 queim.", range: "10m", attacks: "1/2", ammo: "1", malfunction: "100", category: "Pistolas", era: "Sinalização Militar" },

    // ==========================================
    // 4. RIFLES, FUZIS & CARABINAS
    // ==========================================
    { name: "Fuzil Mosin-Nagant M1891/30 (7.62mm)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6 + 4", range: "110m", attacks: "1", ammo: "5", malfunction: "100", category: "Rifles/Arcos", era: "Soviética (Padrão 1930)", image: "/weapons/mosin-m91-30.jpg" },
    { name: "Fuzil Mosin-Nagant M1891 'Trilineyka'", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6 + 4", range: "110m", attacks: "1", ammo: "5", malfunction: "100", category: "Rifles/Arcos", era: "Imperial Russo / Guerra Civil", image: "/weapons/mosin-m91-30.jpg" },
    { name: "Fuzil Mosin-Nagant Sniper (Mira PE/PU)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6 + 4", range: "150m", attacks: "1", ammo: "5", malfunction: "100", category: "Rifles/Arcos", era: "Atirador de Elite (1931)", image: "/weapons/mosin-m91-30.jpg" },
    { name: "Carabina Mosin-Nagant M1907 (7.62mm)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6 + 3", range: "80m", attacks: "1", ammo: "5", malfunction: "100", category: "Rifles/Arcos", era: "Cavalaria / Artilharia", image: "/weapons/mosin-m91-30.jpg" },
    { name: "Carabina Mosin-Nagant M1938 (7.62mm)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6 + 3", range: "90m", attacks: "1", ammo: "5", malfunction: "100", category: "Rifles/Arcos", era: "Soviética (1938)", image: "/weapons/mosin-m91-30.jpg" },
    { name: "Fedorov Avtomat (6.5mm Fedorov)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6", range: "90m", attacks: "1 (2) ou Auto", ammo: "25", malfunction: "96", category: "Rifles/Arcos", era: "Soviética (1916/1920)" },
    { name: "Fuzil Semi-Auto AVS-36 Simonov (7.62mm)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6 + 4", range: "100m", attacks: "1 (2) ou Auto", ammo: "15", malfunction: "97", category: "Rifles/Arcos", era: "Soviética (1936)" },
    { name: "Fuzil Semi-Auto SVT-38 / SVT-40 (7.62mm)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6 + 4", range: "110m", attacks: "1 (2)", ammo: "10", malfunction: "98", category: "Rifles/Arcos", era: "Soviética (1938/1940)" },
    { name: "Carabina Winchester M1895 Russa (7.62mm)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6 + 2", range: "70m", attacks: "1", ammo: "5", malfunction: "98", category: "Rifles/Arcos", era: "Contrato Russo (Alavanca)" },
    { name: "Carabina SKS-45 (7.62×39mm)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6 + 1", range: "90m", attacks: "1 (2)", ammo: "10", malfunction: "97", category: "Rifles/Arcos", era: "Soviética (1945)" },
    { name: "Fuzil Monotiro Berdan II (.42 Berdan)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "1d10 + 4", range: "60m", attacks: "1/3", ammo: "1", malfunction: "97", category: "Rifles/Arcos", era: "Reserva Civil / Caça" },
    { name: "Arco de Caça Siberiano", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "1d6 + {db}/2", range: "30m", attacks: "1", ammo: "1", malfunction: "97", category: "Rifles/Arcos", era: "Povos Nativos / Sibéria" },

    // ==========================================
    // 5. ESPINGARDAS (Shotguns & Caça)
    // ==========================================
    { name: "Escopeta Serrada 'Obrez' (Mosin-Nagant)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6 + 2 / 1d6", range: "5/10m", attacks: "1", ammo: "5", malfunction: "95", category: "Espingardas", era: "Partisans / Guerra Civil" },
    { name: "Espingarda Tula TOZ-B Cal. 12 (Canos Duplos)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "4d6 / 2d6 / 1d6", range: "10/20/50m", attacks: "1 ou 2", ammo: "2", malfunction: "100", category: "Espingardas", era: "Caça Civil Tula" },
    { name: "Espingarda Tula TOZ-B Cal. 16 (Canos Duplos)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6+2 / 1d6+1 / 1d4", range: "10/20/50m", attacks: "1 ou 2", ammo: "2", malfunction: "100", category: "Espingardas", era: "Caça Civil Tula" },
    { name: "Espingarda Tula Cal. 12 (Cano Serrado)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "4d6 / 1d6", range: "5/10m", attacks: "1 ou 2", ammo: "2", malfunction: "100", category: "Espingardas", era: "Submundo / Defesa" },
    { name: "Espingarda Frolovka Cal. 20 (Ferrolho)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6 / 1d6 / 1d3", range: "10/20/50m", attacks: "1", ammo: "2", malfunction: "98", category: "Espingardas", era: "Conversão Civil (Anos 20)" },
    { name: "Espingarda Monotiro IZh-5 (Calibre 16)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "2d6+2 / 1d6+1 / 1d4", range: "10/20/50m", attacks: "1/2", ammo: "1", malfunction: "99", category: "Espingardas", era: "Izhevsk (1924)" },

    // ==========================================
    // 6. SUBMETRALHADORAS (SMGs)
    // ==========================================
    { name: "Submetralhadora PPD-34/38 (Degtyaryov)", skill: "Armas de Fogo (Submetralhadoras)", damage: "1d10", range: "25m", attacks: "1 (2) ou Auto", ammo: "25", malfunction: "96", category: "Automáticas", era: "Soviética (1934/1938)", image: "/weapons/ppsh-41.jpg" },
    { name: "Submetralhadora PPD-40 (Tambor 71 Tiros)", skill: "Armas de Fogo (Submetralhadoras)", damage: "1d10", range: "25m", attacks: "1 (2) ou Auto", ammo: "71", malfunction: "96", category: "Automáticas", era: "Soviética (1940)", image: "/weapons/ppsh-41.jpg" },
    { name: "Submetralhadora PPSh-41 'Papasha' (7.62mm)", skill: "Armas de Fogo (Submetralhadoras)", damage: "1d10", range: "25m", attacks: "1 ou Auto", ammo: "71", malfunction: "96", category: "Automáticas", era: "Soviética (1941)", image: "/weapons/ppsh-41.jpg" },
    { name: "Submetralhadora PPS-43 (Sudaev)", skill: "Armas de Fogo (Submetralhadoras)", damage: "1d10", range: "25m", attacks: "1 (2) ou Auto", ammo: "35", malfunction: "98", category: "Automáticas", era: "Soviética (Leningrado 1943)" },
    { name: "Carabina-Pistola Tokarev 1927", skill: "Armas de Fogo (Submetralhadoras)", damage: "1d8", range: "20m", attacks: "1 ou Auto", ammo: "21", malfunction: "95", category: "Automáticas", era: "Protótipo Soviético" },
    { name: "Submetralhadora Thompson M1928 (Lend-Lease)", skill: "Armas de Fogo (Submetralhadoras)", damage: "1d10 + 2", range: "20m", attacks: "1 ou Auto", ammo: "20/30/50", malfunction: "96", category: "Automáticas", era: "Fornecimento Lend-Lease" },

    // ==========================================
    // 7. METRALHADORAS & ARMAS PESADAS
    // ==========================================
    { name: "Metralhadora Leve DP-27 Degtyaryov", skill: "Armas de Fogo (Metralhadoras)", damage: "2d6 + 4", range: "90m", attacks: "1 (2) ou Auto", ammo: "47", malfunction: "98", category: "Pesadas", era: "Soviética (1927)" },
    { name: "Metralhadora Leve Madsen Russa (7.62mm)", skill: "Armas de Fogo (Metralhadoras)", damage: "2d6 + 4", range: "90m", attacks: "1 (2) ou Auto", ammo: "25", malfunction: "97", category: "Pesadas", era: "Cavalaria Russa / Tcheka" },
    { name: "Metralhadora Pesada Maxim M1910 (Sokolov)", skill: "Armas de Fogo (Metralhadoras)", damage: "2d6 + 4", range: "150m", attacks: "Auto", ammo: "250", malfunction: "96", category: "Pesadas", era: "Soviética (Rodinhas Sokolov)" },
    { name: "Metralhadora Pesada DShK 1938 (12.7mm)", skill: "Armas de Fogo (Metralhadoras)", damage: "2d10 + 1d8 + 6", range: "250m", attacks: "Auto", ammo: "50", malfunction: "96", category: "Pesadas", era: "Soviética (Antiaérea / Pesada)" },
    { name: "Fuzil Antitanque PTRD-41 (14.5mm)", skill: "Armas de Fogo (Rifles/Espingardas)", damage: "3d10 + 6", range: "200m", attacks: "1/2", ammo: "1", malfunction: "98", category: "Pesadas", era: "Degtyaryov (Antiblindagem)" },
    { name: "Morteiro-Pá VM-37 (37mm)", skill: "Armas de Fogo (Metralhadoras)", damage: "3d10 (2m)", range: "50m", attacks: "1/2", ammo: "1", malfunction: "95", category: "Pesadas", era: "Soviética (1937)" },
    { name: "Lança-Chamas ROKS-2 / ROKS-3", skill: "Armas de Fogo (Lança-Chamas)", damage: "2d6 + queimar", range: "25m", attacks: "1", ammo: "10", malfunction: "94", category: "Pesadas", era: "Soviética (Militar)" }
];
