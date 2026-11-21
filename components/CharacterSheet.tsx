'use client';

import { useState, useEffect, useRef } from 'react';
import { Character, Characteristics, BasicInfo, Backstory, DerivedStats, GameMode, Archetype } from '@/types/character';
import { calculateDerivedStats, calculateOccupationPoints, calculatePersonalInterestPoints, calculateOccupationPointsFromFormula, calculateArchetypePoints } from '@/utils/calculations';
import { saveCharacter, getCurrentCharacter, loadCharacter } from '@/utils/storage';
import { skills, getSkillBaseValue } from '@/data/skills';
import { occupations, searchOccupations, getOccupationByName } from '@/data/occupations';
import { archetypes, getArchetypeById } from '@/data/archetypes';
import { pulpTalents, getTalentById } from '@/data/pulpTalents';
import SkillSelectorModal from './SkillSelectorModal';
import WeaponSelectorModal from './WeaponSelectorModal';
import BookSheetModal from './BookSheetModal';
import ArchetypeSelectorModal from './ArchetypeSelectorModal';
import PulpTalentsModal from './PulpTalentsModal';
import PulpLuckPanel from './PulpLuckPanel';
import SkillDetailModal from './SkillDetailModal';
import PointExplanationModal, { ExplanationType } from './PointExplanationModal';
import { downloadBookStylePdf } from '@/utils/pdfExport';
import { Zap, Search, BookOpen, Download, Award, FileText, Save, X, Dices, Briefcase, ArrowDownAZ, ArrowUpDown, AlertTriangle, HelpCircle } from 'lucide-react';
import styles from './CharacterSheet.module.css';
import Link from 'next/link';

interface CharacterSheetProps {
    initialData?: Character;
    characterId?: string;
    isNew?: boolean;
    initialMode?: GameMode;
}

