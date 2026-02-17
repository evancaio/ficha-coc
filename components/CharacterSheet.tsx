"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Character, Skill, SkillChoice } from '../types/character';
import { occupations } from '../data/occupations';
import { skills, getSkillBaseValue, skillCategories } from '../data/skills';
import { calculateAttributes, calculateDerivedStats, calculateSkillPoints } from '../utils/calculations';
import { saveCharacter } from '../utils/storage';
import styles from './CharacterSheet.module.css';

interface CharacterSheetProps {
    initialCharacter?: Character;
    isNew?: boolean;
}

export default function CharacterSheet({ initialCharacter, isNew = false }: CharacterSheetProps) {
    // Estado inicial padrão
    const defaultCharacter: Character = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        basicInfo: {
            name: '',
            player: '',
            occupation: '',
            age: '',
            sex: '',
            residence: '',
            birthplace: ''
        },
        attributes: {
            STR: 50, CON: 50, SIZ: 50, DEX: 50, APP: 50,
            INT: 50, POW: 50, EDU: 50, LUCK: 50
        },
        derivedStats: {
            sanity: 50, maxSanity: 99, magicPoints: 10, maxMagicPoints: 10,
            hitPoints: 10, maxHitPoints: 10, movementRate: 8,
            damageBonus: '0', build: 0, dodge: 25,
            luckTokens: 0, maxLuckTokens: 3 // Sistema de Sorte Opcional (Pulp ou custom)
        },
        skills: [],
        selectedOccupation: null,
        selectedOccupationSkills: [], // Inicializado vazio
        personalInterestSkills: [],
        status: {
            severeInjury: false,
            dying: false,
            temporaryInsanity: false,
            indefiniteInsanity: false
        }
    };

    const [character, setCharacter] = useState<Character>(initialCharacter || defaultCharacter);
    const [isClient, setIsClient] = useState(false);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    // Inicialização no cliente
    useEffect(() => {
        setIsClient(true);
        if (isNew && !initialCharacter) {
            // Se for nova ficha, inicializa perícias e recalcula status
            initializeCharacter();
        }
    }, [isNew, initialCharacter]);

    // Função para recalcular status derivados quando atributos mudam
    const recalculateStats = (currentAttributes: any) => {
        const derived = calculateDerivedStats(currentAttributes);
        return derived;
    };

    // Inicializa a ficha com todas as perícias base
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

    // Auto-save effect
    useEffect(() => {
        if (!isClient) return;

        const timer = setTimeout(async () => {
            if (character.basicInfo.name) { // Só salva se tiver pelo menos o nome
                setSaving(true);
                try {
                    const saved = await saveCharacter(character);
                    if (saved) {
                        setLastSaved(new Date().toLocaleTimeString());
                    }
                } catch (error) {
                    console.error("Erro ao salvar:", error);
                } finally {
                    setSaving(false);
                }
            }
        }, 2000); // Salva 2s após a última alteração

        return () => clearTimeout(timer);
    }, [character, isClient]);


    // Handlers de input
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

        // Se mudar atributos, pode mudar valores base de perícias (ex: Esquiva)
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

        setCharacter(prev => ({
            ...prev,
            attributes: newAttributes,
            derivedStats: { ...prev.derivedStats, ...newDerivedStats }, // Mantém status atuais (ex: HP atual) mas atualiza máximos se necessário?
            // Na verdade, calculateDerivedStats retorna os máximos. Para HP atual, precisamos ver a lógica.
            // Simplificação: atualiza tudo por enquanto. Num app real, trataria HP atual vs Max separado se HP atual < Max.
            skills: updatedSkills,
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

        setCharacter(prev => ({
            ...prev,
            skills: updatedSkills,
            updatedAt: new Date().toISOString()
        }));
    };

    const handleSkillSpecializationChange = (skillName: string, specialization: string) => {
        const updatedSkills = character.skills.map(skill => {
            if (skill.name === skillName) {
                return { ...skill, specialization };
            }
            return skill;
        });

        setCharacter({
            ...character,
            skills: updatedSkills,
            updatedAt: new Date().toISOString()
        });
    };

    const isSpecializationSkill = (skillName: string) => {
        return skillName.includes('Arte e Ofício') || // Updated to the generic name
            skillName.includes('Ciência') ||
            skillName.includes('Pilotar') ||
            skillName.includes('Sobrevivência') ||
            skillName.includes('Língua (Outra)');
    };

    // Modal de Ocupação
    const [showOccupationModal, setShowOccupationModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOccupations = occupations.filter(occ =>
        occ.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectOccupation = (occupationName: string) => {
        const occupation = occupations.find(o => o.name === occupationName);
        if (!occupation) return;

        // Resetar pontos de ocupação anteriores
        const resetSkills = character.skills.map(s => ({ ...s, occupationPoints: 0 }));

        // Identificar skills da ocupação
        // Algumas são fixas, outras são escolhas.
        // Para simplificar, adicionamos as fixas à lista de "selectedOccupationSkills"
        // E o usuário gerencia os pontos manualmente.

        setCharacter(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, occupation: occupation.name },
            selectedOccupation: occupation,
            skills: resetSkills,
            selectedOccupationSkills: occupation.suggestedSkills, // Inicia com as sugeridas
            updatedAt: new Date().toISOString()
        }));
        setShowOccupationModal(false);
    };

    // Renderização
    if (!isClient) return <div className="p-8 text-center text-[var(--color-parchment)]">Carregando Grimório...</div>;

    const { occupationPoints, personalPoints } = calculateSkillPoints(character);

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

    const usedOccupationPoints = getTotalOccupationPointsUsed();
    const usedPersonalPoints = getTotalPersonalPointsUsed();

    // Helper para verificar se skill é da ocupação
    const isOccupationSkill = (skillName: string) => {
        // Verifica se está na lista de sugeridas ou se foi adicionada manualmente (lógica futura para escolhas)
        return character.selectedOccupationSkills.includes(skillName) ||
            // Também verificar se é uma sub-perícia de uma skill genérica da ocupação (ex: Lutar)
            character.selectedOccupation?.suggestedSkills.some(s => skillName.startsWith(s));
    }


    return (
        <div className={styles.container}>
            <Link href="/" className={styles.backButton}>
                ← Voltar para a Seleção
            </Link>
            <header className={styles.header}>
                <h1>Ficha de Investigador</h1>
                <p className={styles.subtitle}>Call of Cthulhu • 7ª Edição</p>

                {saving && <span className="text-xs text-gray-500 absolute top-4 right-4 animate-pulse">Salvando...</span>}
                {!saving && lastSaved && <span className="text-xs text-gray-400 absolute top-4 right-4">Salvo às {lastSaved}</span>}
            </header>

            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                {/* Informações Básicas */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Dados do Investigador</h2>
                    <div className={styles.grid2}>
                        <div className={styles.inputGroup}>
                            <label>Nome</label>
                            <input
                                type="text"
                                value={character.basicInfo.name}
                                onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                                className={styles.input}
                                placeholder="Nome do Personagem"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Jogador</label>
                            <input
                                type="text"
                                value={character.basicInfo.player}
                                onChange={(e) => handleBasicInfoChange('player', e.target.value)}
                                className={styles.input}
                                placeholder="Seu Nome"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Ocupação</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={character.basicInfo.occupation}
                                    readOnly
                                    className={`${styles.input} cursor-pointer bg-gray-50`}
                                    onClick={() => setShowOccupationModal(true)}
                                    placeholder="Selecione..."
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOccupationModal(true)}
                                    className="px-3 py-1 bg-[var(--color-sepia-dark)] text-[#f4e8d0] rounded hover:bg-[var(--color-sepia-medium)]"
                                >
                                    🔍
                                </button>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Idade</label>
                            <input
                                type="number"
                                value={character.basicInfo.age}
                                onChange={(e) => handleBasicInfoChange('age', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Sexo</label>
                            <input
                                type="text"
                                value={character.basicInfo.sex}
                                onChange={(e) => handleBasicInfoChange('sex', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Residência</label>
                            <input
                                type="text"
                                value={character.basicInfo.residence}
                                onChange={(e) => handleBasicInfoChange('residence', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Local de Nascimento</label>
                            <input
                                type="text"
                                value={character.basicInfo.birthplace}
                                onChange={(e) => handleBasicInfoChange('birthplace', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>
                </section>

                {/* Atributos */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Características</h2>
                    <div className={styles.attributesGrid}>
                        {Object.entries(character.attributes).map(([key, value]) => (
                            <div key={key} className={styles.attributeBox}>
                                <label>{key}</label>
                                <div className={styles.attributeValues}>
                                    <input
                                        type="number"
                                        className={styles.mainValue}
                                        value={value}
                                        onChange={(e) => handleAttributeChange(key, e.target.value)}
                                    />
                                    <div className={styles.subValues}>
                                        <span>{Math.floor(value / 2)}</span>
                                        <span>{Math.floor(value / 5)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Status Derivados e Vitalidade */}
                <section className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Vitalidade & Sanidade */}
                        <div className="bg-[rgba(255,255,255,0.5)] p-4 rounded-lg border border-[var(--color-sepia-light)]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-[var(--color-sepia-dark)]">Sanidade (SAN)</h3>
                                <div className="text-2xl font-bold">{character.derivedStats.sanity} / {character.derivedStats.maxSanity}</div>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-[var(--color-sepia-dark)]">Pontos de Magia (PM)</h3>
                                <div className="text-2xl font-bold">{character.derivedStats.magicPoints} / {character.derivedStats.maxMagicPoints}</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-[var(--color-sepia-dark)]">Pontos de Vida (PV)</h3>
                                <div className="text-2xl font-bold text-[var(--color-blood-red)]">{character.derivedStats.hitPoints} / {character.derivedStats.maxHitPoints}</div>
                            </div>
                        </div>

                        {/* Movimento e Combate */}
                        <section className="card">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className={styles.statBox}>
                                    <h3>Sorte</h3>
                                    <div className={styles.luckContainer}>
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
                                            className={styles.textarea}
                                            placeholder="Descreva ferimentos..."
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label>Fobias & Manias:</label>
                                        <textarea
                                            className={styles.textarea}
                                            placeholder="Descreva insanidades..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>

                {/* Pontos de Perícia - FIXED LAYOUT */}
                <section className="mb-8">
                    <h2 className={styles.sectionTitle}>Pontos de Perícia</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${styles.box} p-4 text-center`}>
                            <h3 className={styles.label}>Pontos Ocupacionais</h3>
                            <div className="text-4xl font-bold my-2 text-[var(--color-sepia-dark)]">
                                {occupationPoints}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                                {character.selectedOccupation?.skillPoints}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                <div
                                    className="bg-[var(--color-eldritch-purple)] h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((usedOccupationPoints / occupationPoints) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs mt-1 text-right">{usedOccupationPoints} / {occupationPoints} usados</p>
                        </div>

                        <div className={`${styles.box} p-4 text-center`}>
                            <h3 className={styles.label}>Pontos de Interesse Pessoal</h3>
                            <div className="text-4xl font-bold my-2 text-[var(--color-sepia-dark)]">
                                {personalPoints}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                                INT × 2
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                <div
                                    className="bg-[var(--color-eldritch-green)] h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((usedPersonalPoints / personalPoints) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs mt-1 text-right">{usedPersonalPoints} / {personalPoints} usados</p>
                        </div>
                    </div>
                </section>

                {/* Lista de Perícias */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Perícias</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Vamos agrupar visualmente ou apenas listar? Lista alfabética é o padrão */}
                        {/* Mas precisamos separar as ocupacionais das pessoais para facilitar */}

                        <div className="col-span-full">
                            <h3 className={`${styles.label} mb-4 border-b pb-2`}>Perícias da Ocupação ({character.basicInfo.occupation || 'Nenhuma'})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {character.skills
                                    .filter(skill => isOccupationSkill(skill.name)) // Filtra apenas as da ocupação
                                    .map(skill => {
                                        const skillName = skill.name;
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
                                                                onChange={(e) => handleSkillSpecializationChange(skillName, e.target.value)}
                                                            />
                                                        )}
                                                    </div>
                                                    <span className={styles.skillBadge} style={{ background: '#2a9d8f' }}>Ocupacional</span>
                                                </div>
                                                <div className={styles.skillValues}>
                                                    <span className={styles.skillBase}>Base: {skill.baseValue}</span>
                                                    <input
                                                        type="number"
                                                        className={styles.skillInput}
                                                        value={skill.occupationPoints || ''}
                                                        onChange={(e) => handleSkillChange(skill.name, 'occupation', e.target.value)}
                                                        placeholder="pts"
                                                    />
                                                    <span className={styles.skillTotal}>{totalValue}</span>
                                                    <div className={styles.skillHalves}>
                                                        <span>{Math.floor(totalValue / 2)}</span>
                                                        <span>{Math.floor(totalValue / 5)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                            {character.selectedOccupation && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Sugestões: {character.selectedOccupation.suggestedSkills.join(', ')}
                                </p>
                            )}
                        </div>

                        <div className="col-span-full mt-8">
                            <h3 className={`${styles.label} mb-4 border-b pb-2`}>Interesses Pessoais & Outras Perícias</h3>
                            {/* Campo de busca de perícias para adicionar? Por enquanto lista todas as outras */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {character.skills
                                    .filter(skill => !isOccupationSkill(skill.name)) // Todas as que NÃO são da ocupação
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
                                                                onChange={(e) => handleSkillSpecializationChange(skill.name, e.target.value)}
                                                            />
                                                        )}
                                                    </div>
                                                    <span className={styles.skillBadge} style={{ background: '#457b9d' }}>Pessoal</span>
                                                </div>
                                                <div className={styles.skillValues}>
                                                    <span className={styles.skillBase}>Base: {skill.baseValue}</span>
                                                    <input
                                                        type="number"
                                                        className={styles.skillInput}
                                                        value={skill.personalPoints || ''}
                                                        onChange={(e) => handleSkillChange(skill.name, 'personal', e.target.value)}
                                                        placeholder="pts"
                                                    />
                                                    <span className={styles.skillTotal}>{totalValue}</span>
                                                    <div className={styles.skillHalves}>
                                                        <span>{Math.floor(totalValue / 2)}</span>
                                                        <span>{Math.floor(totalValue / 5)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                    </div>
                </section>
            </form>

            {showOccupationModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Selecione uma Ocupação</h2>
                        <input
                            type="text"
                            placeholder="Buscar ocupação..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                        <div className={styles.occupationList}>
                            {filteredOccupations.map(occ => (
                                <div
                                    key={occ.name}
                                    className={styles.occupationItem}
                                    onClick={() => selectOccupation(occ.name)}
                                >
                                    <strong>{occ.name}</strong>
                                    <span style={{ fontSize: '0.8em', color: '#666' }}>
                                        ({occ.skillPoints})
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowOccupationModal(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
