'use client';

import { useState, useEffect } from 'react';
import { skills, SkillDefinition, skillCategories } from '@/data/skills';
import styles from './SkillSelectorModal.module.css';

interface SkillSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (skillNames: string[]) => void;
    selectedSkills: string[];
    multiSelect?: boolean;
    title: string;
    description?: string;
    maxSelections?: number;
    lockedSkills?: string[];
}

export default function SkillSelectorModal({
    isOpen,
    onClose,
    onSelect,
    selectedSkills,
    multiSelect = true,
    title,
    description,
    maxSelections,
    lockedSkills = []
}: SkillSelectorModalProps) {
    const [search, setSearch] = useState('');
    const [tempSelected, setTempSelected] = useState<string[]>(selectedSkills);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

    useEffect(() => {
        // Ensure locked skills are always included in selection on init
        const uniqueSelected = Array.from(new Set([...selectedSkills, ...lockedSkills]));
        setTempSelected(uniqueSelected);
    }, [selectedSkills, isOpen, lockedSkills]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleToggleSkill = (skillName: string) => {
        if (lockedSkills.includes(skillName)) return; // Cannot toggle locked skills

        if (multiSelect) {
            if (tempSelected.includes(skillName)) {
                setTempSelected(tempSelected.filter(s => s !== skillName));
            } else {
                if (maxSelections && tempSelected.length >= maxSelections) {
                    return; // Prevent selection if limit reached
                }
                setTempSelected([...tempSelected, skillName]);
            }
        } else {
            setTempSelected([skillName]);
        }
    };

    const handleConfirm = () => {
        onSelect(tempSelected);
        onClose();
    };

    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || skill.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <div>
                        <h2>{title}</h2>
                        {description && <p className={styles.description}>{description}</p>}
                    </div>
                    <button className={styles.modalClose} onClick={onClose}>×</button>
                </div>

                <div className={styles.modalFilters}>
                    <input
                        type="text"
                        placeholder="Buscar perícia..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                    <div className={styles.categoryFilters}>
                        <button
                            className={selectedCategory === 'Todas' ? styles.categoryActive : ''}
                            onClick={() => setSelectedCategory('Todas')}
                        >
                            Todas
                        </button>
                        {skillCategories.map(cat => (
                            <button
                                key={cat}
                                className={selectedCategory === cat ? styles.categoryActive : ''}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.modalBody}>
                    {filteredSkills.length === 0 ? (
                        <div className={styles.noResults}>Nenhuma perícia encontrada</div>
                    ) : (
                        <div className={styles.skillGrid}>
                            {filteredSkills.map(skill => {
                                const isSelected = tempSelected.includes(skill.name);
                                const isLocked = lockedSkills.includes(skill.name);
                                const isDisabled = (!isSelected && maxSelections !== undefined && tempSelected.length >= maxSelections) || isLocked;

                                return (
                                    <div
                                        key={skill.name}
                                        className={`${styles.skillCard} ${isSelected ? styles.skillCardSelected : ''} ${isDisabled ? styles.skillCardDisabled : ''}`}
                                        onClick={() => !isDisabled && handleToggleSkill(skill.name)}
                                        style={isDisabled ? { opacity: 0.5, cursor: isLocked ? 'default' : 'not-allowed' } : {}}
                                    >
                                        <div className={styles.skillCardHeader}>
                                            <h3>{skill.name}</h3>
                                            {isSelected && <span className={styles.checkmark}>✓</span>}
                                            {isLocked && <span className={styles.lockIcon} title="Perícia fixa da ocupação">🔒</span>}
                                        </div>
                                        <div className={styles.skillCardDetails}>
                                            <span className={styles.skillCategory}>{skill.category}</span>
                                            <span className={styles.skillBase}>Base: {skill.baseValue}%</span>
                                        </div>
                                        {skill.requiresSpecialization && (
                                            <span className={styles.specializationBadge}>Especialização</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <div className={styles.selectedCount}>
                        {tempSelected.length} perícia(s) selecionada(s)
                        {maxSelections && ` (Máximo: ${maxSelections})`}
                    </div>
                    <div className={styles.modalActions}>
                        <button className={styles.cancelButton} onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            className={styles.confirmButton}
                            onClick={handleConfirm}
                            disabled={maxSelections !== undefined && tempSelected.length !== maxSelections}
                            style={maxSelections !== undefined && tempSelected.length !== maxSelections ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
