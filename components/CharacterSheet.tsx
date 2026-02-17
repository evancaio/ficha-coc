'use client';

import { useState, useEffect } from 'react';
import { Character, Characteristics, BasicInfo, Backstory, DerivedStats } from '@/types/character';
import { calculateDerivedStats, calculateOccupationPoints, calculatePersonalInterestPoints, calculateOccupationPointsFromFormula } from '@/utils/calculations';
import { saveCharacter, getCurrentCharacter } from '@/utils/storage';
import { skills, getSkillBaseValue } from '@/data/skills';
import { occupations, searchOccupations, getOccupationByName } from '@/data/occupations';
import SkillSelectorModal from './SkillSelectorModal';
import WeaponSelectorModal from './WeaponSelectorModal';
import styles from './CharacterSheet.module.css';
import Link from 'next/link';

export default function CharacterSheet() {
    const [character, setCharacter] = useState<Character>({
        basicInfo: {
            name: '',
            player: '',
            occupation: '',
            age: 25,
            sex: '',
            residence: '',
            birthplace: ''
        },
        characteristics: {
            STR: 50,
            CON: 50,
            SIZ: 50,
            DEX: 50,
            APP: 50,
            INT: 50,
            POW: 50,
            EDU: 50
        },
        derivedStats: calculateDerivedStats({
            STR: 50,
            CON: 50,
            SIZ: 50,
            DEX: 50,
            APP: 50,
            INT: 50,
            POW: 50,
            EDU: 50
        }),
        skills: skills.map(skill => ({
            name: skill.name,
            baseValue: typeof skill.baseValue === 'number' ? skill.baseValue : 0,
            occupationPoints: 0,
            personalPoints: 0
        })),
        weapons: [],
        status: {
            severeInjury: false,
            dying: false,
            temporaryInsanity: false,
            indefiniteInsanity: false,
            woundsAndScars: '',
            maniasAndPhobias: '',
            strangeEncounters: ''
        },
        backstory: {
            personalDescription: '',
            ideology: '',
            significantPeople: '',
            meaningfulLocations: '',
            treasuredPossessions: '',
            traits: '',
            injuriesScars: '',
            phobiasManias: ''
        },
        occupationSkillPoints: 200,
        personalInterestPoints: 100,
        selectedOccupationSkills: []
    });

    const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'combat' | 'backstory'>('info');
    const [occupationSearch, setOccupationSearch] = useState('');
    const [showOccupationModal, setShowOccupationModal] = useState(false);
    const [showOccupationSkillsModal, setShowOccupationSkillsModal] = useState(false);
    const [personalSkillSearch, setPersonalSkillSearch] = useState('');
    const [showWeaponModal, setShowWeaponModal] = useState(false);


    useEffect(() => {
        const saved = getCurrentCharacter();
        if (saved) {
            setCharacter(saved);
        }
    }, []);

    useEffect(() => {
        // Close modal on ESC key
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowOccupationModal(false);
            }
        };

        if (showOccupationModal) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [showOccupationModal]);

    const updateCharacteristics = (key: keyof Characteristics, value: number) => {
        const newChars = { ...character.characteristics, [key]: value };
        const newDerived = calculateDerivedStats(newChars);
        const newPersonalPoints = calculatePersonalInterestPoints(newChars.INT);

        // Calculate occupation points based on the occupation's formula
        let newOccPoints = calculateOccupationPoints(newChars.EDU); // Default
        if (character.basicInfo.occupation) {
            const occupation = getOccupationByName(character.basicInfo.occupation);
            if (occupation) {
                if (/\bou\b/i.test(occupation.skillPoints)) {
                    // If user has already chosen which stat to use, apply it; otherwise strip optional groups
                    if (character.occupationPointsChoice) {
                        const chosen = character.occupationPointsChoice;
                        // for each parenthesis group containing 'ou', pick the clause that includes chosen
                        const processed = occupation.skillPoints.replace(/\([^)]*\bou[^)]*\)/gi, (m) => {
                            const parts = m.replace(/[()]/g, '').split(/\bou\b/i).map(p => p.trim());
                            const found = parts.find(p => new RegExp(`\\b${chosen}\\b`, 'i').test(p));
                            return found || parts[0] || '';
                        });
                        newOccPoints = calculateOccupationPointsFromFormula(processed, newChars);
                    } else {
                        const stripped = occupation.skillPoints.replace(/\([^)]*\bou[^)]*\)/gi, '').trim();
                        newOccPoints = calculateOccupationPointsFromFormula(stripped || occupation.skillPoints, newChars);
                    }
                } else {
                    newOccPoints = calculateOccupationPointsFromFormula(occupation.skillPoints, newChars);
                }
            }
        }

        setCharacter({
            ...character,
            characteristics: newChars,
            derivedStats: newDerived,
            occupationSkillPoints: newOccPoints,
            personalInterestPoints: newPersonalPoints
        });
    };

    const updateBasicInfo = (key: keyof BasicInfo, value: string | number) => {
        setCharacter({
            ...character,
            basicInfo: { ...character.basicInfo, [key]: value }
        });
    };

    const updateBackstory = (key: keyof Backstory, value: string) => {
        setCharacter({
            ...character,
            backstory: { ...character.backstory, [key]: value }
        });
    };

    const updateStatus = (key: keyof Character['status'], value: any) => {
        setCharacter(prev => ({ ...prev, status: { ...prev.status, [key]: value } }));
    };

    const handleOccupationSelect = (occupationName: string) => {
        const occupation = getOccupationByName(occupationName);

        // Recalculate occupation points based on the new occupation's formula
        let newOccPoints = calculateOccupationPoints(character.characteristics.EDU); // Default
        let occChoice: string | null = null;
        if (occupation) {
            // If formula contains alternatives ("ou"), remove optional groups until player chooses
            if (/\bou\b/i.test(occupation.skillPoints)) {
                // compute base formula without the parenthetical 'ou' groups
                const stripped = occupation.skillPoints.replace(/\([^)]*\bou[^)]*\)/gi, '').trim();
                newOccPoints = calculateOccupationPointsFromFormula(stripped || occupation.skillPoints, character.characteristics);
                occChoice = null;
            } else {
                newOccPoints = calculateOccupationPointsFromFormula(occupation.skillPoints, character.characteristics);
            }
        }

        // Auto-populate occupation skills with suggested skills from the occupation
        const suggestedSkills = occupation?.suggestedSkills || [];

        setCharacter({
            ...character,
            basicInfo: { ...character.basicInfo, occupation: occupationName },
            occupationSkillPoints: newOccPoints,
            occupationPointsChoice: occChoice,
            selectedOccupationSkills: suggestedSkills // Auto-fill with suggested skills
        });

        setOccupationSearch('');
        setShowOccupationModal(false);
    };

    const handleSave = () => {
        saveCharacter(character);
        alert('Personagem salvo com sucesso!');
    };

    const handleSelectOccupationSkills = (skillNames: string[]) => {
        setCharacter({
            ...character,
            selectedOccupationSkills: skillNames
        });
    };



    const handleSkillPointChange = (skillName: string, points: number, type: 'occupation' | 'personal') => {
        const updatedSkills = character.skills.map(skill => {
            if (skill.name === skillName) {
                if (type === 'occupation') {
                    return { ...skill, occupationPoints: points };
                } else {
                    return { ...skill, personalPoints: points };
                }
            }
            return skill;
        });

        setCharacter({
            ...character,
            skills: updatedSkills
        });
    };

    const handleSelectWeapon = (weapon: any) => {
        setCharacter(prev => ({ ...prev, weapons: [...prev.weapons, weapon] }));
    };

    const occupationHasChoices = (occupationFormula?: string) => {
        if (!occupationFormula) return false;
        return /\bou\b/i.test(occupationFormula);
    };

    const extractOccupationChoiceOptions = (occupationFormula?: string) => {
        if (!occupationFormula) return [] as string[];
        // First: if there's a parenthetical 'ou' group, prefer its parts
        const m = occupationFormula.match(/\([^)]*\bou[^)]*\)/i);
        if (m) {
            const group = m[0].replace(/[()]/g, '');
            const parts = group.split(/\bou\b/i).map(p => p.trim());
            const tokens = parts.map(p => {
                const t = p.match(/\b(EDU|STR|DEX|CON|SIZ|INT|POW|APP|APA|DES|FOR|POD|TAM)\b/i);
                return t ? t[0].toUpperCase() : p;
            });
            // remove EDU if present
            return Array.from(new Set(tokens.filter(t => t !== 'EDU')));
        }

        // Otherwise, scan the whole formula for attributes multiplied by 2 (or another multiplier pattern)
        const attrRegex = /\b(EDU|STR|DEX|CON|SIZ|INT|POW|APP|APA|DES|FOR|POD|TAM)\b\s*[×x*]\s*2\b/gi;
        const found: string[] = [];
        let fm: RegExpExecArray | null;
        while ((fm = attrRegex.exec(occupationFormula)) !== null) {
            found.push(fm[1].toUpperCase());
        }
        const unique = Array.from(new Set(found.filter(t => t !== 'EDU')));
        // return options only if there's more than one distinct attribute to choose from
        return unique.length > 1 ? unique : [];
    };

    const applyOccupationChoice = (choice: string | null) => {
        const occ = character.basicInfo.occupation ? getOccupationByName(character.basicInfo.occupation) : undefined;
        if (!occ) return;
        if (!occupationHasChoices(occ.skillPoints)) return;

        if (!choice) {
            // remove optional groups
            const stripped = occ.skillPoints.replace(/\([^)]*\bou[^)]*\)/gi, '').trim();
            const val = calculateOccupationPointsFromFormula(stripped || occ.skillPoints, character.characteristics);
            setCharacter(prev => ({ ...prev, occupationSkillPoints: val, occupationPointsChoice: null }));
            return;
        }

        const processed = occ.skillPoints.replace(/\([^)]*\bou[^)]*\)/gi, (m) => {
            const parts = m.replace(/[()]/g, '').split(/\bou\b/i).map(p => p.trim());
            const found = parts.find(p => new RegExp(`\\b${choice}\\b`, 'i').test(p));
            return found || parts[0] || '';
        });

        const val = calculateOccupationPointsFromFormula(processed, character.characteristics);
        setCharacter(prev => ({ ...prev, occupationSkillPoints: val, occupationPointsChoice: choice }));
    };

    const getTotalOccupationPointsUsed = () => {
        return character.skills.reduce((sum, skill) => sum + skill.occupationPoints, 0);
    };

    const getTotalPersonalPointsUsed = () => {
        return character.skills.reduce((sum, skill) => sum + skill.personalPoints, 0);
    };

    const isSpecializationSkill = (skillName: string) => {
        return skillName.includes('Arte e Ofício');
    };

    const updateDerivedStats = (field: keyof DerivedStats, value: number) => {
        setCharacter(prev => ({
            ...prev,
            derivedStats: {
                ...prev.derivedStats,
                [field]: value
            }
        }));
    };

    const getSkillTotalValue = (skillName: string) => {
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

        const canonicalCandidates: string[] = [];

        const lower = skillName.toLowerCase();
        if (lower.includes('armas de fogo')) {
            // classify by most likely subcategory
            if (lower.includes('pistola') || lower.includes('pistolas') || lower.includes('pst')) canonicalCandidates.push('Armas de Fogo (Pistolas)');
            if (lower.includes('rifle') || lower.includes('espingarda') || lower.includes('arco') || lower.includes('arcos') || lower.includes('rifles')) canonicalCandidates.push('Armas de Fogo (Rifles/Espingardas)');
            if (lower.includes('submetral') || lower.includes('smt')) canonicalCandidates.push('Armas de Fogo (Submetralhadoras)');
            if (lower.includes('metralh') || lower.includes('mt')) canonicalCandidates.push('Armas de Fogo (Metralhadoras)');
        }

        // always try exact match first
        const exact = character.skills.find(s => s.name === skillName);
        if (exact) return (typeof exact.baseValue === 'number' ? exact.baseValue : 0) + exact.occupationPoints + exact.personalPoints;

        // try canonical candidates
        for (const cand of canonicalCandidates) {
            const found = character.skills.find(s => s.name === cand);
            if (found) return (typeof found.baseValue === 'number' ? found.baseValue : 0) + found.occupationPoints + found.personalPoints;
        }

        // fallback: fuzzy match by normalized name substring
        const targetNorm = normalize(skillName);
        const fuzzy = character.skills.find(s => normalize(s.name).includes(targetNorm) || targetNorm.includes(normalize(s.name)));
        if (fuzzy) return (typeof fuzzy.baseValue === 'number' ? fuzzy.baseValue : 0) + fuzzy.occupationPoints + fuzzy.personalPoints;

        return 0;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backButton} aria-label="Voltar para seleção">voltar a tela de seleção</Link>
                <h1>Ficha de Investigador</h1>
                <p className={styles.subtitle}>Call of Cthulhu • 7ª Edição</p>
            </header>

            <div className={styles.tabs}>
                <button
                    className={activeTab === 'info' ? styles.tabActive : styles.tab}
                    onClick={() => setActiveTab('info')}
                >
                    Informações
                </button>
                <button
                    className={activeTab === 'skills' ? styles.tabActive : styles.tab}
                    onClick={() => setActiveTab('skills')}
                >
                    Perícias
                </button>
                <button
                    className={activeTab === 'combat' ? styles.tabActive : styles.tab}
                    onClick={() => setActiveTab('combat')}
                >
                    Combate
                </button>
                <button
                    className={activeTab === 'backstory' ? styles.tabActive : styles.tab}
                    onClick={() => setActiveTab('backstory')}
                >
                    História
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'info' && (
                    <div className="fade-in">
                        {/* Informações Básicas */}
                        <section className="card">
                            <h2>Informações Básicas</h2>
                            <div className="grid grid-2">
                                <div>
                                    <label>Nome do Investigador</label>
                                    <input
                                        type="text"
                                        value={character.basicInfo.name}
                                        onChange={(e) => updateBasicInfo('name', e.target.value)}
                                        placeholder="Nome completo"
                                    />
                                </div>
                                <div>
                                    <label>Jogador</label>
                                    <input
                                        type="text"
                                        value={character.basicInfo.player}
                                        onChange={(e) => updateBasicInfo('player', e.target.value)}
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div className={styles.occupationSelector}>
                                    <label>Ocupação</label>
                                    <div className={styles.occupationDisplay}>
                                        <input
                                            type="text"
                                            value={character.basicInfo.occupation}
                                            readOnly
                                            placeholder="Clique para selecionar ocupação..."
                                            onClick={() => setShowOccupationModal(true)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOccupationModal(true)}
                                            className={styles.selectButton}
                                        >
                                            🔍 Selecionar
                                        </button>
                                    </div>
                                    {character.basicInfo.occupation && getOccupationByName(character.basicInfo.occupation) && (
                                        <div className={styles.occupationInfo}>
                                            <div><strong>Pontos de Perícia:</strong> {character.occupationSkillPoints} ({getOccupationByName(character.basicInfo.occupation)!.skillPoints})</div>
                                            <div><strong>Nível de Crédito:</strong> {getOccupationByName(character.basicInfo.occupation)!.creditRating}</div>
                                            <div><strong>Perícias Sugeridas:</strong> {[
                                                ...getOccupationByName(character.basicInfo.occupation)!.suggestedSkills,
                                                ...(getOccupationByName(character.basicInfo.occupation)!.skillChoices?.map(c => c.description) || [])
                                            ].join(', ')}</div>
                                            {occupationHasChoices(getOccupationByName(character.basicInfo.occupation)!.skillPoints) && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--color-sepia-medium)', marginBottom: '6px' }}>Escolha qual atributo usar para os pontos adicionais:</div>
                                                    {extractOccupationChoiceOptions(getOccupationByName(character.basicInfo.occupation)!.skillPoints).map(opt => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => applyOccupationChoice(opt)}
                                                            className={styles.selectButton}
                                                            style={{ marginRight: 8, padding: '6px 10px' }}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                    {character.occupationPointsChoice && (
                                                        <button
                                                            onClick={() => applyOccupationChoice(null)}
                                                            className={styles.selectButton}
                                                            style={{ marginLeft: 8, background: 'transparent', borderColor: 'var(--color-sepia-medium)', color: 'var(--color-sepia-dark)' }}
                                                        >
                                                            Limpar
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label>Idade</label>
                                    <input
                                        type="number"
                                        value={character.basicInfo.age}
                                        onChange={(e) => updateBasicInfo('age', parseInt(e.target.value) || 0)}
                                        min="15"
                                        max="90"
                                    />
                                </div>
                                <div>
                                    <label>Sexo</label>
                                    <input
                                        type="text"
                                        value={character.basicInfo.sex}
                                        onChange={(e) => updateBasicInfo('sex', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Residência</label>
                                    <input
                                        type="text"
                                        value={character.basicInfo.residence}
                                        onChange={(e) => updateBasicInfo('residence', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Local de Nascimento</label>
                                    <input
                                        type="text"
                                        value={character.basicInfo.birthplace}
                                        onChange={(e) => updateBasicInfo('birthplace', e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Características */}
                        <section className="card">
                            <h2>Características</h2>
                            <div className="grid grid-4">
                                {Object.entries(character.characteristics).map(([key, value]) => (
                                    <div key={key} className={styles.characteristic}>
                                        <label>{key}</label>
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) => updateCharacteristics(key as keyof Characteristics, parseInt(e.target.value) || 0)}
                                            min="0"
                                            max="100"
                                        />
                                        <div className={styles.derivedValues}>
                                            <span>½: {Math.floor(value / 2)}</span>
                                            <span>⅕: {Math.floor(value / 5)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Stats Derivados */}
                        <section className="card">
                            <h2>Atributos Derivados</h2>
                            <div className="grid grid-3">
                                <div className={styles.statBox}>
                                    <h3>Pontos de Vida</h3>
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <button
                                            className="w-6 h-6 rounded bg-red-800 text-white flex items-center justify-center hover:bg-red-700"
                                            onClick={() => {
                                                const current = character.derivedStats.currentHP ?? character.derivedStats.HP;
                                                updateDerivedStats('currentHP', Math.max(0, current - 1));
                                            }}
                                        >
                                            -
                                        </button>
                                        <div className={styles.statValue}>
                                            {character.derivedStats.currentHP ?? character.derivedStats.HP}
                                            <span className="text-sm text-gray-500 mx-1">/</span>
                                            {character.derivedStats.HP}
                                        </div>
                                        <button
                                            className="w-6 h-6 rounded bg-green-800 text-white flex items-center justify-center hover:bg-green-700"
                                            onClick={() => {
                                                const current = character.derivedStats.currentHP ?? character.derivedStats.HP;
                                                updateDerivedStats('currentHP', Math.min(character.derivedStats.HP, current + 1));
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden mt-1">
                                        <div
                                            className="bg-red-600 h-full transition-all duration-300"
                                            style={{ width: `${Math.min(100, ((character.derivedStats.currentHP ?? character.derivedStats.HP) / character.derivedStats.HP) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.statBox}>
                                    <h3>Pontos de Magia</h3>
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <button
                                            className="w-6 h-6 rounded bg-indigo-900 text-white flex items-center justify-center hover:bg-indigo-700"
                                            onClick={() => {
                                                const current = character.derivedStats.currentMP ?? character.derivedStats.MP;
                                                updateDerivedStats('currentMP', Math.max(0, current - 1));
                                            }}
                                        >
                                            -
                                        </button>
                                        <div className={styles.statValue}>
                                            {character.derivedStats.currentMP ?? character.derivedStats.MP}
                                            <span className="text-sm text-gray-500 mx-1">/</span>
                                            {character.derivedStats.MP}
                                        </div>
                                        <button
                                            className="w-6 h-6 rounded bg-indigo-800 text-white flex items-center justify-center hover:bg-indigo-600"
                                            onClick={() => {
                                                const current = character.derivedStats.currentMP ?? character.derivedStats.MP;
                                                updateDerivedStats('currentMP', Math.min(character.derivedStats.MP, current + 1));
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden mt-1">
                                        <div
                                            className="bg-indigo-600 h-full transition-all duration-300"
                                            style={{ width: `${Math.min(100, ((character.derivedStats.currentMP ?? character.derivedStats.MP) / character.derivedStats.MP) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.statBox}>
                                    <h3>Sanidade (SAN)</h3>
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <button
                                            className="w-6 h-6 rounded bg-blue-900 text-white flex items-center justify-center hover:bg-blue-800"
                                            onClick={() => {
                                                const current = character.derivedStats.currentSAN ?? character.derivedStats.SAN;
                                                updateDerivedStats('currentSAN', Math.max(0, current - 1));
                                            }}
                                        >
                                            -
                                        </button>
                                        <div className={styles.statValue}>
                                            {character.derivedStats.currentSAN ?? character.derivedStats.SAN}
                                            <span className="text-sm text-gray-500 mx-1">/</span>
                                            99
                                        </div>
                                        <button
                                            className="w-6 h-6 rounded bg-blue-800 text-white flex items-center justify-center hover:bg-blue-700"
                                            onClick={() => {
                                                const current = character.derivedStats.currentSAN ?? character.derivedStats.SAN;
                                                updateDerivedStats('currentSAN', Math.min(99, current + 1));
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden mt-1">
                                        <div
                                            className="bg-blue-600 h-full transition-all duration-300"
                                            style={{ width: `${Math.min(100, ((character.derivedStats.currentSAN ?? character.derivedStats.SAN) / 99) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.statBox}>
                                    <h3>Moedas da Sorte</h3>
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <button
                                            className="w-6 h-6 rounded bg-yellow-700 text-white flex items-center justify-center hover:bg-yellow-600"
                                            onClick={() => {
                                                const current = character.derivedStats.luckTokens ?? 5;
                                                updateDerivedStats('luckTokens', Math.max(0, current - 1));
                                            }}
                                        >
                                            -
                                        </button>
                                        <div className={styles.statValue}>
                                            {character.derivedStats.luckTokens ?? 5}
                                            <span className="text-sm text-gray-500 mx-1">/</span>
                                            5
                                        </div>
                                        <button
                                            className="w-6 h-6 rounded bg-yellow-600 text-white flex items-center justify-center hover:bg-yellow-500"
                                            onClick={() => {
                                                const current = character.derivedStats.luckTokens ?? 5;
                                                updateDerivedStats('luckTokens', Math.min(5, current + 1));
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="flex justify-center gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div
                                                key={i}
                                                className={`w-3 h-3 rounded-full border border-yellow-600 ${(character.derivedStats.luckTokens ?? 5) >= i ? 'bg-yellow-500' : 'bg-transparent'}`}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.statBox}>
                                    <h3>Movimento</h3>
                                    <div className={styles.statValue}>{character.derivedStats.movementRate}</div>
                                </div>
                                <div className={styles.statBox}>
                                    <h3>Bônus de Dano</h3>
                                    <div className={styles.statValue}>{character.derivedStats.damageBonus}</div>
                                </div>
                                <div className={styles.statBox}>
                                    <h3>Corpo</h3>
                                    <div className={styles.statValue}>{character.derivedStats.build}</div>
                                </div>
                            </div>
                        </section>

                        {/* Status Section (moved out of backstory) */}
                        <section className="card">
                            <h2>Status</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px' }}>
                                        <input
                                            type="checkbox"
                                            checked={character.status.severeInjury}
                                            onChange={(e) => updateStatus('severeInjury', e.target.checked)}
                                            style={{ marginRight: '8px' }}
                                        />
                                        Lesão Grave
                                    </label>
                                    <label style={{ display: 'block', marginBottom: '6px' }}>
                                        <input
                                            type="checkbox"
                                            checked={character.status.dying}
                                            onChange={(e) => updateStatus('dying', e.target.checked)}
                                            style={{ marginRight: '8px' }}
                                        />
                                        Morrendo
                                    </label>
                                    <label style={{ display: 'block', marginBottom: '6px' }}>
                                        <input
                                            type="checkbox"
                                            checked={character.status.temporaryInsanity}
                                            onChange={(e) => updateStatus('temporaryInsanity', e.target.checked)}
                                            style={{ marginRight: '8px' }}
                                        />
                                        Insanidade Temporária
                                    </label>
                                    <label style={{ display: 'block', marginBottom: '6px' }}>
                                        <input
                                            type="checkbox"
                                            checked={character.status.indefiniteInsanity}
                                            onChange={(e) => updateStatus('indefiniteInsanity', e.target.checked)}
                                            style={{ marginRight: '8px' }}
                                        />
                                        Insanidade Indefinida
                                    </label>
                                </div>

                                <div>
                                    <label>Ferimentos & Cicatrizes:</label>
                                    <textarea
                                        value={character.status.woundsAndScars}
                                        onChange={(e) => updateStatus('woundsAndScars', e.target.value)}
                                        placeholder="Descreva ferimentos e cicatrizes..."
                                        style={{ width: '100%', minHeight: '64px', marginBottom: '8px' }}
                                    />

                                    <label>Manias & Fobias:</label>
                                    <textarea
                                        value={character.status.maniasAndPhobias}
                                        onChange={(e) => updateStatus('maniasAndPhobias', e.target.value)}
                                        placeholder="Descreva manias e fobias..."
                                        style={{ width: '100%', minHeight: '64px', marginBottom: '8px' }}
                                    />

                                    <label>Encontro com Entidades Estranhas:</label>
                                    <textarea
                                        value={character.status.strangeEncounters}
                                        onChange={(e) => updateStatus('strangeEncounters', e.target.value)}
                                        placeholder="Descreva encontros estranhos..."
                                        style={{ width: '100%', minHeight: '64px' }}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Pontos de Perícia */}
                        <section className="card">
                            <h2>Pontos de Perícia</h2>
                            <div className="grid grid-2">
                                <div className={styles.skillPoints}>
                                    <h3>Pontos Ocupacionais</h3>
                                    <div className={styles.pointsValue}>{character.occupationSkillPoints}</div>
                                    <small>
                                        {character.basicInfo.occupation && getOccupationByName(character.basicInfo.occupation)
                                            ? getOccupationByName(character.basicInfo.occupation)!.skillPoints
                                            : 'EDU × 4'}
                                    </small>
                                </div>
                                <div className={styles.skillPoints}>
                                    <h3>Pontos de Interesse Pessoal</h3>
                                    <div className={styles.pointsValue}>{character.personalInterestPoints}</div>
                                    <small>INT × 2</small>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="fade-in">
                        {/* Pontos de Perícia */}
                        <section className="card">
                            <h2>Pontos de Perícia</h2>
                            <div className="grid grid-2">
                                <div className={styles.skillPoints}>
                                    <h3>Pontos Ocupacionais</h3>
                                    <div className={styles.pointsValue}>{character.occupationSkillPoints}</div>
                                    <small>
                                        {character.basicInfo.occupation && getOccupationByName(character.basicInfo.occupation)
                                            ? getOccupationByName(character.basicInfo.occupation)!.skillPoints
                                            : 'EDU × 4'}
                                    </small>
                                    <div className={styles.pointsProgress}>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${Math.min(100, (getTotalOccupationPointsUsed() / character.occupationSkillPoints) * 100)}%` }}
                                            />
                                        </div>
                                        <div className={styles.pointsUsed}>
                                            {getTotalOccupationPointsUsed()} / {character.occupationSkillPoints} usados
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.skillPoints}>
                                    <h3>Pontos de Interesse Pessoal</h3>
                                    <div className={styles.pointsValue}>{character.personalInterestPoints}</div>
                                    <small>INT × 2</small>
                                    <div className={styles.pointsProgress}>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${Math.min(100, (getTotalPersonalPointsUsed() / character.personalInterestPoints) * 100)}%` }}
                                            />
                                        </div>
                                        <div className={styles.pointsUsed}>
                                            {getTotalPersonalPointsUsed()} / {character.personalInterestPoints} usados
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Perícias Ocupacionais */}
                        <section className="card">
                            <div className={styles.sectionHeader}>
                                <h2>Perícias Ocupacionais</h2>
                                {character.basicInfo.occupation && getOccupationByName(character.basicInfo.occupation)?.skillChoices && getOccupationByName(character.basicInfo.occupation)!.skillChoices!.length > 0 && (
                                    <button
                                        className={styles.selectButton}
                                        onClick={() => setShowOccupationSkillsModal(true)}
                                    >
                                        + Selecionar Perícias
                                    </button>
                                )}
                            </div>
                            {character.selectedOccupationSkills.length === 0 ? (
                                <p className={styles.emptyState}>
                                    Nenhuma perícia ocupacional selecionada. Clique em "Selecionar Perícias" para adicionar.
                                </p>
                            ) : (
                                <div className={styles.skillsList}>
                                    {character.selectedOccupationSkills.map(skillName => {
                                        const skill = character.skills.find(s => s.name === skillName);
                                        if (!skill) return null;
                                        const totalValue = getSkillTotalValue(skillName);
                                        const needsSpec = isSpecializationSkill(skillName);

                                        return (
                                            <div key={skillName} className={styles.skillRow}>
                                                <div className={styles.skillInfo}>
                                                    <div className="flex flex-col">
                                                        <span className={styles.skillName}>{skillName}</span>
                                                        {needsSpec && (
                                                            <input
                                                                type="text"
                                                                placeholder="Especifique..."
                                                                className={`${styles.input} text-xs mt-1`}
                                                                style={{ padding: '2px 6px', width: '100%' }}
                                                                value={skill.specialization || ''}
                                                                onChange={(e) => {
                                                                    const updatedSkills = character.skills.map(s => {
                                                                        if (s.name === skillName) {
                                                                            return { ...s, specialization: e.target.value };
                                                                        }
                                                                        return s;
                                                                    });
                                                                    setCharacter(prev => ({ ...prev, skills: updatedSkills }));
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <span className={styles.skillBadge} style={{ background: '#2a9d8f' }}>Ocupacional</span>
                                                </div>
                                                <div className={styles.skillValues}>
                                                    <div className={styles.skillInputGroup}>
                                                        <div className={styles.skillInput}>
                                                            <label>Ocupacional:</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={character.occupationSkillPoints}
                                                                value={skill.occupationPoints}
                                                                onChange={(e) => handleSkillPointChange(skillName, parseInt(e.target.value) || 0, 'occupation')}
                                                            />
                                                        </div>
                                                        <div className={styles.skillInput}>
                                                            <label>Pessoal:</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={character.personalInterestPoints}
                                                                value={skill.personalPoints}
                                                                onChange={(e) => handleSkillPointChange(skillName, parseInt(e.target.value) || 0, 'personal')}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={styles.skillTotal}>
                                                        <span className={styles.totalLabel}>Total:</span>
                                                        <span className={styles.totalValue}>{totalValue}%</span>
                                                        <span className={styles.derivedValues}>
                                                            ({Math.floor(totalValue / 2)}% / {Math.floor(totalValue / 5)}%)
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Perícias de Interesse Pessoal */}
                        <section className="card">
                            <div className={styles.sectionHeader}>
                                <h2>Perícias de Interesse Pessoal</h2>
                                <input
                                    type="text"
                                    placeholder="Buscar perícia..."
                                    value={personalSkillSearch}
                                    onChange={(e) => setPersonalSkillSearch(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                            <div className={styles.personalSkillsGrid}>
                                {character.skills
                                    .filter(skill =>
                                        !character.selectedOccupationSkills.includes(skill.name) &&
                                        skill.name.toLowerCase().includes(personalSkillSearch.toLowerCase())
                                    )
                                    .sort((a, b) => {
                                        const totalA = a.baseValue + a.occupationPoints + a.personalPoints;
                                        const totalB = b.baseValue + b.occupationPoints + b.personalPoints;
                                        return totalB - totalA;
                                    })
                                    .map(skill => {

                                        const totalValue = getSkillTotalValue(skill.name);
                                        const needsSpec = isSpecializationSkill(skill.name);

                                        return (
                                            <div key={skill.name} className={styles.skillRow}>
                                                <div className={styles.skillInfo}>
                                                    <div className="flex flex-col">
                                                        <span className={styles.skillName}>{skill.name}</span>
                                                        {needsSpec && (
                                                            <input
                                                                type="text"
                                                                placeholder="Especifique..."
                                                                className={`${styles.input} text-xs mt-1`}
                                                                style={{ padding: '2px 6px', width: '100%' }}
                                                                value={skill.specialization || ''}
                                                                onChange={(e) => {
                                                                    const updatedSkills = character.skills.map(s => {
                                                                        if (s.name === skill.name) {
                                                                            return { ...s, specialization: e.target.value };
                                                                        }
                                                                        return s;
                                                                    });
                                                                    setCharacter(prev => ({ ...prev, skills: updatedSkills }));
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <span className={styles.skillBadge} style={{ background: '#457b9d' }}>Pessoal</span>
                                                </div>
                                                <div className={styles.skillValues}>
                                                    <div className={styles.skillInput}>
                                                        <label>Pontos:</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={character.personalInterestPoints}
                                                            value={skill.personalPoints}
                                                            onChange={(e) => handleSkillPointChange(skill.name, parseInt(e.target.value) || 0, 'personal')}
                                                        />
                                                    </div>
                                                    <div className={styles.skillTotal}>
                                                        <span className={styles.totalLabel}>Total:</span>
                                                        <span className={styles.totalValue}>{totalValue}%</span>
                                                        <span className={styles.derivedValues}>
                                                            ({Math.floor(totalValue / 2)}% / {Math.floor(totalValue / 5)}%)
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'combat' && (
                    <div className="fade-in">
                        <section className="card">
                            <h2>Suas Armas</h2>

                            <div className="grid grid-2 mb-6">
                                <div className={styles.statBox}>
                                    <h3>Bônus de Dano</h3>
                                    <div className={styles.statValue}>{character.derivedStats.damageBonus}</div>
                                </div>
                                <div className={styles.statBox}>
                                    <h3>Corpo (Build)</h3>
                                    <div className={styles.statValue}>{character.derivedStats.build}</div>
                                </div>
                            </div>

                            <div className={styles.weaponsList}>
                                {[{
                                    name: 'Desarmado',
                                    skill: 'Lutar (Briga)',
                                    damage: `1d3 + ${character.derivedStats.damageBonus}`,
                                    range: 'Toque',
                                    attacks: 1,
                                    ammo: '-',
                                    malfunction: '-'
                                }, ...character.weapons].map((weapon, index) => {
                                    const skillTotal = getSkillTotalValue(weapon.skill);
                                    const isUnarmed = weapon.name === 'Desarmado';
                                    return (
                                        <div
                                            key={index}
                                            className={`${styles.weaponCard} ${isUnarmed ? styles.unarmedCard : ''}`}
                                        >
                                            <div className={styles.weaponHeader}>
                                                <h3 className={styles.weaponName}>{weapon.name}</h3>
                                                <div className={styles.weaponSkill}>
                                                    <span className={styles.weaponSkillLabel}>{weapon.skill}:</span>
                                                    <span className={styles.weaponSkillValue}>{skillTotal}%</span>
                                                    <span className={styles.weaponSkillSuccess}>
                                                        ({Math.floor(skillTotal / 2)} / {Math.floor(skillTotal / 5)})
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={styles.weaponStats}>
                                                <div className={styles.weaponStat}>
                                                    <label>Dano</label>
                                                    <span>{weapon.damage}</span>
                                                </div>
                                                <div className={styles.weaponStat}>
                                                    <label>Alcance</label>
                                                    <span>{weapon.range}</span>
                                                </div>
                                                <div className={styles.weaponStat}>
                                                    <label>Ataques</label>
                                                    <span>{weapon.attacks}</span>
                                                </div>
                                                <div className={styles.weaponStat}>
                                                    <label>Munição</label>
                                                    <span>{weapon.ammo}</span>
                                                </div>
                                                <div className={styles.weaponStat}>
                                                    <label>Defeito</label>
                                                    <span>{weapon.malfunction}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="card mt-6">
                            <div className={styles.sectionHeader}>
                                <h2>Arsenal</h2>
                                <button
                                    className={styles.selectButton}
                                    onClick={() => setShowWeaponModal(true)}
                                >
                                    Selecionar Armamento
                                </button>
                            </div>
                            <p className="text-gray-400 italic mb-4">Adicione armas aqui...</p>
                            {/* Arsenal placeholder */}
                        </section>
                    </div>
                )}

                {activeTab === 'backstory' && (
                    <div className="fade-in">
                        <section className="card">
                            <h2>História do Personagem</h2>
                            <div className={styles.backstoryGrid}>
                                <div>
                                    <label>Descrição Pessoal</label>
                                    <textarea
                                        value={character.backstory.personalDescription}
                                        onChange={(e) => updateBackstory('personalDescription', e.target.value)}
                                        placeholder="Aparência física, maneirismos..."
                                    />
                                </div>
                                <div>
                                    <label>Ideologia/Crenças</label>
                                    <textarea
                                        value={character.backstory.ideology}
                                        onChange={(e) => updateBackstory('ideology', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Pessoas Significativas</label>
                                    <textarea
                                        value={character.backstory.significantPeople}
                                        onChange={(e) => updateBackstory('significantPeople', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Locais Importantes</label>
                                    <textarea
                                        value={character.backstory.meaningfulLocations}
                                        onChange={(e) => updateBackstory('meaningfulLocations', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Posses Valiosas</label>
                                    <textarea
                                        value={character.backstory.treasuredPossessions}
                                        onChange={(e) => updateBackstory('treasuredPossessions', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Traços</label>
                                    <textarea
                                        value={character.backstory.traits}
                                        onChange={(e) => updateBackstory('traits', e.target.value)}
                                    />
                                </div>
                                {/* Ferimentos & Fobias moved to Status section */}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button onClick={handleSave} className={styles.saveButton}>
                    💾 Salvar Personagem
                </button>
            </div>

            {/* Occupation Selection Modal */}
            {showOccupationModal && (
                <div className={styles.modalOverlay} onClick={() => setShowOccupationModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Selecionar Ocupação</h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowOccupationModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalSearch}>
                            <input
                                type="text"
                                value={occupationSearch}
                                onChange={(e) => setOccupationSearch(e.target.value)}
                                placeholder="🔍 Buscar ocupação..."
                                autoFocus
                            />
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.occupationGrid}>
                                {searchOccupations(occupationSearch).map((occ) => (
                                    <div
                                        key={occ.name}
                                        className={`${styles.occupationCard} ${character.basicInfo.occupation === occ.name ? styles.occupationCardSelected : ''
                                            }`}
                                        onClick={() => handleOccupationSelect(occ.name)}
                                    >
                                        <h3 className={styles.occupationCardTitle}>{occ.name}</h3>
                                        <div className={styles.occupationCardDetails}>
                                            <div className={styles.occupationCardRow}>
                                                <span className={styles.occupationCardLabel}>Pontos de Perícia:</span>
                                                <span className={styles.occupationCardValue}>{occ.skillPoints}</span>
                                            </div>
                                            <div className={styles.occupationCardRow}>
                                                <span className={styles.occupationCardLabel}>Crédito:</span>
                                                <span className={styles.occupationCardValue}>{occ.creditRating}</span>
                                            </div>
                                            {occ.era && (
                                                <div className={styles.occupationCardTags}>
                                                    <span className={styles.occupationCardTag}>{occ.era}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.occupationCardSkills}>
                                            <strong>Perícias:</strong>
                                            <p>{[
                                                ...occ.suggestedSkills,
                                                ...(occ.skillChoices?.map(c => c.description) || [])
                                            ].join(', ')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {searchOccupations(occupationSearch).length === 0 && (
                                <div className={styles.noResults}>
                                    <p>Nenhuma ocupação encontrada para "{occupationSearch}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Skill Selector Modals */}
            <SkillSelectorModal
                isOpen={showOccupationSkillsModal}
                onClose={() => setShowOccupationSkillsModal(false)}
                onSelect={handleSelectOccupationSkills}
                selectedSkills={character.selectedOccupationSkills}
                multiSelect={true}
                title="Selecionar Perícias Ocupacionais"
                description={`Escolha as perícias relacionadas à sua ocupação para alocar pontos ocupacionais. ${character.basicInfo.occupation && getOccupationByName(character.basicInfo.occupation)?.skillChoices
                    ? `(Escolhas restantes: ${(
                        (getOccupationByName(character.basicInfo.occupation)?.suggestedSkills.length || 0) +
                        (getOccupationByName(character.basicInfo.occupation)?.skillChoices?.reduce((acc, curr) => acc + curr.count, 0) || 0)
                    ) - character.selectedOccupationSkills.length})`
                    : ''
                    }`}
                maxSelections={
                    character.basicInfo.occupation
                        ? (getOccupationByName(character.basicInfo.occupation)?.suggestedSkills.length || 0) +
                        (getOccupationByName(character.basicInfo.occupation)?.skillChoices?.reduce((acc, curr) => acc + curr.count, 0) || 0)
                        : undefined
                }
                lockedSkills={
                    character.basicInfo.occupation
                        ? getOccupationByName(character.basicInfo.occupation)?.suggestedSkills
                        : []
                }
            />

            <WeaponSelectorModal
                isOpen={showWeaponModal}
                onClose={() => setShowWeaponModal(false)}
                onSelect={handleSelectWeapon}
            />


        </div>
    );
}
