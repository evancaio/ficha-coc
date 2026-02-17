'use client';

import { useState, useEffect } from 'react';
import { Character, Characteristics, BasicInfo, Backstory } from '@/types/character';
import { calculateDerivedStats, calculateOccupationPoints, calculatePersonalInterestPoints, calculateOccupationPointsFromFormula } from '@/utils/calculations';
import { saveCharacter, getCurrentCharacter } from '@/utils/storage';
import { skills, getSkillBaseValue } from '@/data/skills';
import { occupations, searchOccupations, getOccupationByName } from '@/data/occupations';
import SkillSelectorModal from './SkillSelectorModal';
import styles from './CharacterSheet.module.css';


interface CharacterSheetProps {
    initialData?: Character;
    characterId?: string;
}

export default function CharacterSheet({ initialData, characterId: initialCharacterId }: CharacterSheetProps) {
    const [characterId, setCharacterId] = useState<string | undefined>(initialCharacterId);
    const [isSaving, setIsSaving] = useState(false);

    const [character, setCharacter] = useState<Character>(initialData || {
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
        status: {
            severeInjury: false,
            dying: false,
            temporaryInsanity: false,
            indefiniteInsanity: false,
            woundsAndScars: '',
            maniasAndPhobias: '',
            strangeEncounters: ''
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


    useEffect(() => {
        // Only load from local storage if NO initial data (cloud data) was provided
        if (!initialData) {
            const saved = getCurrentCharacter();
            if (saved) {
                setCharacter(saved);
            }
        }
    }, [initialData]);

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
                newOccPoints = calculateOccupationPointsFromFormula(occupation.skillPoints, newChars);
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

    const handleOccupationSelect = (occupationName: string) => {
        const occupation = getOccupationByName(occupationName);

        // Recalculate occupation points based on the new occupation's formula
        let newOccPoints = calculateOccupationPoints(character.characteristics.EDU); // Default
        if (occupation) {
            newOccPoints = calculateOccupationPointsFromFormula(occupation.skillPoints, character.characteristics);
        }

        // Auto-populate occupation skills with suggested skills from the occupation
        const suggestedSkills = occupation?.suggestedSkills || [];

        setCharacter({
            ...character,
            basicInfo: { ...character.basicInfo, occupation: occupationName },
            occupationSkillPoints: newOccPoints,
            selectedOccupationSkills: suggestedSkills // Auto-fill with suggested skills
        });

        setOccupationSearch('');
        setShowOccupationModal(false);
    };

    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    const handleSave = async () => {
        // Legacy local save
        saveCharacter(character);

        setIsSaving(true);
        try {
            const method = characterId ? 'PATCH' : 'POST';
            const url = characterId ? `/api/characters/${characterId}` : '/api/characters';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: character.basicInfo.name || 'Novo Investigador',
                    occupation: character.basicInfo.occupation,
                    data: character
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save');
            }

            const savedChar = await response.json();

            if (!characterId && savedChar.id) {
                setCharacterId(savedChar.id);
            }

            // Show success modal instead of alert
            setShowSaveSuccess(true);
        } catch (error) {
            console.error('Error saving:', error);
            alert('Erro ao salvar na nuvem. Mas salvo localmente.');
        } finally {
            setIsSaving(false);
        }
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

    const getTotalOccupationPointsUsed = () => {
        return character.skills.reduce((sum, skill) => sum + skill.occupationPoints, 0);
    };

    const getTotalPersonalPointsUsed = () => {
        return character.skills.reduce((sum, skill) => sum + skill.personalPoints, 0);
    };

    const getSkillTotalValue = (skillName: string) => {
        const skill = character.skills.find(s => s.name === skillName);
        if (!skill) return 0;
        return skill.baseValue + skill.occupationPoints + skill.personalPoints;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
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
                                    <div className={styles.editableStat}>
                                        <input
                                            type="number"
                                            value={character.derivedStats.currentHP}
                                            onChange={(e) => setCharacter({
                                                ...character,
                                                derivedStats: { ...character.derivedStats, currentHP: parseInt(e.target.value) || 0 }
                                            })}
                                            min="0"
                                            max={character.derivedStats.HP}
                                            className={styles.currentValue}
                                        />
                                        <span className={styles.separator}>/</span>
                                        <span className={styles.maxValue}>{character.derivedStats.HP}</span>
                                    </div>
                                </div>
                                <div className={styles.statBox}>
                                    <h3>Pontos de Magia</h3>
                                    <div className={styles.editableStat}>
                                        <input
                                            type="number"
                                            value={character.derivedStats.currentMP}
                                            onChange={(e) => setCharacter({
                                                ...character,
                                                derivedStats: { ...character.derivedStats, currentMP: parseInt(e.target.value) || 0 }
                                            })}
                                            min="0"
                                            max={character.derivedStats.MP}
                                            className={styles.currentValue}
                                        />
                                        <span className={styles.separator}>/</span>
                                        <span className={styles.maxValue}>{character.derivedStats.MP}</span>
                                    </div>
                                </div>
                                <div className={styles.statBox}>
                                    <h3>Sanidade</h3>
                                    <div className={styles.editableStat}>
                                        <input
                                            type="number"
                                            value={character.derivedStats.currentSAN}
                                            onChange={(e) => setCharacter({
                                                ...character,
                                                derivedStats: { ...character.derivedStats, currentSAN: parseInt(e.target.value) || 0 }
                                            })}
                                            min="0"
                                            max={99}
                                            className={styles.currentValue}
                                        />
                                        <span className={styles.separator}>/</span>
                                        <span className={styles.maxValue}>{character.derivedStats.SAN}</span>
                                    </div>
                                </div>
                                <div className={styles.statBox}>
                                    <h3>🪙 Moedas da Sorte</h3>
                                    <div className={styles.luckTokens}>
                                        <button
                                            type="button"
                                            onClick={() => setCharacter({
                                                ...character,
                                                derivedStats: {
                                                    ...character.derivedStats,
                                                    luckTokens: Math.max(0, character.derivedStats.luckTokens - 1)
                                                }
                                            })}
                                            className={styles.tokenButton}
                                            disabled={character.derivedStats.luckTokens <= 0}
                                        >
                                            −
                                        </button>
                                        <div className={styles.tokenDisplay}>
                                            <span className={styles.tokenValue}>{character.derivedStats.luckTokens}</span>
                                            <span className={styles.separator}>/</span>
                                            <span className={styles.maxValue}>{character.derivedStats.maxLuckTokens}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setCharacter({
                                                ...character,
                                                derivedStats: {
                                                    ...character.derivedStats,
                                                    luckTokens: Math.min(character.derivedStats.maxLuckTokens, character.derivedStats.luckTokens + 1)
                                                }
                                            })}
                                            className={styles.tokenButton}
                                            disabled={character.derivedStats.luckTokens >= character.derivedStats.maxLuckTokens}
                                        >
                                            +
                                        </button>
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

                        {/* STATUS */}
                        <section className="card">
                            <h2>⚠️ STATUS</h2>
                            <div className={styles.statusSection}>
                                <div className={styles.statusConditions}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={character.status.severeInjury}
                                            onChange={(e) => setCharacter({
                                                ...character,
                                                status: { ...character.status, severeInjury: e.target.checked }
                                            })}
                                        />
                                        <span>Lesão Grave</span>
                                    </label>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={character.status.dying}
                                            onChange={(e) => setCharacter({
                                                ...character,
                                                status: { ...character.status, dying: e.target.checked }
                                            })}
                                        />
                                        <span>Morrendo</span>
                                    </label>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={character.status.temporaryInsanity}
                                            onChange={(e) => setCharacter({
                                                ...character,
                                                status: { ...character.status, temporaryInsanity: e.target.checked }
                                            })}
                                        />
                                        <span>Insanidade Temporária</span>
                                    </label>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={character.status.indefiniteInsanity}
                                            onChange={(e) => setCharacter({
                                                ...character,
                                                status: { ...character.status, indefiniteInsanity: e.target.checked }
                                            })}
                                        />
                                        <span>Insanidade Indefinida</span>
                                    </label>
                                </div>
                                <div className={styles.statusNotes}>
                                    <div>
                                        <label>Ferimentos & Cicatrizes:</label>
                                        <textarea
                                            value={character.status.woundsAndScars}
                                            onChange={(e) => setCharacter({
                                                ...character,
                                                status: { ...character.status, woundsAndScars: e.target.value }
                                            })}
                                            placeholder="Descreva ferimentos e cicatrizes..."
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <label>Mania & Fobia:</label>
                                        <textarea
                                            value={character.status.maniasAndPhobias}
                                            onChange={(e) => setCharacter({
                                                ...character,
                                                status: { ...character.status, maniasAndPhobias: e.target.value }
                                            })}
                                            placeholder="Descreva manias e fobias..."
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <label>Encontro com Entidades Estranhas:</label>
                                        <textarea
                                            value={character.status.strangeEncounters}
                                            onChange={(e) => setCharacter({
                                                ...character,
                                                status: { ...character.status, strangeEncounters: e.target.value }
                                            })}
                                            placeholder="Descreva encontros com entidades estranhas..."
                                            rows={2}
                                        />
                                    </div>
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
                                        return (
                                            <div key={skillName} className={styles.skillRow}>
                                                <div className={styles.skillInfo}>
                                                    <span className={styles.skillName}>{skillName}</span>
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
                                        return (
                                            <div key={skill.name} className={styles.skillRow}>
                                                <div className={styles.skillInfo}>
                                                    <span className={styles.skillName}>{skill.name}</span>
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
                            <h2>Combate e Armas</h2>
                            <p><em>Em desenvolvimento</em></p>
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
                                <div>
                                    <label>Ferimentos e Cicatrizes</label>
                                    <textarea
                                        value={character.backstory.injuriesScars}
                                        onChange={(e) => updateBackstory('injuriesScars', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Fobias e Manias</label>
                                    <textarea
                                        value={character.backstory.phobiasManias}
                                        onChange={(e) => updateBackstory('phobiasManias', e.target.value)}
                                    />
                                </div>
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


            {/* Save Success Modal */}
            {showSaveSuccess && (
                <div className={styles.modalOverlay}>
                    <div className={`${styles.modalContent} ${styles.successModalContent}`}>
                        <div className={styles.successHeader}>
                            <h2 className={styles.successTitle}>Sucesso!</h2>
                        </div>
                        <div className={styles.successBody}>
                            <div className={styles.successIcon}>✅</div>
                            <p className={styles.successMessage}>Seu investigador foi salvo com sucesso no Grimório.</p>

                            <div className={styles.characterNameDisplay}>
                                {character.basicInfo.name || 'Investigador Sem Nome'}
                            </div>

                            <div className={styles.successActions}>
                                <button
                                    onClick={() => setShowSaveSuccess(false)}
                                    className={`${styles.actionButton} ${styles.secondaryAction}`}
                                >
                                    Continuar Editando
                                </button>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className={`${styles.actionButton} ${styles.primaryAction}`}
                                >
                                    Voltar para a Galeria
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
