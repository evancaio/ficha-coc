'use client';

import { useState, useEffect } from 'react';
import { weaponDefinitions, WeaponDefinition } from '@/types/../data/weapons';
import styles from './WeaponSelectorModal.module.css';

interface WeaponSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (weapon: WeaponDefinition) => void;
}

const weaponCategories = [
    'Todos',
    'Corpo a Corpo',
    'Arremesso',
    'Pistolas',
    'Rifles/Arcos',
    'Espingardas',
    'Automáticas',
    'Pesadas'
];

export default function WeaponSelectorModal({
    isOpen,
    onClose,
    onSelect
}: WeaponSelectorModalProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
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

    const filteredWeapons = weaponDefinitions.filter(weapon => {
        const matchesSearch = weapon.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || weapon.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Arsenal</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div style={{ padding: '0 2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Buscar arma..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontFamily: 'Courier Prime, monospace'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {weaponCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: selectedCategory === cat ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)',
                                    border: '1px solid var(--color-gold)',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontFamily: 'Courier Prime, monospace',
                                    whiteSpace: 'nowrap',
                                    fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                                    color: selectedCategory === cat ? 'white' : 'var(--color-sepia-dark)'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.weaponsGrid}>
                        {filteredWeapons.map((weapon, index) => (
                            <div
                                key={index}
                                className={styles.weaponItem}
                                onClick={() => {
                                    onSelect(weapon);
                                    onClose();
                                }}
                            >
                                <div className={styles.weaponName}>{weapon.name}</div>
                                <div className={styles.weaponDetails}>
                                    <span className={styles.detailTag}>{weapon.skill}</span>
                                    <span className={styles.detailTag}>Dano: {weapon.damage}</span>
                                    {weapon.range && <span className={styles.detailTag}>Alcance: {weapon.range}</span>}
                                    {weapon.attacks && <span className={styles.detailTag}>Ataques: {weapon.attacks}</span>}
                                    {weapon.ammo && weapon.ammo !== '-' && <span className={styles.detailTag}>Munição: {weapon.ammo}</span>}
                                </div>
                            </div>
                        ))}
                        {filteredWeapons.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
                                Nenhuma arma encontrada nesta categoria.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
