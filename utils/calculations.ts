// Funções de cálculo para Call of Cthulhu 7ª Edição
import { Characteristics, DerivedStats } from '@/types/character';

export function calculateDerivedStats(chars: Characteristics): DerivedStats {
    const HP = Math.floor((chars.CON + chars.SIZ) / 10);
    const MP = Math.floor(chars.POW / 5);
    const SAN = chars.POW;
    const LUCK = 0; // Deprecated - usar luckTokens

    const movementRate = calculateMovementRate(chars);
    const { damageBonus, build } = calculateDamageBonusAndBuild(chars);

    return {
        HP,
        currentHP: HP, // Inicializa com HP máximo
        MP,
        currentMP: MP, // Inicializa com MP máximo
        SAN,
        currentSAN: SAN, // Inicializa com Sanidade máxima
        LUCK,
        luckTokens: 5, // Moedas da Sorte iniciais
        maxLuckTokens: 5, // Máximo de Moedas da Sorte
        movementRate,
        damageBonus,
        build
    };
}

function calculateMovementRate(chars: Characteristics): number {
    // Lógica simplificada - pode ser expandida com idade
    const { STR, DEX, SIZ } = chars;

    if (STR < SIZ && DEX < SIZ) return 7;
    if (STR >= SIZ && DEX >= SIZ) return 9;
    return 8;
}

function calculateDamageBonusAndBuild(chars: Characteristics): { damageBonus: string; build: number } {
    const total = chars.STR + chars.SIZ;

    if (total <= 64) return { damageBonus: '-2', build: -2 };
    if (total <= 84) return { damageBonus: '-1', build: -1 };
    if (total <= 124) return { damageBonus: '0', build: 0 };
    if (total <= 164) return { damageBonus: '+1d4', build: 1 };
    if (total <= 204) return { damageBonus: '+1d6', build: 2 };
    if (total <= 284) return { damageBonus: '+2d6', build: 3 };
    if (total <= 364) return { damageBonus: '+3d6', build: 4 };
    if (total <= 444) return { damageBonus: '+4d6', build: 5 };

    return { damageBonus: '+5d6', build: 6 };
}

export function calculateOccupationPoints(edu: number): number {
    return edu * 4;
}

export function calculatePersonalInterestPoints(int: number): number {
    return int * 2;
}

export function calculateOccupationPointsFromFormula(formula: string, chars: Characteristics): number {
    // Parse formulas like "EDU×4", "EDU×2+STR×2", "EDU×2+DEX×2", etc.
    try {
        // Replace × with * for JavaScript evaluation
        let parsedFormula = formula.replace(/×/g, '*');

        // Replace characteristic names with their values
        // Portuguese abbreviations first (to avoid conflicts)
        parsedFormula = parsedFormula.replace(/APA/g, chars.APP.toString()); // APA = APP (Aparência)
        parsedFormula = parsedFormula.replace(/DES/g, chars.DEX.toString()); // DES = DEX (Destreza)
        parsedFormula = parsedFormula.replace(/FOR/g, chars.STR.toString()); // FOR = STR (Força)
        parsedFormula = parsedFormula.replace(/POD/g, chars.POW.toString()); // POD = POW (Poder)
        parsedFormula = parsedFormula.replace(/TAM/g, chars.SIZ.toString()); // TAM = SIZ (Tamanho)

        // English abbreviations
        parsedFormula = parsedFormula.replace(/EDU/g, chars.EDU.toString());
        parsedFormula = parsedFormula.replace(/STR/g, chars.STR.toString());
        parsedFormula = parsedFormula.replace(/DEX/g, chars.DEX.toString());
        parsedFormula = parsedFormula.replace(/CON/g, chars.CON.toString());
        parsedFormula = parsedFormula.replace(/SIZ/g, chars.SIZ.toString());
        parsedFormula = parsedFormula.replace(/INT/g, chars.INT.toString());
        parsedFormula = parsedFormula.replace(/POW/g, chars.POW.toString());
        parsedFormula = parsedFormula.replace(/APP/g, chars.APP.toString());

        // Evaluate the formula safely
        const result = eval(parsedFormula);
        return Math.floor(result);
    } catch (error) {
        // Fallback to EDU×4 if formula parsing fails
        console.error('Error parsing occupation formula:', formula, error);
        return chars.EDU * 4;
    }
}

export function calculateHalfValue(value: number): number {
    return Math.floor(value / 2);
}

export function calculateFifthValue(value: number): number {
    return Math.floor(value / 5);
}
