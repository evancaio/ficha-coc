"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Character } from '../types/character';
import { occupations } from '../data/occupations';
import { skills, getSkillBaseValue } from '../data/skills';
import { calculateDerivedStats, calculateOccupationPoints, calculatePersonalInterestPoints } from '../utils/calculations';
import { saveCharacter } from '../utils/storage';
import styles from './CharacterSheet.module.css';

interface CharacterSheetProps {
    initialCharacter?: Character;
    isNew?: boolean;
}

type TabType = 'investigator' | 'skills' | 'background' | 'inventory';

export default function CharacterSheet({ initialCharacter, isNew = false }: CharacterSheetProps) {
    // === ESTADO INICIAL ===
    const defaultCharacter: Character = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        basicInfo: {
            name: '', player: '', occupation: '', age: '', sex: '', residence: '', birthplace: ''
        },
        attributes: {
            STR: 50, CON: 50, SIZ: 50, DEX: 50, APP: 50,
            INT: 50, POW: 50, EDU: 50, LUCK: 50
        },
        derivedStats: {
            sanity: 50, maxSanity: 99, magicPoints: 10, maxMagicPoints: 10,
            hitPoints: 10, maxHitPoints: 10, movementRate: 8,
            damageBonus: '0', build: 0, dodge: 25,
            luckTokens: 0, maxLuckTokens: 3
        },
        skills: [],
        selectedOccupation: null,
        selectedOccupationSkills: [], // Inicializado vazio
        personalInterestSkills: [],
        status: {
            severeInjury: false, dying: false, temporaryInsanity: false, indefiniteInsanity: false
        },
        weapons: [], // Add empty weapons array if needed by type, though mostly unused yet
        backstory: { // Add empty backstory
            personalDescription: '', ideology: '', significantPeople: '', meaningfulLocations: '',
            treasuredPossessions: '', traits: '', injuriesScars: '', phobiasManias: ''
        },
        occupationSkillPoints: 0,
        personalInterestPoints: 0
    };

    const [character, setCharacter] = useState<Character>(initialCharacter || defaultCharacter);
    const [isClient, setIsClient] = useState(false);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('investigator');

    // Modal de Ocupação
    const [showOccupationModal, setShowOccupationModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // === EFEITOS ===
    useEffect(() => {
        setIsClient(true);
        if (isNew && !initialCharacter) {
            initializeCharacter();
        }
    }, [isNew, initialCharacter]);

    // Auto-save
    useEffect(() => {
        if (!isClient) return;
        const timer = setTimeout(async () => {
            if (character.basicInfo.name) {
                setSaving(true);
                try {
                    await saveCharacter(character);
                    setLastSaved(new Date().toLocaleTimeString());
                } catch (error) {
                    console.error("Erro ao salvar:", error);
                } finally {
                    setSaving(false);
                }
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [character, isClient]);

    // === LÓGICA UTILS ===
    const recalculateStats = (currentAttributes: any) => {
        return calculateDerivedStats(currentAttributes);
    };

    const initializeCharacter = () => {
        const initialSkills = skills.map(skillDef => ({
            name: skillDef.name,
            baseValue: getSkillBaseValue(skillDef.name, defaultCharacter.attributes),
            occupationPoints: 0,
            personalPoints: 0
        }));

        setCharacter(prev => ({
            ...prev,
            skills: initialSkills,
            derivedStats: recalculateStats(prev.attributes)
        }));
    };

    // === HANDLERS ===
    const handleBasicInfoChange = (field: string, value: string) => {
        setCharacter(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, [field]: value },
            updatedAt: new Date().toISOString()
        }));
    };

    const handleAttributeChange = (attr: string, value: string) => {
        const numValue = parseInt(value) || 0;
        const newAttributes = { ...character.attributes, [attr]: numValue };
        const newDerivedStats = recalculateStats(newAttributes);

        // Atualiza base values de skills que dependem de atributos (ex: Esquiva = DEX/2)
        const updatedSkills = character.skills.map(skill => {
            const def = skills.find(s => s.name === skill.name);
            if (def && typeof def.baseValue === 'string') {
                return {
                    ...skill,
                    baseValue: getSkillBaseValue(skill.name, newAttributes)
                };
            }
            return skill;
        });

        // Atualiza pontos totais disponíveis se EDU ou INT mudarem
        const newOccPoints = calculateOccupationPoints(newAttributes.EDU); // Simplificação, idealmente usa fórmula da ocupação
        const newPersPoints = calculatePersonalInterestPoints(newAttributes.INT);

        setCharacter(prev => ({
            ...prev,
            attributes: newAttributes,
            derivedStats: { ...prev.derivedStats, ...newDerivedStats },
            skills: updatedSkills,
            occupationSkillPoints: newOccPoints,
            personalInterestPoints: newPersPoints,
            updatedAt: new Date().toISOString()
        }));
    };

    const handleSkillChange = (skillName: string, type: 'occupation' | 'personal', value: string) => {
        const points = parseInt(value) || 0;
        const updatedSkills = character.skills.map(skill => {
            if (skill.name === skillName) {
                return {
                    ...skill,
                    [type === 'occupation' ? 'occupationPoints' : 'personalPoints']: points
                };
            }
            return skill;
        });
        setCharacter(prev => ({ ...prev, skills: updatedSkills, updatedAt: new Date().toISOString() }));
    };

    const handleSkillSpecializationChange = (skillName: string, specialization: string) => {
        const updatedSkills = character.skills.map(skill =>
            skill.name === skillName ? { ...skill, specialization } : skill
        );
        setCharacter(prev => ({ ...prev, skills: updatedSkills, updatedAt: new Date().toISOString() }));
    };

    // Lógica de Ocupação
    const filteredOccupations = occupations.filter(occ =>
        occ.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectOccupation = (occupationName: string) => {
        const occupation = occupations.find(o => o.name === occupationName);
        if (!occupation) return;

        const resetSkills = character.skills.map(s => ({ ...s, occupationPoints: 0 }));

        // Recalcula pontos baseados na ocupação (algumas usam EDU+STR, etc, mas por padrão 4xEDU)
        // Aqui simplificamos ou usamos a função se a ocupação tiver formula espeficica (futuro)
        const occPoints = calculateOccupationPoints(character.attributes.EDU);

        setCharacter(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, occupation: occupation.name },
            selectedOccupation: occupation,
            skills: resetSkills,
            selectedOccupationSkills: occupation.suggestedSkills,
            occupationSkillPoints: occPoints,
            updatedAt: new Date().toISOString()
        }));
        setShowOccupationModal(false);
    };

    // Helpers de UI/Cálculo
    const getTotalOccupationPointsUsed = () => character.skills.reduce((sum, s) => sum + s.occupationPoints, 0);
    const getTotalPersonalPointsUsed = () => character.skills.reduce((sum, s) => sum + s.personalPoints, 0);

    const getSkillTotalValue = (skillName: string) => {
        const skill = character.skills.find(s => s.name === skillName);
        if (!skill) return 0;
        return skill.baseValue + skill.occupationPoints + skill.personalPoints;
    };

    const isOccupationSkill = (skillName: string) => {
        return character.selectedOccupationSkills.includes(skillName) ||
            character.selectedOccupation?.suggestedSkills.some(s => skillName.startsWith(s));
    };

    const isSpecializationSkill = (skillName: string) => {
        return ['Arte e Ofício', 'Ciência', 'Pilotar', 'Sobrevivência', 'Língua (Outra)'].some(k => skillName.includes(k));
    };

    if (!isClient) return <div className="p-8 text-center text-[var(--color-parchment)]">Carregando Grimório...</div>;

    const usedOccupationPoints = getTotalOccupationPointsUsed();
    const usedPersonalPoints = getTotalPersonalPointsUsed();
    const availOccupationPoints = character.occupationSkillPoints || calculateOccupationPoints(character.attributes.EDU);
    const availPersonalPoints = character.personalInterestPoints || calculatePersonalInterestPoints(character.attributes.INT);


    return (
        <div className={styles.container}>
            <Link href="/" className={styles.backButton}>← Voltar</Link>

            <header className={styles.header}>
                <h1 className="text-3xl font-bold text-[var(--color-eldritch-purple)]">Ficha de Investigador</h1>
                <div className="flex gap-4 items-center">
                    {saving ? <span className="text-xs text-gray-500 animate-pulse">Salvando...</span> :
                        lastSaved && <span className="text-xs text-gray-400">Salvo às {lastSaved}</span>}
                </div>
            </header>

            {/* ABAS DE NAVEGAÇÃO */}
            <div className="flex border-b border-[var(--color-sepia-dark)] mb-6 gap-1">
                <button
                    onClick={() => setActiveTab('investigator')}
                    className={`px-6 py-2 rounded-t-lg font-bold transition-colors ${activeTab === 'investigator' ? 'bg-[var(--color-sepia-dark)] text-[#f4e8d0]' : 'bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.5)]'}`}
                >
                    Investigador
                </button>
                <button
                    onClick={() => setActiveTab('skills')}
                    className={`px-6 py-2 rounded-t-lg font-bold transition-colors ${activeTab === 'skills' ? 'bg-[var(--color-sepia-dark)] text-[#f4e8d0]' : 'bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.5)]'}`}
                >
                    Perícias
                </button>
                <button
                    onClick={() => setActiveTab('background')}
                    className={`px-6 py-2 rounded-t-lg font-bold transition-colors ${activeTab === 'background' ? 'bg-[var(--color-sepia-dark)] text-[#f4e8d0]' : 'bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.5)]'}`}
                >
                    Biografia
                </button>
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`px-6 py-2 rounded-t-lg font-bold transition-colors ${activeTab === 'inventory' ? 'bg-[var(--color-sepia-dark)] text-[#f4e8d0]' : 'bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.5)]'}`}
                >
                    Status & Equip.
                </button>
            </div>

            <main className="min-h-[600px]">
                {/* === ABA: INVESTIGADOR === */}
                {activeTab === 'investigator' && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Dados Básicos */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Dados Pessoais</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={styles.inputGroup}>
                                    <label>Nome</label>
                                    <input type="text" value={character.basicInfo.name} onChange={e => handleBasicInfoChange('name', e.target.value)} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Jogador</label>
                                    <input type="text" value={character.basicInfo.player} onChange={e => handleBasicInfoChange('player', e.target.value)} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Ocupação</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={character.basicInfo.occupation} readOnly className={`${styles.input} cursor-pointer bg-gray-50`} onClick={() => setShowOccupationModal(true)} placeholder="Selecione..." />
                                        <button onClick={() => setShowOccupationModal(true)} className="px-3 py-1 bg-[var(--color-sepia-dark)] text-[#f4e8d0] rounded">🔍</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={styles.inputGroup}>
                                        <label>Idade</label>
                                        <input type="number" value={character.basicInfo.age} onChange={e => handleBasicInfoChange('age', e.target.value)} className={styles.input} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Sexo</label>
                                        <input type="text" value={character.basicInfo.sex} onChange={e => handleBasicInfoChange('sex', e.target.value)} className={styles.input} />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Residência</label>
                                    <input type="text" value={character.basicInfo.residence} onChange={e => handleBasicInfoChange('residence', e.target.value)} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Local de Nascimento</label>
                                    <input type="text" value={character.basicInfo.birthplace} onChange={e => handleBasicInfoChange('birthplace', e.target.value)} className={styles.input} />
                                </div>
                            </div>
                        </section>

                        {/* Atributos */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Atributos Principais</h2>
                            <div className={styles.attributesGrid}>
                                {Object.entries(character.attributes).map(([key, value]) => (
                                    <div key={key} className={styles.attributeBox}>
                                        <label>{key}</label>
                                        <div className={styles.attributeValues}>
                                            <input type="number" className={styles.mainValue} value={value} onChange={(e) => handleAttributeChange(key, e.target.value)} />
                                            <div className={styles.subValues}>
                                                <span>{Math.floor(value / 2)}</span>
                                                <span>{Math.floor(value / 5)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Status Derivados */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Status</h2>
                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div className="bg-[rgba(255,255,255,0.4)] p-4 rounded border border-[var(--color-sepia-light)]">
                                    <h3 className="font-bold mb-2">Pontos de Vida</h3>
                                    <div className="text-2xl text-[var(--color-blood-red)] font-bold">{character.derivedStats.hitPoints} / {character.derivedStats.maxHitPoints}</div>
                                </div>
                                <div className="bg-[rgba(255,255,255,0.4)] p-4 rounded border border-[var(--color-sepia-light)]">
                                    <h3 className="font-bold mb-2">Sanidade</h3>
                                    <div className="text-2xl text-[var(--color-eldritch-purple)] font-bold">{character.derivedStats.sanity} / {character.derivedStats.maxSanity}</div>
                                </div>
                                <div className="bg-[rgba(255,255,255,0.4)] p-4 rounded border border-[var(--color-sepia-light)]">
                                    <h3 className="font-bold mb-2">Pontos de Magia</h3>
                                    <div className="text-2xl text-[var(--color-eldritch-green)] font-bold">{character.derivedStats.magicPoints} / {character.derivedStats.maxMagicPoints}</div>
                                </div>
                                <div className="bg-[rgba(255,255,255,0.4)] p-4 rounded border border-[var(--color-sepia-light)]">
                                    <h3 className="font-bold mb-2">Sorte</h3>
                                    <div className="flex justify-center items-center gap-2">
                                        <button className="w-6 h-6 rounded bg-[var(--color-sepia-dark)] text-white" onClick={() => setCharacter(p => ({ ...p, derivedStats: { ...p.derivedStats, luckTokens: Math.max(0, p.derivedStats.luckTokens - 1) } }))}>-</button>
                                        <span className="text-xl font-bold">{character.derivedStats.luckTokens} / {character.derivedStats.maxLuckTokens}</span>
                                        <button className="w-6 h-6 rounded bg-[var(--color-sepia-dark)] text-white" onClick={() => setCharacter(p => ({ ...p, derivedStats: { ...p.derivedStats, luckTokens: Math.min(p.derivedStats.maxLuckTokens, p.derivedStats.luckTokens + 1) } }))}>+</button>
                                    </div>
                                </div>
                                <div className="bg-[rgba(255,255,255,0.4)] p-4 rounded border border-[var(--color-sepia-light)]">
                                    <h3 className="font-bold mb-2">Movimento</h3>
                                    <div className="text-xl">{character.derivedStats.movementRate}</div>
                                </div>
                                <div className="bg-[rgba(255,255,255,0.4)] p-4 rounded border border-[var(--color-sepia-light)]">
                                    <h3 className="font-bold mb-2">Bônus de Dano / Corpo</h3>
                                    <div className="text-xl">{character.derivedStats.damageBonus} / {character.derivedStats.build}</div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* === ABA: PERÍCIAS === */}
                {activeTab === 'skills' && (
                    <div className="space-y-8 animate-fadeIn">
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Painel Pontos Ocupacionais */}
                            <div className="bg-[#f0e6d2] p-6 rounded-lg shadow-inner border border-[#d4c5a9]">
                                <h3 className="font-bold text-center mb-2 text-[var(--color-sepia-dark)]">Pontos Ocupacionais</h3>
                                <div className="text-center text-4xl mb-2">{usedOccupationPoints} / {availOccupationPoints}</div>
                                <div className="w-full bg-gray-300 rounded-full h-2">
                                    <div className="bg-[#2a9d8f] h-2 rounded-full transition-all" style={{ width: `${Math.min((usedOccupationPoints / availOccupationPoints) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                            {/* Painel Pontos Pessoais */}
                            <div className="bg-[#f0e6d2] p-6 rounded-lg shadow-inner border border-[#d4c5a9]">
                                <h3 className="font-bold text-center mb-2 text-[var(--color-sepia-dark)]">Pontos de Interesse Pessoal</h3>
                                <div className="text-center text-4xl mb-2">{usedPersonalPoints} / {availPersonalPoints}</div>
                                <div className="w-full bg-gray-300 rounded-full h-2">
                                    <div className="bg-[#e76f51] h-2 rounded-full transition-all" style={{ width: `${Math.min((usedPersonalPoints / availPersonalPoints) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* COLUNA ESQUERDA: OCUPACIONAIS */}
                            <div>
                                <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[var(--color-sepia-dark)] text-[#2a9d8f]">
                                    Perícias de Ocupação {character.basicInfo.occupation && `(${character.basicInfo.occupation})`}
                                </h3>
                                <div className="space-y-2">
                                    {character.skills
                                        .filter(skill => isOccupationSkill(skill.name))
                                        .map(skill => {
                                            const total = getSkillTotalValue(skill.name);
                                            return (
                                                <div key={skill.name} className="flex items-center justify-between bg-[rgba(255,255,255,0.5)] p-2 rounded hover:bg-[rgba(255,255,255,0.8)] transition-colors">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm">{skill.name}</div>
                                                        {isSpecializationSkill(skill.name) && (
                                                            <input type="text" placeholder="Especifique..." className="text-xs w-full bg-transparent border-b border-gray-400" value={skill.specialization || ''} onChange={e => handleSkillSpecializationChange(skill.name, e.target.value)} />
                                                        )}
                                                        <span className="text-xs text-gray-500">Base: {skill.baseValue}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input type="number" placeholder="Pts" className="w-16 p-1 text-center bg-white border border-gray-300 rounded" value={skill.occupationPoints || ''} onChange={e => handleSkillChange(skill.name, 'occupation', e.target.value)} />
                                                        <div className="w-10 text-center font-bold text-lg">{total}</div>
                                                        <div className="flex flex-col text-[0.6rem] text-gray-500 w-6 text-center">
                                                            <span>{Math.floor(total / 2)}</span>
                                                            <span>{Math.floor(total / 5)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    {(!character.selectedOccupation && character.skills.filter(s => isOccupationSkill(s.name)).length === 0) && (
                                        <p className="text-sm italic text-gray-500">Selecione uma ocupação na aba Investigador para ver as perícias sugeridas.</p>
                                    )}
                                </div>
                            </div>

                            {/* COLUNA DIREITA: PESSOAIS / OUTRAS */}
                            <div>
                                <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[var(--color-sepia-dark)] text-[#e76f51]">
                                    Outras Perícias
                                </h3>
                                <div className="space-y-2 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                                    {character.skills
                                        .filter(skill => !isOccupationSkill(skill.name))
                                        .map(skill => {
                                            const total = getSkillTotalValue(skill.name);
                                            return (
                                                <div key={skill.name} className="flex items-center justify-between bg-[rgba(255,255,255,0.3)] p-2 rounded hover:bg-[rgba(255,255,255,0.8)] transition-colors">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm text-[#3e3e3e]">{skill.name}</div>
                                                        {isSpecializationSkill(skill.name) && (
                                                            <input type="text" placeholder="Especifique..." className="text-xs w-full bg-transparent border-b border-gray-400" value={skill.specialization || ''} onChange={e => handleSkillSpecializationChange(skill.name, e.target.value)} />
                                                        )}
                                                        <span className="text-xs text-gray-500">Base: {skill.baseValue}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input type="number" placeholder="Pts" className="w-16 p-1 text-center bg-white border border-gray-300 rounded" value={skill.personalPoints || ''} onChange={e => handleSkillChange(skill.name, 'personal', e.target.value)} />
                                                        <div className="w-10 text-center font-bold text-lg text-[#3e3e3e]">{total}</div>
                                                        <div className="flex flex-col text-[0.6rem] text-gray-500 w-6 text-center">
                                                            <span>{Math.floor(total / 2)}</span>
                                                            <span>{Math.floor(total / 5)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* === ABA: BIOGRAFIA === */}
                {activeTab === 'background' && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className={styles.sectionTitle}>História do Investigador</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className={styles.inputGroup}>
                                <label>Descrição Pessoal</label>
                                <textarea className={styles.textarea} value={character.backstory?.personalDescription} onChange={e => setCharacter({ ...character, backstory: { ...character.backstory, personalDescription: e.target.value } })} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={styles.inputGroup}>
                                    <label>Ideologia & Crenças</label>
                                    <textarea className={styles.textarea} value={character.backstory?.ideology} onChange={e => setCharacter({ ...character, backstory: { ...character.backstory, ideology: e.target.value } })} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Pessoas Significativas</label>
                                    <textarea className={styles.textarea} value={character.backstory?.significantPeople} onChange={e => setCharacter({ ...character, backstory: { ...character.backstory, significantPeople: e.target.value } })} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Locais Importantes</label>
                                    <textarea className={styles.textarea} value={character.backstory?.meaningfulLocations} onChange={e => setCharacter({ ...character, backstory: { ...character.backstory, meaningfulLocations: e.target.value } })} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Pertences Queridos</label>
                                    <textarea className={styles.textarea} value={character.backstory?.treasuredPossessions} onChange={e => setCharacter({ ...character, backstory: { ...character.backstory, treasuredPossessions: e.target.value } })} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Características (Traits)</label>
                                    <textarea className={styles.textarea} value={character.backstory?.traits} onChange={e => setCharacter({ ...character, backstory: { ...character.backstory, traits: e.target.value } })} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* === ABA: INVENTÁRIO & STATUS === */}
                {activeTab === 'inventory' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-red-50 p-6 rounded border border-red-200 mb-8">
                            <h2 className="text-xl font-bold text-red-900 mb-4">Condições & Insanidades</h2>
                            <div className="flex flex-wrap gap-4 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5" checked={character.status?.severeInjury} onChange={e => setCharacter({ ...character, status: { ...character.status, severeInjury: e.target.checked } })} />
                                    <span>Lesão Grave</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5" checked={character.status?.dying} onChange={e => setCharacter({ ...character, status: { ...character.status, dying: e.target.checked } })} />
                                    <span>Morrendo</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5" checked={character.status?.temporaryInsanity} onChange={e => setCharacter({ ...character, status: { ...character.status, temporaryInsanity: e.target.checked } })} />
                                    <span>Insanidade Temporária</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5" checked={character.status?.indefiniteInsanity} onChange={e => setCharacter({ ...character, status: { ...character.status, indefiniteInsanity: e.target.checked } })} />
                                    <span>Insanidade Indefinida</span>
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Ferimentos & Cicatrizes</label>
                                    <textarea className="w-full p-2 border rounded h-20" value={character.status?.woundsAndScars || ''} onChange={e => setCharacter({ ...character, status: { ...character.status, woundsAndScars: e.target.value } })}></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Fobias & Manias</label>
                                    <textarea className="w-full p-2 border rounded h-20" value={character.status?.maniasAndPhobias || ''} onChange={e => setCharacter({ ...character, status: { ...character.status, maniasAndPhobias: e.target.value } })}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* MODAL OCUPAÇÃO */}
            {showOccupationModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Selecione uma Ocupação</h2>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                        <div className={styles.occupationList}>
                            {filteredOccupations.map(occ => (
                                <div key={occ.name} className={styles.occupationItem} onClick={() => selectOccupation(occ.name)}>
                                    <strong>{occ.name}</strong> <span>({occ.skillPoints})</span>
                                </div>
                            ))}
                        </div>
                        <button className={styles.closeButton} onClick={() => setShowOccupationModal(false)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
