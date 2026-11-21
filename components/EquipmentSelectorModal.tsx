'use client';

import { useState, useEffect } from 'react';
import { equipmentTemplates, EquipmentTemplate } from '@/data/equipment';
import { InventoryItem } from '@/types/character';
import styles from './EquipmentSelectorModal.module.css';

interface EquipmentSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (item: Omit<InventoryItem, 'id'>) => void;
}

const categories = [
    'Todos',
    'Sobrevivência',
    'Investigação',
    'Médico',
    'Ferramentas',
    'Documentos'
];

const categoryColors: Record<string, { bg: string; color: string; border: string }> = {
    'Sobrevivência': { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
    'Investigação': { bg: '#e0f2fe', color: '#075985', border: '#38bdf8' },
    'Médico': { bg: '#dcfce7', color: '#166534', border: '#4ade80' },
    'Ferramentas': { bg: '#f3f4f6', color: '#374151', border: '#9ca3af' },
    'Documentos': { bg: '#fee2e2', color: '#991b1b', border: '#f87171' },
    'Geral': { bg: '#f5f5f4', color: '#44403c', border: '#a8a29e' }
};

export default function EquipmentSelectorModal({
    isOpen,
    onClose,
    onAdd
}: EquipmentSelectorModalProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showCustomForm, setShowCustomForm] = useState(false);

    // Custom item form state
    const [customName, setCustomName] = useState('');
    const [customQty, setCustomQty] = useState(1);
    const [customCategory, setCustomCategory] = useState<InventoryItem['category']>('Geral');
    const [customDesc, setCustomDesc] = useState('');
    const [customWeight, setCustomWeight] = useState('');

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

    const filteredItems = equipmentTemplates.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());
        const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
        return matchesSearch && matchesCat;
    });

    const handleAddTemplate = (template: EquipmentTemplate) => {
        onAdd({
            name: template.name,
            quantity: template.defaultQty || 1,
            category: template.category,
            description: template.description,
            weightOrBulk: template.weightOrBulk
        });
        onClose();
    };

    const handleAddCustom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customName.trim()) return;

        onAdd({
            name: customName.trim(),
            quantity: Math.max(1, customQty),
            category: customCategory,
            description: customDesc.trim() || undefined,
            weightOrBulk: customWeight.trim() || undefined
        });

        setCustomName('');
        setCustomQty(1);
        setCustomDesc('');
        setCustomWeight('');
        setShowCustomForm(false);
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Equipamentos & Suprimentos de Campo</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">✕</button>
                </div>

                <div className={styles.subHeader}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="Buscar equipamentos, lanternas, kits, ferramentas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowCustomForm(prev => !prev)}
                            className={styles.catButton}
                            style={{
                                background: showCustomForm ? 'var(--red, #b91c1c)' : '#ffffff',
                                color: showCustomForm ? '#ffffff' : 'var(--ink, #1b1613)',
                                borderColor: showCustomForm ? 'var(--red, #b91c1c)' : 'var(--ink, #1b1613)'
                            }}
                        >
                            {showCustomForm ? 'Fechar Formulário' : '+ Item Personalizado'}
                        </button>
                    </div>

                    <div className={styles.categoriesBar}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                className={`${styles.catButton} ${selectedCategory === cat ? styles.catButtonActive : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.content}>
                    {showCustomForm && (
                        <form onSubmit={handleAddCustom} className={styles.customFormCard}>
                            <div className={styles.customFormTitle}>Cadastrar Item Personalizado</div>
                            <div className={styles.customFormGrid}>
                                <input
                                    type="text"
                                    placeholder="Nome do item (ex: Caderno Cifrado, Máscara de Gás...)"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    className={styles.customInput}
                                    required
                                />
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Qtd"
                                    value={customQty}
                                    onChange={(e) => setCustomQty(parseInt(e.target.value) || 1)}
                                    className={styles.customInput}
                                />
                                <select
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value as any)}
                                    className={styles.customInput}
                                >
                                    <option value="Sobrevivência">Sobrevivência</option>
                                    <option value="Investigação">Investigação</option>
                                    <option value="Médico">Médico</option>
                                    <option value="Ferramentas">Ferramentas</option>
                                    <option value="Documentos">Documentos</option>
                                    <option value="Geral">Geral</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Peso / Volume (ex: 0.5 kg, Leve, Médio...)"
                                    value={customWeight}
                                    onChange={(e) => setCustomWeight(e.target.value)}
                                    className={styles.customInput}
                                />
                                <input
                                    type="text"
                                    placeholder="Descrição ou efeito (opcional)"
                                    value={customDesc}
                                    onChange={(e) => setCustomDesc(e.target.value)}
                                    className={styles.customInput}
                                />
                            </div>
                            <button type="submit" className={styles.customBtn}>
                                + Adicionar ao Inventário
                            </button>
                        </form>
                    )}

                    <div className={styles.grid}>
                        {filteredItems.map((item, idx) => {
                            const badgeStyle = categoryColors[item.category] || categoryColors['Geral'];
                            return (
                                <div
                                    key={idx}
                                    className={styles.itemCard}
                                    onClick={() => handleAddTemplate(item)}
                                >
                                    <div>
                                        <div className={styles.itemHeader}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            <span
                                                className={styles.itemCatBadge}
                                                style={{
                                                    backgroundColor: badgeStyle.bg,
                                                    color: badgeStyle.color,
                                                    borderColor: badgeStyle.border
                                                }}
                                            >
                                                {item.category}
                                            </span>
                                        </div>
                                        <p className={styles.itemDesc}>{item.description}</p>
                                    </div>
                                    <div className={styles.itemFooter}>
                                        <span>{item.weightOrBulk ? `Peso: ${item.weightOrBulk}` : 'Qtd padrão: 1'}</span>
                                        <button type="button" className={styles.addBtn}>+ Equipar</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
