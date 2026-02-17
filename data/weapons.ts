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
}

export const weaponDefinitions: WeaponDefinition[] = [
    // Armas Comuns (Corpo a Corpo / Arremesso)
    { name: "Desarmado", skill: "Lutar (Briga)", damage: "1d3 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Soqueira", skill: "Lutar (Briga)", damage: "1d3 + 1 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Chicote", skill: "Lutar (Chicotes)", damage: "1d3 + {db} / 2", range: "3m", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" }, // Note: damage implies half db? Text says "1D3+meio DX". Assuming DX=DB.
    { name: "Tocha Acesa", skill: "Lutar (Briga)", damage: "1d6 + queimadura", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Serra Elétrica", skill: "Lutar (Serras Elétricas)", damage: "2d8", range: "Toque", attacks: "1", ammo: "-", malfunction: "95", category: "Corpo a Corpo" },
    { name: "Cassetete (Blackjack)", skill: "Lutar (Briga)", damage: "1d8 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Porrete Grande (Bastão)", skill: "Lutar (Briga)", damage: "1d8 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Porrete Pequeno (Extensível)", skill: "Lutar (Briga)", damage: "1d6 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Garrote", skill: "Lutar (Garrote)", damage: "1d6 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Machadinha / Foicinha", skill: "Lutar (Machados)", damage: "1d6 + 1 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Faca Grande (Facão)", skill: "Lutar (Briga)", damage: "1d8 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Faca Média (Cozinha)", skill: "Lutar (Briga)", damage: "1d4 + 2 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Faca Pequena (Canivete)", skill: "Lutar (Briga)", damage: "1d4 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Cabo Eletrizado", skill: "Lutar (Briga)", damage: "2d8 + atordoar", range: "Toque", attacks: "1", ammo: "-", malfunction: "95", category: "Corpo a Corpo" },
    { name: "Spray de Pimenta", skill: "Lutar (Briga)", damage: "Atordoar", range: "2m", attacks: "1", ammo: "25", malfunction: "-", category: "Corpo a Corpo" }, // Ammo: 25 Jatos
    { name: "Nunchaku", skill: "Lutar (Manguais)", damage: "1d8 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Lança (Cavalaria)", skill: "Lutar (Lanças)", damage: "1d8 + 1", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Sabre de Cavalaria (Espada Pesada)", skill: "Lutar (Espadas)", damage: "1d8 + 1 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Espada Média (Rapieira)", skill: "Lutar (Espadas)", damage: "1d6 + 1 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Espada Leve (Florete)", skill: "Lutar (Espadas)", damage: "1d6 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },
    { name: "Taser (Contato)", skill: "Lutar (Briga)", damage: "1d3 + atordoar", range: "Toque", attacks: "1", ammo: "Varia", malfunction: "97", category: "Corpo a Corpo" },
    { name: "Machado de Lenhador", skill: "Lutar (Machados)", damage: "1d8 + 2 + {db}", range: "Toque", attacks: "1", ammo: "-", malfunction: "-", category: "Corpo a Corpo" },

    // Arremesso
    { name: "Pedra Arremessada", skill: "Arremessar", damage: "1d4 + {db}/2", range: "FOR/5 m", attacks: "1", ammo: "-", malfunction: "-", category: "Arremesso" },
    { name: "Shuriken", skill: "Arremessar", damage: "1d3 + {db}/2", range: "FOR/5 m", attacks: "2", ammo: "Uso Único", malfunction: "100", category: "Arremesso" },
    { name: "Lança Arremessada", skill: "Arremessar", damage: "1d8 + {db}/2", range: "FOR/5 m", attacks: "1", ammo: "-", malfunction: "-", category: "Arremesso" },
    { name: "Bumerangue de Guerra", skill: "Arremessar", damage: "1d8 + {db}/2", range: "FOR/5 m", attacks: "1", ammo: "-", malfunction: "-", category: "Arremesso" },
    { name: "Coquetel Molotov", skill: "Arremessar", damage: "2d6 + queimar", range: "FOR/5 m", attacks: "1/2", ammo: "Uso Único", malfunction: "95", category: "Arremesso" },
    { name: "Banana de Dinamite", skill: "Arremessar", damage: "4d10 (3m)", range: "FOR/5 m", attacks: "1/2", ammo: "Uso Único", malfunction: "99", category: "Arremesso" },
    { name: "Granada de Mão", skill: "Arremessar", damage: "4d10 (3m)", range: "FOR/5 m", attacks: "1/2", ammo: "Uso Único", malfunction: "99", category: "Arremesso" },

    // Armas de Fogo - Pistolas
    { name: "Pederneira", skill: "Armas de Fogo (Pistolas)", damage: "1d6 + 1", range: "10m", attacks: "1/4", ammo: "1", malfunction: "95", category: "Pistolas" },
    { name: ".22 Curta Automática", skill: "Armas de Fogo (Pistolas)", damage: "1d6", range: "10m", attacks: "1 (3)", ammo: "6", malfunction: "100", category: "Pistolas" },
    { name: ".25 Derringer (1C)", skill: "Armas de Fogo (Pistolas)", damage: "1d6", range: "3m", attacks: "1", ammo: "1", malfunction: "100", category: "Pistolas" },
    { name: "Revólver .32 / 7.65mm", skill: "Armas de Fogo (Pistolas)", damage: "1d8", range: "15m", attacks: "1 (3)", ammo: "6", malfunction: "100", category: "Pistolas" },
    { name: "Automática .32 / 7.65mm", skill: "Armas de Fogo (Pistolas)", damage: "1d8", range: "15m", attacks: "1 (3)", ammo: "8", malfunction: "99", category: "Pistolas" },
    { name: "Revólver .357 Magnum", skill: "Armas de Fogo (Pistolas)", damage: "1d8 + 1d4", range: "15m", attacks: "1 (3)", ammo: "6", malfunction: "100", category: "Pistolas" },
    { name: "Revólver .38 / 9mm", skill: "Armas de Fogo (Pistolas)", damage: "1d10", range: "15m", attacks: "1 (3)", ammo: "6", malfunction: "100", category: "Pistolas" },
    { name: "Automática .38", skill: "Armas de Fogo (Pistolas)", damage: "1d10", range: "15m", attacks: "1 (3)", ammo: "8", malfunction: "99", category: "Pistolas" },
    { name: "Beretta M9", skill: "Armas de Fogo (Pistolas)", damage: "1d10", range: "15m", attacks: "1 (3)", ammo: "15", malfunction: "98", category: "Pistolas" },
    { name: "Glock 17 9mm", skill: "Armas de Fogo (Pistolas)", damage: "1d10", range: "15m", attacks: "1 (3)", ammo: "17", malfunction: "98", category: "Pistolas" },
    { name: "Luger P08", skill: "Armas de Fogo (Pistolas)", damage: "1d10", range: "15m", attacks: "1 (3)", ammo: "8", malfunction: "99", category: "Pistolas" },
    { name: "Revólver .41", skill: "Armas de Fogo (Pistolas)", damage: "1d10", range: "15m", attacks: "1 (3)", ammo: "8", malfunction: "100", category: "Pistolas" }, // Note: Ammo 8 for revolver seems odd but strictly following table "6" usually. Table says 8? R: "Revólver .41... 6 munição?" Wait checking table: ".41 Revolver... 6". Corrected to 6 based on typical revolver, but table says 8? Let me re-read user input. "Revólver .41 ... 6". Ah, the text alignment is tricky. "1 (3) 6". Okay. Not 8.
    { name: "Revólver .44 Magnum", skill: "Armas de Fogo (Pistolas)", damage: "1d10 + 1d4 + 2", range: "15m", attacks: "1 (3)", ammo: "6", malfunction: "100", category: "Pistolas" },
    { name: "Revólver .45", skill: "Armas de Fogo (Pistolas)", damage: "1d10 + 2", range: "15m", attacks: "1 (3)", ammo: "6", malfunction: "100", category: "Pistolas" },
    { name: "Automática .45", skill: "Armas de Fogo (Pistolas)", damage: "1d10 + 2", range: "15m", attacks: "1 (3)", ammo: "7", malfunction: "100", category: "Pistolas" },
    { name: "Desert Eagle", skill: "Armas de Fogo (Pistolas)", damage: "1d10 + 1d6 + 3", range: "15m", attacks: "1 (3)", ammo: "7", malfunction: "94", category: "Pistolas" },
    { name: "Taser (Dardo)", skill: "Armas de Fogo (Pistolas)", damage: "1d3 + atordoar", range: "5m", attacks: "1", ammo: "3", malfunction: "95", category: "Pistolas" },
    { name: "Pistola Sinalizadora", skill: "Armas de Fogo (Pistolas)", damage: "1d10 + 1d3 queim.", range: "10m", attacks: "1/2", ammo: "1", malfunction: "100", category: "Pistolas" },

    // Armas de Fogo - Rifles
    { name: "Arco e Flecha", skill: "Armas de Fogo (Arcos)", damage: "1d6 + {db}/2", range: "30m", attacks: "1", ammo: "1", malfunction: "97", category: "Rifles/Arcos" },
    { name: "Besta", skill: "Armas de Fogo (Arcos)", damage: "1d8 + 2", range: "50m", attacks: "1/2", ammo: "1", malfunction: "96", category: "Rifles/Arcos" },
    { name: "Mosquete .58 Springfield", skill: "Armas de Fogo (Rifles)", damage: "1d10 + 4", range: "60m", attacks: "1/4", ammo: "1", malfunction: "95", category: "Rifles/Arcos" },
    { name: "Rifle de Ferrolho .22", skill: "Armas de Fogo (Rifles)", damage: "1d6 + 1", range: "30m", attacks: "1", ammo: "6", malfunction: "99", category: "Rifles/Arcos" },
    { name: "Carabina de Alavanca .30", skill: "Armas de Fogo (Rifles)", damage: "2d6", range: "50m", attacks: "1", ammo: "6", malfunction: "98", category: "Rifles/Arcos" },
    { name: "Rifle Martini-Henry .45", skill: "Armas de Fogo (Rifles)", damage: "1d8 + 1d6 + 3", range: "80m", attacks: "1/3", ammo: "1", malfunction: "100", category: "Rifles/Arcos" },
    { name: "Rifle de Ar (C. Moran)", skill: "Armas de Fogo (Rifles)", damage: "2d6 + 1", range: "20m", attacks: "1/3", ammo: "1", malfunction: "88", category: "Rifles/Arcos" },
    { name: "Garand M1 / M2", skill: "Armas de Fogo (Rifles)", damage: "2d6 + 4", range: "110m", attacks: "1", ammo: "8", malfunction: "100", category: "Rifles/Arcos" },
    { name: "Carabina SKS", skill: "Armas de Fogo (Rifles)", damage: "2d6 + 1", range: "90m", attacks: "1 (2)", ammo: "10", malfunction: "97", category: "Rifles/Arcos" },
    { name: "Lee-Enfield .303", skill: "Armas de Fogo (Rifles)", damage: "2d6 + 4", range: "110m", attacks: "1", ammo: "10", malfunction: "100", category: "Rifles/Arcos" },
    { name: "Rifle de Ferrolho .30-06", skill: "Armas de Fogo (Rifles)", damage: "2d6 + 4", range: "110m", attacks: "1", ammo: "5", malfunction: "100", category: "Rifles/Arcos" },
    { name: "Rifle Semi-Auto .30-06", skill: "Armas de Fogo (Rifles)", damage: "2d6 + 4", range: "110m", attacks: "1", ammo: "5", malfunction: "100", category: "Rifles/Arcos" },
    { name: "Rifle Marlin .444", skill: "Armas de Fogo (Rifles)", damage: "2d8 + 4", range: "110m", attacks: "1", ammo: "5", malfunction: "98", category: "Rifles/Arcos" },
    { name: "Rifle de Elefantes (2C)", skill: "Armas de Fogo (Rifles)", damage: "3d6 + 4", range: "100m", attacks: "1 ou 2", ammo: "2", malfunction: "100", category: "Rifles/Arcos" },

    // Espingardas
    { name: "Espingarda Calibre 20 (2C)", skill: "Armas de Fogo (Espingardas)", damage: "2d6 / 1d6 / 1d3", range: "10/20/50m", attacks: "1 ou 2", ammo: "2", malfunction: "100", category: "Espingardas" },
    { name: "Espingarda Calibre 16 (2C)", skill: "Armas de Fogo (Espingardas)", damage: "2d6+2 / 1d6+1 / 1d4", range: "10/20/50m", attacks: "1 ou 2", ammo: "2", malfunction: "100", category: "Espingardas" },
    { name: "Espingarda Calibre 12 (2C)", skill: "Armas de Fogo (Espingardas)", damage: "4d6 / 2d6 / 1d6", range: "10/20/50m", attacks: "1 ou 2", ammo: "2", malfunction: "100", category: "Espingardas" },
    { name: "Escopeta Calibre 12 (Pump)", skill: "Armas de Fogo (Espingardas)", damage: "4d6 / 2d6 / 1d6", range: "10/20/50m", attacks: "1", ammo: "5", malfunction: "100", category: "Espingardas" },
    { name: "Escopeta Calibre 12 (Semi)", skill: "Armas de Fogo (Espingardas)", damage: "4d6 / 2d6 / 1d6", range: "10/20/50m", attacks: "1 (2)", ammo: "5", malfunction: "100", category: "Espingardas" },
    { name: "Escopeta Cal. 12 (Serrada)", skill: "Armas de Fogo (Espingardas)", damage: "4d6 / 1d6", range: "5/10m", attacks: "1 ou 2", ammo: "2", malfunction: "100", category: "Espingardas" },
    { name: "Espingarda Calibre 10 (2C)", skill: "Armas de Fogo (Espingardas)", damage: "4d6+2 / 2d6+1 / 1d4", range: "10/20/50m", attacks: "1 ou 2", ammo: "2", malfunction: "100", category: "Espingardas" },
    { name: "Benelli M3 Cal. 12", skill: "Armas de Fogo (Espingardas)", damage: "4d6 / 2d6 / 1d6", range: "10/20/50m", attacks: "1 (2)", ammo: "7", malfunction: "100", category: "Espingardas" },
    { name: "SPAS Cal. 12", skill: "Armas de Fogo (Espingardas)", damage: "4d6 / 2d6 / 1d6", range: "10/20/50m", attacks: "1", ammo: "8", malfunction: "98", category: "Espingardas" },

    // Fuzis de Assalto e SMGs
    { name: "AK-47 / AKM", skill: "Armas de Fogo (Rifles/SMT)", damage: "2d6 + 1", range: "100m", attacks: "1 (2) ou Auto", ammo: "30", malfunction: "100", category: "Automáticas" },
    { name: "AK-74", skill: "Armas de Fogo (Rifles/SMT)", damage: "2d6", range: "110m", attacks: "1 (2) ou Auto", ammo: "30", malfunction: "97", category: "Automáticas" },
    { name: "Barrett Model 82", skill: "Armas de Fogo (Rifles)", damage: "2d10 + 1d8 + 6", range: "250m", attacks: "1", ammo: "11", malfunction: "96", category: "Automáticas" },
    { name: "FN FAL", skill: "Armas de Fogo (Rifles/SMT)", damage: "2d6 + 4", range: "110m", attacks: "1 (2) ou Rajada", ammo: "20", malfunction: "97", category: "Automáticas" },
    { name: "Galil", skill: "Armas de Fogo (Rifles/SMT)", damage: "2d6", range: "110m", attacks: "1 ou Auto", ammo: "20", malfunction: "98", category: "Automáticas" },
    { name: "M16A2", skill: "Armas de Fogo (Rifles/SMT)", damage: "2d6", range: "110m", attacks: "1 (2) ou Rajada", ammo: "30", malfunction: "97", category: "Automáticas" },
    { name: "M4", skill: "Armas de Fogo (Rifles/SMT)", damage: "2d6", range: "90m", attacks: "1 ou Rajada", ammo: "30", malfunction: "97", category: "Automáticas" },
    { name: "Steyr AUG", skill: "Armas de Fogo (Rifles/SMT)", damage: "2d6", range: "110m", attacks: "1 (2) ou Auto", ammo: "30", malfunction: "99", category: "Automáticas" },
    { name: "Submetralhadora Thompson", skill: "Armas de Fogo (SMT)", damage: "1d10 + 2", range: "20m", attacks: "1 ou Auto", ammo: "20/30/50", malfunction: "96", category: "Automáticas" },
    { name: "Uzi", skill: "Armas de Fogo (SMT)", damage: "1d10", range: "20m", attacks: "1 (2) ou Auto", ammo: "32", malfunction: "98", category: "Automáticas" },
    { name: "HK MP5", skill: "Armas de Fogo (SMT)", damage: "1d10", range: "20m", attacks: "1 (2) ou Auto", ammo: "15/30", malfunction: "97", category: "Automáticas" },
    { name: "Ingram MAC-11", skill: "Armas de Fogo (SMT)", damage: "1d10", range: "15m", attacks: "1 (3) ou Auto", ammo: "32", malfunction: "96", category: "Automáticas" },

    // Metralhadoras e Pesadas
    { name: "Gatling Gun 1882", skill: "Armas de Fogo (MT)", damage: "2d6 + 4", range: "100m", attacks: "Auto", ammo: "200", malfunction: "96", category: "Pesadas" },
    { name: "Browning BAR M1918", skill: "Armas de Fogo (MT)", damage: "2d6 + 4", range: "90m", attacks: "1 (2) ou Auto", ammo: "20", malfunction: "100", category: "Pesadas" },
    { name: "Browning M1917A1 .30", skill: "Armas de Fogo (MT)", damage: "2d6 + 4", range: "150m", attacks: "Auto", ammo: "250", malfunction: "96", category: "Pesadas" },
    { name: "Minigun", skill: "Armas de Fogo (MT)", damage: "2d6 + 4", range: "200m", attacks: "Auto", ammo: "4000", malfunction: "98", category: "Pesadas" },
    { name: "Lança-Granadas M79", skill: "Armas de Fogo (Pesadas)", damage: "3d10 (2m)", range: "20m", attacks: "1/3", ammo: "1", malfunction: "99", category: "Pesadas" },
    { name: "Lança-Foguetes (LAW)", skill: "Armas de Fogo (Pesadas)", damage: "8d10 (1m)", range: "150m", attacks: "1", ammo: "1", malfunction: "98", category: "Pesadas" },
    { name: "Lança-Chamas", skill: "Armas de Fogo (Lança-Chamas)", damage: "2d6 + queim.", range: "25m", attacks: "1", ammo: "10", malfunction: "93", category: "Pesadas" }
];