export default function CharacterSheet({ initialData, characterId: initialCharacterId, isNew = false, initialMode = 'classic' }: CharacterSheetProps) {
    const [characterId, setCharacterId] = useState<string | undefined>(initialCharacterId);
    const [isSaving, setIsSaving] = useState(false);

    const defaultMode: GameMode = initialData?.gameMode || (initialData?.archetype ? 'pulp' : initialMode) || 'classic';

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
        }, defaultMode),
        skills: skills.map(skill => ({
            name: skill.name,
            baseValue: getSkillBaseValue(skill.name, {
                STR: 50,
                CON: 50,
                SIZ: 50,
                DEX: 50,
                APP: 50,
                INT: 50,
                POW: 50,
                EDU: 50
            }),
            occupationPoints: 0,
            personalPoints: 0,
            archetypePoints: 0
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
        selectedOccupationSkills: [],
        gameMode: defaultMode,
        archetype: '',
        pulpTalents: [],
        archetypeSkillPoints: defaultMode === 'pulp' ? 100 : 0,
        selectedArchetypeSkills: []
    });

    const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'combat' | 'backstory'>('info');
    const [occupationSearch, setOccupationSearch] = useState('');
    const [showOccupationModal, setShowOccupationModal] = useState(false);
    const [showOccupationSkillsModal, setShowOccupationSkillsModal] = useState(false);
    const [showArchetypeModal, setShowArchetypeModal] = useState(false);
    const [showPulpTalentsModal, setShowPulpTalentsModal] = useState(false);
    const [personalSkillSearch, setPersonalSkillSearch] = useState('');
    const [personalSkillSort, setPersonalSkillSort] = useState<'name' | 'value'>('name');
    const [showWeaponModal, setShowWeaponModal] = useState(false);
    const [showBookSheetModal, setShowBookSheetModal] = useState(false);
    const [lastCachedAt, setLastCachedAt] = useState<string | null>(null);
    const [backupText, setBackupText] = useState('');
    const [selectedSkillForDetail, setSelectedSkillForDetail] = useState<string | null>(null);
    const [pointExplanation, setPointExplanation] = useState<ExplanationType>(null);
    const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
    const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [pointWarning, setPointWarning] = useState<{
        message: string;
        type: 'occupation' | 'archetype' | 'personal';
    } | null>(null);

    const handleRollAttributes = () => {
        const roll = (n: number, sides: number) => {
            let total = 0;
            for (let i = 0; i < n; i++) total += 1 + Math.floor(Math.random() * sides);
            return total;
        };
        const newChars: Characteristics = {
            STR: roll(3, 6) * 5,
            CON: roll(3, 6) * 5,
            SIZ: (roll(2, 6) + 6) * 5,
            DEX: roll(3, 6) * 5,
            APP: roll(3, 6) * 5,
            INT: (roll(2, 6) + 6) * 5,
            POW: roll(3, 6) * 5,
            EDU: (roll(2, 6) + 6) * 5
        };
        const newDerived = calculateDerivedStats(newChars, character.gameMode || 'classic');
        const newPersonalPoints = calculatePersonalInterestPoints(newChars.INT);
        let newOccPoints = calculateOccupationPoints(newChars.EDU);
        if (character.basicInfo.occupation) {
            const occupation = getOccupationByName(character.basicInfo.occupation);
            if (occupation) {
                const stripped = occupation.skillPoints.replace(/\([^)]*\bou[^)]*\)/gi, '').trim();
                newOccPoints = calculateOccupationPointsFromFormula(stripped || occupation.skillPoints, newChars);
            }
        }
        const updatedSkills = character.skills.map(s => ({
            ...s,
            baseValue: getSkillBaseValue(s.name, newChars)
        }));
        setCharacter(prev => ({
            ...prev,
            characteristics: newChars,
            derivedStats: newDerived,
            occupationSkillPoints: newOccPoints,
            personalInterestPoints: newPersonalPoints,
            skills: updatedSkills
        }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = Math.min(1, 400 / img.width);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    updateBasicInfo('photo', dataUrl);
                }
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    };


    useEffect(() => {
        if (initialData) {
            setCharacter({
                ...initialData,
                gameMode: initialData.gameMode || (initialData.archetype ? 'pulp' : defaultMode)
            });
            setHasLoadedInitial(true);
            return;
        }
        if (isNew) {
            setHasLoadedInitial(true);
            return;
        }
        if (initialCharacterId) {
            const loaded = loadCharacter(initialCharacterId);
            if (loaded) {
                setCharacter({
                    ...loaded,
                    gameMode: loaded.gameMode || (loaded.archetype ? 'pulp' : 'classic')
                });
                setHasLoadedInitial(true);
                return;
            }
        }
        const saved = getCurrentCharacter();
        if (saved) {
            setCharacter({
                ...saved,
                gameMode: saved.gameMode || (saved.archetype ? 'pulp' : 'classic')
            });
        }
        setHasLoadedInitial(true);
    }, [initialData, initialCharacterId, isNew, defaultMode]);

    // Auto-save automático no cache do navegador (localStorage)
    useEffect(() => {
        if (!hasLoadedInitial) return;
        // Se for uma ficha recém-aberta em branco em /character/new, só cria no cache quando o usuário preencher algo
        const isBlankNew = isNew && !characterId && !character.basicInfo.name && !character.basicInfo.occupation;
        if (isBlankNew) return;

        const timer = setTimeout(() => {
            const savedId = saveCharacter(character, characterId);
            if (!characterId) {
                setCharacterId(savedId);
            }
            setLastCachedAt(new Date().toLocaleTimeString('pt-BR'));
        }, 600);

        return () => clearTimeout(timer);
    }, [character, characterId, hasLoadedInitial, isNew]);

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
        const newDerived = calculateDerivedStats(newChars, character.gameMode || 'classic');
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

        // Update dynamic skill base values that depend on characteristics (ex: Esquivar, Língua (Nativa))
        const updatedSkills = character.skills.map(s => ({
            ...s,
            baseValue: getSkillBaseValue(s.name, newChars)
        }));

        setCharacter({
            ...character,
            characteristics: newChars,
            derivedStats: newDerived,
            occupationSkillPoints: newOccPoints,
            personalInterestPoints: newPersonalPoints,
            skills: updatedSkills
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
        const suggestedSkills = [...(occupation?.suggestedSkills || [])];

        // Ensure 'Nível de Crédito' is included and set its base to occupation minimum
        let minCredit = 0;
        if (occupation && occupation.creditRating) {
            const parts = occupation.creditRating.split(/[–\-]/);
            const parsed = parseInt(parts[0].trim().replace(/[^0-9]/g, ''), 10);
            if (!isNaN(parsed)) minCredit = parsed;
        }

        if (!suggestedSkills.includes('Nível de Crédito')) suggestedSkills.push('Nível de Crédito');

        // Update or add the 'Nível de Crédito' skill in the character.skills list
        const updatedSkills = character.skills.slice();
        const creditIdx = updatedSkills.findIndex(s => s.name === 'Nível de Crédito');
        if (creditIdx >= 0) {
            // Move the minimum credit into occupationPoints so the Ocupacional field shows the value
            updatedSkills[creditIdx] = { ...updatedSkills[creditIdx], baseValue: 0, occupationPoints: minCredit, personalPoints: 0, minOccupationPoints: minCredit };
        } else {
            // Add as occupational points (base 0) so it appears prefilled in Ocupacional
            updatedSkills.push({ name: 'Nível de Crédito', baseValue: 0, occupationPoints: minCredit, personalPoints: 0, minOccupationPoints: minCredit });
        }

        setCharacter({
            ...character,
            basicInfo: { ...character.basicInfo, occupation: occupationName },
            occupationSkillPoints: newOccPoints,
            occupationPointsChoice: occChoice,
            selectedOccupationSkills: suggestedSkills, // Auto-fill with suggested skills
            skills: updatedSkills
        });

        setOccupationSearch('');
        setShowOccupationModal(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const localId = saveCharacter(character, characterId);
        if (!characterId) {
            setCharacterId(localId);
        }

        try {
            const isCloudId = characterId && !characterId.startsWith('char_');
            const method = isCloudId ? 'PUT' : 'POST';
            const url = isCloudId ? `/api/characters/${characterId}` : '/api/characters';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: character.basicInfo.name || 'Sem Nome',
                    occupation: character.basicInfo.occupation,
                    data: character
                }),
            });

            if (response.ok) {
                const savedChar = await response.json();
                if (savedChar?.id) {
                    setCharacterId(String(savedChar.id));
                }
                alert('Personagem salvo na nuvem e localmente com sucesso!');
            } else {
                alert('Personagem salvo localmente no navegador!');
            }
        } catch {
            alert('Personagem salvo localmente no navegador!');
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



    const handleSkillPointChange = (skillName: string, rawPoints: string | number, type: 'occupation' | 'personal' | 'archetype') => {
        // Disallow applying personal interest points to 'Nível de Crédito'
        if (type === 'personal' && skillName === 'Nível de Crédito') return;

        const currentSkill = character.skills.find(s => s.name === skillName);
        if (!currentSkill) return;

        const parsed = rawPoints === '' ? 0 : parseInt(String(rawPoints).replace(/^0+(?=\d)/, ''), 10);
        let desired = isNaN(parsed) ? 0 : Math.max(0, parsed);
        let finalPoints = desired;

        if (type === 'occupation') {
            const minOcc = (currentSkill as any).minOccupationPoints ?? 0;
            const otherUsed = character.skills.reduce((sum, s) => s.name === skillName ? sum : sum + (s.occupationPoints || 0), 0);
            const maxAvailable = Math.max(0, character.occupationSkillPoints - otherUsed);

            if (desired > maxAvailable) {
                finalPoints = maxAvailable;
                if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
                setPointWarning({
                    type: 'occupation',
                    message: `Limite de Pontos Ocupacionais atingido! Você tem ${character.occupationSkillPoints} pontos no total (${maxAvailable} restantes para esta perícia). O valor foi ajustado para o máximo permitido.`
                });
                warningTimerRef.current = setTimeout(() => setPointWarning(null), 4500);
            } else if (desired < minOcc) {
                finalPoints = minOcc;
                if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
                setPointWarning({
                    type: 'occupation',
                    message: `A ocupação selecionada exige um Nível de Crédito mínimo de ${minOcc}.`
                });
                warningTimerRef.current = setTimeout(() => setPointWarning(null), 4500);
            }
        } else if (type === 'archetype') {
            const maxPool = character.archetypeSkillPoints || 100;
            const otherUsed = character.skills.reduce((sum, s) => s.name === skillName ? sum : sum + (s.archetypePoints || 0), 0);
            const maxAvailable = Math.max(0, maxPool - otherUsed);

            if (desired > maxAvailable) {
                finalPoints = maxAvailable;
                if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
                setPointWarning({
                    type: 'archetype',
                    message: `Limite de Pontos de Arquétipo atingido! Você tem ${maxPool} pontos no total (${maxAvailable} restantes para esta perícia). O valor foi ajustado para o máximo permitido.`
                });
                warningTimerRef.current = setTimeout(() => setPointWarning(null), 4500);
            }
        } else if (type === 'personal') {
            const otherUsed = character.skills.reduce((sum, s) => (s.name === skillName || s.name === 'Nível de Crédito') ? sum : sum + (s.personalPoints || 0), 0);
            const maxAvailable = Math.max(0, character.personalInterestPoints - otherUsed);

            if (desired > maxAvailable) {
                finalPoints = maxAvailable;
                if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
                setPointWarning({
                    type: 'personal',
                    message: `Limite de Pontos de Interesse Pessoal atingido! Você tem ${character.personalInterestPoints} pontos no total (${maxAvailable} restantes para esta perícia). O valor foi ajustado para o máximo permitido.`
                });
                warningTimerRef.current = setTimeout(() => setPointWarning(null), 4500);
            }
        }

        const updatedSkills = character.skills.map(skill => {
            if (skill.name === skillName) {
                if (type === 'occupation') {
                    return { ...skill, occupationPoints: finalPoints };
                } else if (type === 'archetype') {
                    return { ...skill, archetypePoints: finalPoints };
                } else {
                    return { ...skill, personalPoints: finalPoints };
                }
            }
            return skill;
        });

        setCharacter(prev => ({
            ...prev,
            skills: updatedSkills
        }));
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
        // Sum occupation points for all skills (Nível de Crédito counts as occupational)
        return character.skills.reduce((sum, skill) => sum + skill.occupationPoints, 0);
    };

    const getTotalPersonalPointsUsed = () => {
        // Exclude 'Nível de Crédito' from personal points usage
        return character.skills.reduce((sum, skill) => skill.name === 'Nível de Crédito' ? sum : sum + skill.personalPoints, 0);
    };

    const getTotalArchetypePointsUsed = () => {
        return character.skills.reduce((sum, skill) => sum + (skill.archetypePoints || 0), 0);
    };

    const isArchetypeSkill = (skillName: string): boolean => {
        if (character.gameMode !== 'pulp' || !character.archetype) return false;
        const arch = archetypes.find(a => 
            a.name.toLowerCase() === character.archetype?.toLowerCase() ||
            a.id.toLowerCase() === character.archetype?.toLowerCase()
        );
        if (!arch) return false;
        const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const nSkill = norm(skillName);
        return arch.skills.some(archSkill => {
            const aSkill = norm(archSkill);
            return nSkill === aSkill || nSkill.startsWith(aSkill) || aSkill.startsWith(nSkill);
        });
    };

    const handleSelectArchetype = (arch: Archetype) => {
        setCharacter(prev => ({
            ...prev,
            archetype: arch.name,
            archetypeSkillPoints: 100
        }));
    };

    const handleSaveTalents = (talents: string[]) => {
        setCharacter(prev => ({
            ...prev,
            pulpTalents: talents
        }));
    };

    const isSpecializationSkill = (skillName: string) => {
        const def = skills.find(s => s.name === skillName);
        return Boolean(def?.requiresSpecialization) || skillName.includes('Arte e Ofício') || skillName.includes('Língua');
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
        if (exact) return (typeof exact.baseValue === 'number' ? exact.baseValue : 0) + exact.occupationPoints + exact.personalPoints + (exact.archetypePoints || 0);

        // try canonical candidates
        for (const cand of canonicalCandidates) {
            const found = character.skills.find(s => s.name === cand);
            if (found) return (typeof found.baseValue === 'number' ? found.baseValue : 0) + found.occupationPoints + found.personalPoints + (found.archetypePoints || 0);
        }

        // fallback: fuzzy match by normalized name substring
        const targetNorm = normalize(skillName);
        const fuzzy = character.skills.find(s => normalize(s.name).includes(targetNorm) || targetNorm.includes(normalize(s.name)));
        if (fuzzy) return (typeof fuzzy.baseValue === 'number' ? fuzzy.baseValue : 0) + fuzzy.occupationPoints + fuzzy.personalPoints + (fuzzy.archetypePoints || 0);

        return 0;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <span className={styles.kicker}>Chamado de Cthulhu</span>
                <h1>{character.gameMode === 'pulp' ? 'Ficha de Herói Pulp' : 'Ficha de Investigador'}</h1>
                <div>
                    <span className={styles.subtitle}>
                        {character.gameMode === 'pulp' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <Zap size={14} /> Pulp Cthulhu · Heróis de Ação
                            </span>
                        ) : 'Досье следователя · 7ª Edição'}
                    </span>
                </div>
            </header>

            <div className={styles.toolbar}>
                <Link href="/" className={styles.backButton} aria-label="Voltar para seleção">
                    ← Galeria
                </Link>
                <button 
                    type="button" 
                    onClick={() => setShowBookSheetModal(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                    <BookOpen size={15} /> Ficha (Estilo Livro)
                </button>
                <button 
                    type="button" 
                    className={styles.redButton} 
                    onClick={() => downloadBookStylePdf(character)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                    <Download size={15} /> Baixar PDF
                </button>
                <button type="button" className={styles.redButton} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Ficha'}
                </button>
                {lastCachedAt && (
                    <span style={{ fontSize: '12px', color: 'var(--mute)', fontWeight: 700, padding: '0 6px' }}>
                        ✓ Cache salvo às {lastCachedAt}
                    </span>
                )}
            </div>

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
                            <h2>Identificação</h2>
                            <div className={styles.idLayout}>
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
                                                Selecionar
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

                                    {character.gameMode === 'pulp' && (
                                        <>
                                            <div className={styles.occupationSelector}>
                                                <label style={{ color: '#991b1b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Zap size={15} /> Arquétipo Pulp
                                                </label>
                                                <div className={styles.occupationDisplay}>
                                                    <input
                                                        type="text"
                                                        value={character.archetype || ''}
                                                        readOnly
                                                        placeholder="Clique para selecionar arquétipo..."
                                                        onClick={() => setShowArchetypeModal(true)}
                                                        style={{ cursor: 'pointer', borderColor: character.archetype ? '#b91c1c' : undefined }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowArchetypeModal(true)}
                                                        className={styles.selectButton}
                                                        style={{ backgroundColor: '#b91c1c', borderColor: '#991b1b', color: '#fff' }}
                                                    >
                                                        Selecionar
                                                    </button>
                                                </div>
                                                {character.archetype && (
                                                    <div className={styles.occupationInfo} style={{ borderLeft: '3px solid #b91c1c' }}>
                                                        <div><strong>Pontos do Arquétipo:</strong> 100 pontos para distribuir</div>
                                                        {(() => {
                                                            const found = archetypes.find(a => a.name === character.archetype);
                                                            if (!found) return null;
                                                            return (
                                                                <>
                                                                    <div><strong>Atributo Núcleo:</strong> {found.coreCharacteristic.join(' ou ')}</div>
                                                                    <div><strong>Perícias do Arquétipo:</strong> {found.skills.join(', ')}</div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className={styles.occupationSelector} style={{ gridColumn: '1 / -1' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <label style={{ color: '#991b1b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Award size={15} /> Talentos Pulp ({character.pulpTalents?.length || 0}/2)
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPulpTalentsModal(true)}
                                                        className={styles.selectButton}
                                                        style={{ backgroundColor: '#b91c1c', borderColor: '#991b1b', color: '#fff', fontSize: '11px', padding: '3px 8px' }}
                                                    >
                                                        {character.pulpTalents && character.pulpTalents.length > 0 ? 'Editar Talentos' : '+ Escolher Talentos'}
                                                    </button>
                                                </div>
                                                {character.pulpTalents && character.pulpTalents.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {character.pulpTalents.map(tId => {
                                                            const t = getTalentById(tId);
                                                            if (!t) return null;
                                                            return (
                                                                <div key={tId} className="bg-red-50/80 dark:bg-zinc-800/80 border border-red-200 dark:border-zinc-700 rounded p-2 text-xs flex-1 min-w-[200px]">
                                                                    <div className="flex items-center justify-between mb-0.5">
                                                                        <span className="font-bold text-red-900 dark:text-red-300">{t.name}</span>
                                                                        <span className="text-[10px] bg-red-100 dark:bg-zinc-700 text-red-800 dark:text-zinc-300 px-1 rounded font-semibold">{t.category}</span>
                                                                    </div>
                                                                    <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-tight">{t.description}</p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-gray-500 italic p-2 bg-gray-50 dark:bg-zinc-900/50 rounded border border-dashed border-gray-300">
                                                        Nenhum talento selecionado. Clique em &quot;+ Escolher Talentos&quot; para adicionar até 2 talentos heróicos.
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
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

                                <label className={styles.photoBox} title="Clique para enviar um retrato">
                                    {character.basicInfo.photo ? (
                                        <img src={character.basicInfo.photo} alt="Retrato do Investigador" />
                                    ) : (
                                        <span>Clique para<br />enviar um retrato</span>
                                    )}
                                    <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                                </label>
                            </div>
                        </section>

                        {/* Características */}
                        <section className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                                <h2 
                                    className={styles.interactiveTitle}
                                    style={{ margin: 0 }}
                                    onClick={() => setPointExplanation('characteristics')}
                                    title="Clique para entender o que são as Características e como rolar seus testes"
                                >
                                    <span>Características</span>
                                    <HelpCircle size={16} className={styles.helpIcon} />
                                </h2>
                                <button
                                    type="button"
                                    className={styles.redButton}
                                    onClick={handleRollAttributes}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                                    title="Rolar aleatoriamente os atributos e a Sorte do personagem"
                                >
                                    <Dices size={15} /> Rolar Atributos
                                </button>
                            </div>
                            <div className="grid grid-4">
                                {Object.entries(character.characteristics).map(([key, value]) => {
                                    const labelMap = {
                                        STR: 'FOR', CON: 'CON', SIZ: 'TAM', DEX: 'DES', APP: 'APP', INT: 'INT', POW: 'POD', EDU: 'EDU'
                                    };
                                    const displayLabel = (labelMap as any)[key] || key;
                                    return (
                                        <div key={key} className={styles.characteristic}>
                                            <label 
                                                onClick={() => setPointExplanation('characteristics')}
                                                style={{ cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: '2px' }}
                                                title={`Clique para entender o atributo ${displayLabel}`}
                                            >
                                                {displayLabel}
                                            </label>
                                            <input
                                                type="number"
                                                value={value}
                                                onChange={(e) => updateCharacteristics(key as keyof Characteristics, parseInt(e.target.value) || 0)}
                                                min="0"
                                                max="100"
                                            />
                                            <div 
                                                className={styles.derivedValues}
                                                onClick={() => setPointExplanation('rolls')}
                                                style={{ cursor: 'pointer' }}
                                                title="Clique para entender ½ (Metade) e ⅕ (Quinto)"
                                            >
                                                <span>½: {Math.floor(value / 2)}</span>
                                                <span>⅕: {Math.floor(value / 5)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
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
                                    <h3 
                                        onClick={() => setPointExplanation('sanity')} 
                                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                        title="Clique para entender as regras de Sanidade"
                                    >
                                        Sanidade (SAN)
                                        <HelpCircle size={13} className={styles.statHelpIcon} />
                                    </h3>
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
                                    <h3 
                                        onClick={() => setPointExplanation('luck')} 
                                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                        title="Clique para entender as regras de Sorte"
                                    >
                                        Moedas da Sorte
                                        <HelpCircle size={13} className={styles.statHelpIcon} />
                                    </h3>
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

                        {character.gameMode === 'pulp' && (
                            <PulpLuckPanel
                                currentLuck={character.derivedStats.currentLUCK ?? character.derivedStats.LUCK ?? 50}
                                hasNineLivesTalent={character.pulpTalents?.includes('vida-de-gato')}
                                onUpdateLuck={(val) => updateDerivedStats('currentLUCK', val)}
                                onExplainLuck={() => setPointExplanation('luck')}
                            />
                        )}

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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                <h2 style={{ margin: 0 }}>Pontos de Perícia</h2>
                                <button
                                    type="button"
                                    onClick={() => setPointExplanation('rolls')}
                                    className={styles.selectButton}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', padding: '5px 12px' }}
                                    title="Clique para entender como funcionam as rolagens no Chamado de Cthulhu (d100)"
                                >
                                    <Dices size={14} /> Como funcionam as Rolagens?
                                </button>
                            </div>
                            <div className={`grid ${character.gameMode === 'pulp' ? 'grid-3' : 'grid-2'}`}>
                                <div 
                                    className={styles.skillPoints}
                                    onClick={() => setPointExplanation('occupation')}
                                    title="Clique para entender os Pontos Ocupacionais e regras de rolagem"
                                >
                                    <HelpCircle size={15} className={styles.cardHelpIcon} />
                                    <div className={styles.cardHeaderArea}>
                                        <h3>Pontos Ocupacionais</h3>
                                    </div>
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

                                {character.gameMode === 'pulp' && (
                                    <div 
                                        className={styles.skillPoints} 
                                        onClick={() => setPointExplanation('archetype')}
                                        style={{ borderLeft: '4px solid #b91c1c' }}
                                        title="Clique para entender o Bônus de Arquétipo (+100 pontos)"
                                    >
                                        <HelpCircle size={15} className={styles.cardHelpIcon} style={{ color: '#b91c1c' }} />
                                        <div className={styles.cardHeaderArea}>
                                            <h3 style={{ color: '#b91c1c' }}>Pontos do Arquétipo</h3>
                                        </div>
                                        <div className={styles.pointsValue} style={{ color: '#b91c1c' }}>100</div>
                                        <small>{character.archetype ? `Arquétipo: ${character.archetype}` : 'Bônus Pulp (+100)'}</small>
                                        <div className={styles.pointsProgress}>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={styles.progressFill}
                                                    style={{
                                                        width: `${Math.min(100, (getTotalArchetypePointsUsed() / 100) * 100)}%`,
                                                        backgroundColor: '#b91c1c'
                                                    }}
                                                />
                                            </div>
                                            <div className={styles.pointsUsed}>
                                                {getTotalArchetypePointsUsed()} / 100 usados
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div 
                                    className={styles.skillPoints}
                                    onClick={() => setPointExplanation('personal')}
                                    title="Clique para entender os Pontos de Interesse Pessoal"
                                >
                                    <HelpCircle size={15} className={styles.cardHelpIcon} />
                                    <div className={styles.cardHeaderArea}>
                                        <h3>Pontos de Interesse Pessoal</h3>
                                    </div>
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

                        {character.gameMode === 'pulp' && (
                            <div style={{ 
                                background: 'var(--paper)', 
                                border: '1.5px solid var(--ink)', 
                                boxShadow: '2px 2px 0 var(--ink)',
                                padding: '8px 12px', 
                                marginBottom: '16px', 
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '8px'
                            }}>
                                <div>
                                    <strong style={{ color: '#b91c1c' }}>Regra Pulp:</strong>{' '}
                                    {character.archetype ? (
                                        <span>
                                            Arquétipo <strong>{character.archetype}</strong> ativo. Perícias marcadas com <strong style={{ color: '#b91c1c' }}>Arq</strong> recebem os 100 pontos.
                                        </span>
                                    ) : (
                                        <span style={{ color: 'var(--mute)' }}>
                                            Nenhum arquétipo selecionado. Selecione um na aba <em>Informações</em> para habilitar os 100 pontos.
                                        </span>
                                    )}
                                </div>
                                <span style={{ fontWeight: 700, color: '#b91c1c', fontSize: '11px' }}>
                                    {getTotalArchetypePointsUsed()} / 100 Arq Usados
                                </span>
                            </div>
                        )}

                        {/* Perícias Ocupacionais */}
                        <section className="card">
                            <div className={styles.sectionHeader}>
                                <h2>
                                    <span
                                        onClick={() => setPointExplanation('occupation')}
                                        className={styles.interactiveTitle}
                                        title="Clique para entender o que são Perícias Ocupacionais e como funcionam as rolagens"
                                    >
                                        <span>Perícias Ocupacionais</span>
                                        <HelpCircle size={16} className={styles.helpIcon} />
                                    </span>
                                    {character.basicInfo.occupation && (
                                        <span style={{ fontSize: '13px', color: 'var(--mute)', fontWeight: 400, marginLeft: '8px', textTransform: 'none' }}>
                                            — {character.basicInfo.occupation}
                                        </span>
                                    )}
                                </h2>
                                {character.basicInfo.occupation && getOccupationByName(character.basicInfo.occupation)?.skillChoices && getOccupationByName(character.basicInfo.occupation)!.skillChoices!.length > 0 && (
                                    <button
                                        type="button"
                                        className={styles.selectButton}
                                        onClick={() => setShowOccupationSkillsModal(true)}
                                    >
                                        + Escolher Perícias Opcionais
                                    </button>
                                )}
                            </div>
                            {!character.basicInfo.occupation ? (
                                <div style={{ textAlign: 'center', padding: '24px 16px', background: 'var(--field)', border: '1.5px dashed var(--ink)' }}>
                                    <p style={{ fontStyle: 'italic', color: 'var(--mute)', marginBottom: '12px', fontSize: '14px' }}>
                                        As <strong>Perícias Ocupacionais</strong> são definidas pela profissão do seu personagem (ex: Médico, Detetive, Soldado, etc.).
                                    </p>
                                    <button
                                        type="button"
                                        className={styles.redButton}
                                        onClick={() => setShowOccupationModal(true)}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 16px' }}
                                    >
                                        <Briefcase size={16} /> Selecionar Ocupação
                                    </button>
                                </div>
                            ) : character.selectedOccupationSkills.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px 16px', background: 'var(--field)', border: '1.5px dashed var(--ink)' }}>
                                    <p style={{ fontStyle: 'italic', color: 'var(--mute)', marginBottom: '10px' }}>
                                        Sua ocupação ({character.basicInfo.occupation}) requer que você selecione suas opções de perícia.
                                    </p>
                                    <button
                                        type="button"
                                        className={styles.redButton}
                                        onClick={() => setShowOccupationSkillsModal(true)}
                                    >
                                        + Escolher Perícias da Ocupação
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.skillsList}>
                                    {character.selectedOccupationSkills.map(skillName => {
                                        const skill = character.skills.find(s => s.name === skillName);
                                        if (!skill) return null;
                                        const totalValue = getSkillTotalValue(skillName);
                                        const needsSpec = isSpecializationSkill(skillName);

                                        const isArch = isArchetypeSkill(skillName) || ((skill.archetypePoints || 0) > 0);

                                        return (
                                            <div key={skillName} className={styles.skillRow}>
                                                <div className={styles.skillInfo}>
                                                    <div style={{ minWidth: 0, overflow: 'hidden', flex: '1 1 auto' }}>
                                                        <span 
                                                            className={styles.skillName} 
                                                            title={`Clique para ler detalhes de ${skillName}`}
                                                            onClick={() => setSelectedSkillForDetail(skillName)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                color: isArch ? '#a11d20' : undefined,
                                                                textDecoration: 'underline dotted',
                                                                textUnderlineOffset: '2px'
                                                            }}
                                                        >
                                                            {skillName}
                                                        </span>
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
                                                </div>
                                                <div className={styles.skillValues}>
                                                    <div className={styles.skillInputGroup}>
                                                        <div className={styles.skillInput}>
                                                            <label
                                                                onClick={() => setPointExplanation('occupation')}
                                                                style={{ cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: '2px' }}
                                                                title="Clique para entender os Pontos Ocupacionais"
                                                            >
                                                                Ocup:
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min={typeof (skill as any).minOccupationPoints === 'number' ? (skill as any).minOccupationPoints : 0}
                                                                max={character.occupationSkillPoints}
                                                                value={skill.occupationPoints === 0 ? '' : skill.occupationPoints}
                                                                placeholder="0"
                                                                onFocus={(e) => e.target.select()}
                                                                onChange={(e) => handleSkillPointChange(skillName, e.target.value, 'occupation')}
                                                            />
                                                        </div>
                                                        {character.gameMode === 'pulp' && (
                                                            <div className={styles.skillInput}>
                                                                <label 
                                                                    onClick={() => setPointExplanation('archetype')}
                                                                    style={{ 
                                                                        color: '#c4302b', 
                                                                        fontWeight: 700,
                                                                        cursor: 'pointer',
                                                                        textDecoration: 'underline dotted',
                                                                        textUnderlineOffset: '2px'
                                                                    }} 
                                                                    title="Clique para entender o Bônus de Arquétipo (+100 pts)"
                                                                >
                                                                    Arq:
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max={100}
                                                                    value={!skill.archetypePoints ? '' : skill.archetypePoints}
                                                                    placeholder="0"
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleSkillPointChange(skillName, e.target.value, 'archetype')}
                                                                    style={{ 
                                                                        borderColor: (skill.archetypePoints || 0) > 0 ? '#b91c1c' : undefined,
                                                                        color: (skill.archetypePoints || 0) > 0 ? '#b91c1c' : undefined,
                                                                        fontWeight: (skill.archetypePoints || 0) > 0 ? 700 : undefined
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        <div className={styles.skillInput}>
                                                            <label
                                                                onClick={() => setPointExplanation('personal')}
                                                                style={{ cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: '2px' }}
                                                                title="Clique para entender os Pontos de Interesse Pessoal"
                                                            >
                                                                Pess:
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={character.personalInterestPoints}
                                                                value={skill.name === 'Nível de Crédito' || !skill.personalPoints ? '' : skill.personalPoints}
                                                                placeholder="0"
                                                                onFocus={(e) => e.target.select()}
                                                                onChange={(e) => handleSkillPointChange(skillName, e.target.value, 'personal')}
                                                                disabled={skill.name === 'Nível de Crédito'}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div 
                                                        className={styles.skillTotal}
                                                        onClick={() => setPointExplanation('rolls')}
                                                        style={{ cursor: 'pointer' }}
                                                        title="Clique para entender os 3 valores: Normal (Total) / Bom (Metade) / Extremo (1/5)"
                                                    >
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
                                <h2>
                                    <span
                                        onClick={() => setPointExplanation('personal')}
                                        className={styles.interactiveTitle}
                                        title="Clique para entender o que são Perícias de Interesse Pessoal e como funcionam as rolagens"
                                    >
                                        <span>Perícias de Interesse Pessoal</span>
                                        <HelpCircle size={16} className={styles.helpIcon} />
                                    </span>
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setPersonalSkillSort(prev => prev === 'name' ? 'value' : 'name')}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            fontSize: '11px',
                                            padding: '4px 10px',
                                            background: 'var(--field)',
                                            border: '1.5px solid var(--ink)',
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            color: 'var(--ink)',
                                            whiteSpace: 'nowrap'
                                        }}
                                        title={personalSkillSort === 'name' ? 'Clique para ordenar por maior valor' : 'Clique para ordenar em ordem alfabética (A-Z)'}
                                    >
                                        {personalSkillSort === 'name' ? (
                                            <>
                                                <ArrowDownAZ size={14} /> Ordem: A-Z
                                            </>
                                        ) : (
                                            <>
                                                <ArrowUpDown size={14} /> Ordem: Maior Valor
                                            </>
                                        )}
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Buscar perícia..."
                                        value={personalSkillSearch}
                                        onChange={(e) => setPersonalSkillSearch(e.target.value)}
                                        className={styles.searchInput}
                                    />
                                </div>
                            </div>
                            <div className={styles.personalSkillsGrid}>
                                {character.skills
                                    .filter(skill =>
                                        !character.selectedOccupationSkills.includes(skill.name) &&
                                        skill.name.toLowerCase().includes(personalSkillSearch.toLowerCase())
                                    )
                                    .sort((a, b) => {
                                        if (personalSkillSort === 'name') {
                                            return a.name.localeCompare(b.name, 'pt-BR');
                                        }
                                        const totalA = a.baseValue + a.occupationPoints + a.personalPoints + (a.archetypePoints || 0);
                                        const totalB = b.baseValue + b.occupationPoints + b.personalPoints + (b.archetypePoints || 0);
                                        if (totalB !== totalA) return totalB - totalA;
                                        return a.name.localeCompare(b.name, 'pt-BR');
                                    })
                                    .map(skill => {

                                        const totalValue = getSkillTotalValue(skill.name);
                                        const needsSpec = isSpecializationSkill(skill.name);

                                        const isArch = isArchetypeSkill(skill.name) || ((skill.archetypePoints || 0) > 0);

                                        return (
                                            <div key={skill.name} className={styles.skillRow}>
                                                <div className={styles.skillInfo}>
                                                    <div style={{ minWidth: 0, overflow: 'hidden', flex: '1 1 auto' }}>
                                                        <span 
                                                            className={styles.skillName} 
                                                            title={`Clique para ler detalhes de ${skill.name}`}
                                                            onClick={() => setSelectedSkillForDetail(skill.name)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                color: isArch ? '#a11d20' : undefined,
                                                                textDecoration: 'underline dotted',
                                                                textUnderlineOffset: '2px'
                                                            }}
                                                        >
                                                            {skill.name}
                                                        </span>
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
                                                </div>
                                                <div className={styles.skillValues}>
                                                    <div className={styles.skillInputGroup}>
                                                        {character.gameMode === 'pulp' && (
                                                            <div className={styles.skillInput}>
                                                                <label 
                                                                    onClick={() => setPointExplanation('archetype')}
                                                                    style={{ 
                                                                        color: '#c4302b', 
                                                                        fontWeight: 700, 
                                                                        cursor: 'pointer',
                                                                        textDecoration: 'underline dotted',
                                                                        textUnderlineOffset: '2px'
                                                                    }} 
                                                                    title="Clique para entender o Bônus de Arquétipo (+100 pts)"
                                                                >
                                                                    Arq:
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max={100}
                                                                    value={!skill.archetypePoints ? '' : skill.archetypePoints}
                                                                    placeholder="0"
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleSkillPointChange(skill.name, e.target.value, 'archetype')}
                                                                    style={{ 
                                                                        borderColor: (skill.archetypePoints || 0) > 0 ? '#b91c1c' : undefined,
                                                                        color: (skill.archetypePoints || 0) > 0 ? '#b91c1c' : undefined,
                                                                        fontWeight: (skill.archetypePoints || 0) > 0 ? 700 : undefined
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        <div className={styles.skillInput}>
                                                            <label
                                                                onClick={() => setPointExplanation('personal')}
                                                                style={{ 
                                                                    cursor: 'pointer', 
                                                                    textDecoration: 'underline dotted', 
                                                                    textUnderlineOffset: '2px' 
                                                                }}
                                                                title="Clique para entender os Pontos de Interesse Pessoal"
                                                            >
                                                                Pess:
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={character.personalInterestPoints}
                                                                value={skill.name === 'Nível de Crédito' || !skill.personalPoints ? '' : skill.personalPoints}
                                                                placeholder="0"
                                                                onFocus={(e) => e.target.select()}
                                                                onChange={(e) => handleSkillPointChange(skill.name, e.target.value, 'personal')}
                                                                disabled={skill.name === 'Nível de Crédito'}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div 
                                                        className={styles.skillTotal}
                                                        onClick={() => setPointExplanation('rolls')}
                                                        style={{ cursor: 'pointer' }}
                                                        title="Clique para entender os 3 valores: Normal (Total) / Bom (Metade) / Extremo (1/5)"
                                                    >
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                                <h2 
                                    className={styles.interactiveTitle}
                                    style={{ margin: 0 }}
                                    onClick={() => setPointExplanation('combat')}
                                    title="Clique para entender como funcionam o combate, iniciativa, esquiva e revide"
                                >
                                    <span>Suas Armas & Combate</span>
                                    <HelpCircle size={16} className={styles.helpIcon} />
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setPointExplanation('rolls')}
                                    className={styles.selectButton}
                                    style={{ fontSize: '11px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Dices size={14} /> Como funcionam os Ataques (d100)
                                </button>
                            </div>

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
                                            {weapon.image && (
                                                <div className={styles.weaponCardIllustration}>
                                                    <img
                                                        src={weapon.image}
                                                        alt={weapon.name}
                                                        className={styles.weaponCardImage}
                                                    />
                                                </div>
                                            )}
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
                                <div>
                                    <label>Equipamento</label>
                                    <textarea
                                        value={character.backstory.equipment || ''}
                                        onChange={(e) => updateBackstory('equipment', e.target.value)}
                                        placeholder="Itens, trajes, documentos, dinheiro..."
                                    />
                                </div>
                                <div>
                                    <label>História / Background (Texto para o PDF)</label>
                                    <textarea
                                        value={character.backstory.narrative || ''}
                                        onChange={(e) => updateBackstory('narrative', e.target.value)}
                                        placeholder="Parágrafos narrando a trajetória do investigador..."
                                    />
                                </div>
                                {/* Ferimentos & Fobias moved to Status section */}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button onClick={handleSave} className={styles.saveButton} disabled={isSaving}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Save size={16} />
                        {isSaving ? 'Salvando...' : 'Salvar Personagem'}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => setShowBookSheetModal(true)}
                    className={styles.saveButton}
                    style={{ background: 'var(--ink)', color: 'var(--paper)' }}
                >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <BookOpen size={16} />
                        Ver / Baixar PDF (Estilo Livro)
                    </span>
                </button>
            </div>

            <details style={{ maxWidth: '980px', margin: '0 auto 28px', padding: '0 14px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                    Backup da ficha (copiar / colar texto JSON)
                </summary>
                <textarea
                    value={backupText}
                    onChange={(e) => setBackupText(e.target.value)}
                    placeholder="O texto JSON da ficha aparece aqui para copiar ou colar..."
                    style={{ minHeight: '110px', fontFamily: 'monospace', fontSize: '12px', margin: '8px 0' }}
                />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => {
                            const json = JSON.stringify(character);
                            setBackupText(json);
                            navigator.clipboard?.writeText(json).catch(() => {});
                        }}
                    >
                        Gerar e Copiar Texto
                    </button>
                    <button
                        type="button"
                        className={styles.redButton}
                        onClick={() => {
                            try {
                                const parsed = JSON.parse(backupText);
                                if (parsed && parsed.basicInfo && parsed.characteristics) {
                                    setCharacter(parsed);
                                    const id = saveCharacter(parsed, characterId);
                                    if (!characterId) setCharacterId(id);
                                    alert('Ficha carregada com sucesso!');
                                } else {
                                    alert('Formato de ficha inválido.');
                                }
                            } catch {
                                alert('Texto JSON inválido.');
                            }
                        }}
                    >
                        Carregar do Texto
                    </button>
                </div>
            </details>

            {/* Occupation Selection Modal */}
            {showOccupationModal && (
                <div className={styles.modalOverlay} onClick={() => setShowOccupationModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Selecionar Ocupação</h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowOccupationModal(false)}
                                aria-label="Fechar"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className={styles.modalSearch}>
                            <input
                                type="text"
                                value={occupationSearch}
                                onChange={(e) => setOccupationSearch(e.target.value)}
                                placeholder="Buscar ocupação..."
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
                        (getOccupationByName(character.basicInfo.occupation)?.skillChoices?.reduce((acc, curr) => acc + curr.count, 0) || 0) + 1
                    ) - character.selectedOccupationSkills.length})`
                    : ''
                    }`}
                maxSelections={
                    character.basicInfo.occupation
                        ? (getOccupationByName(character.basicInfo.occupation)?.suggestedSkills.length || 0) +
                        (getOccupationByName(character.basicInfo.occupation)?.skillChoices?.reduce((acc, curr) => acc + curr.count, 0) || 0) + 1
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

            <BookSheetModal
                isOpen={showBookSheetModal}
                onClose={() => setShowBookSheetModal(false)}
                character={character}
            />

            <ArchetypeSelectorModal
                isOpen={showArchetypeModal}
                onClose={() => setShowArchetypeModal(false)}
                onSelect={handleSelectArchetype}
                currentArchetypeId={archetypes.find(a => a.name === character.archetype)?.id}
            />

            <PulpTalentsModal
                isOpen={showPulpTalentsModal}
                onClose={() => setShowPulpTalentsModal(false)}
                selectedTalents={character.pulpTalents || []}
                onSave={handleSaveTalents}
                maxSelections={2}
            />

            <SkillDetailModal
                isOpen={!!selectedSkillForDetail}
                onClose={() => setSelectedSkillForDetail(null)}
                skillName={selectedSkillForDetail}
                totalValue={selectedSkillForDetail ? getSkillTotalValue(selectedSkillForDetail) : undefined}
                isArchetypeSkill={selectedSkillForDetail ? isArchetypeSkill(selectedSkillForDetail) : false}
            />

            <PointExplanationModal
                type={pointExplanation}
                onClose={() => setPointExplanation(null)}
            />

            {pointWarning && (
                <div
                    role="alert"
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        maxWidth: '400px',
                        width: 'calc(100% - 48px)',
                        background: '#1b1613',
                        color: '#fef2f2',
                        border: '2px solid #b91c1c',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.65)',
                        padding: '12px 14px',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        boxSizing: 'border-box'
                    }}
                >
                    <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1, fontSize: '13px', lineHeight: 1.4 }}>
                        <strong style={{ color: '#f87171', display: 'block', marginBottom: '2px', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                            Limite de Pontos Atingido
                        </strong>
                        {pointWarning.message}
                    </div>
                    <button
                        type="button"
                        onClick={() => setPointWarning(null)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#efe2c3',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        aria-label="Fechar aviso"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
