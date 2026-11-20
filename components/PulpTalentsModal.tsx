'use client';

import { useState, useEffect } from 'react';
import { Award, X } from 'lucide-react';
import { PulpTalent } from '@/types/character';
import { pulpTalents } from '@/data/pulpTalents';
import styles from './CharacterSheet.module.css';

interface PulpTalentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTalents: string[];
  onSave: (talents: string[]) => void;
  maxSelections?: number;
}

export default function PulpTalentsModal({
  isOpen,
  onClose,
  selectedTalents,
  onSave,
  maxSelections = 2
}: PulpTalentsModalProps) {
  const [currentSelected, setCurrentSelected] = useState<string[]>(selectedTalents);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setCurrentSelected(selectedTalents);
  }, [selectedTalents, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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

  const categories = ['Todas', 'Físico', 'Mental', 'Combate', 'Diversos'];

  const filtered = pulpTalents.filter((t) => {
    const matchesCat = activeCategory === 'Todas' || t.category === activeCategory;
    const matchesSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleTalent = (id: string) => {
    if (currentSelected.includes(id)) {
      setCurrentSelected(currentSelected.filter((t) => t !== id));
    } else {
      if (currentSelected.length >= maxSelections) {
        // Replace oldest or alert limit
        return;
      }
      setCurrentSelected([...currentSelected, id]);
    }
  };

  const handleConfirm = () => {
    onSave(currentSelected);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ maxWidth: '820px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="var(--red)" />
            <h2 style={{ margin: 0 }}>Selecionar Talentos Pulp</h2>
            <span style={{ fontSize: '11px', background: 'var(--red)', color: 'var(--on-red)', fontWeight: 700, padding: '2px 8px', marginLeft: '8px' }}>
              {currentSelected.length} / {maxSelections} Selecionados
            </span>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        {/* Filter categories & search */}
        <div style={{ padding: '12px 14px', borderBottom: '1.5px solid var(--ink)', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--field)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontSize: '11px',
                  padding: '5px 12px',
                  background: activeCategory === cat ? 'var(--red)' : 'var(--paper)',
                  color: activeCategory === cat ? 'var(--on-red)' : 'var(--ink)',
                  border: '1px solid var(--ink)',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar talento por nome ou efeito..."
            style={{ width: '100%' }}
          />
        </div>

        <div className={styles.modalBody} style={{ overflowY: 'auto', flex: 1, padding: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '10px' }}>
            {filtered.map((talent) => {
              const isChecked = currentSelected.includes(talent.id);
              const isDisabled = !isChecked && currentSelected.length >= maxSelections;

              return (
                <div
                  key={talent.id}
                  onClick={() => !isDisabled && toggleTalent(talent.id)}
                  className={`${styles.occupationCard} ${isChecked ? styles.occupationCardSelected : ''}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: isDisabled ? 0.45 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isDisabled}
                          onChange={() => {}}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                        {talent.name}
                      </span>
                      <span style={{ fontSize: '10px', background: 'var(--ink)', color: 'var(--paper)', padding: '2px 6px', fontWeight: 700 }}>
                        {talent.category}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--ink)', margin: 0, paddingLeft: '22px', lineHeight: 1.4 }}>
                      {talent.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '12px 14px', borderTop: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--paper)', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--mute)', fontWeight: 700 }}>
            {currentSelected.length < maxSelections
              ? `Selecione mais ${maxSelections - currentSelected.length} talento(s)`
              : 'Limite máximo de 2 talentos atingido'}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'var(--field)', color: 'var(--ink)', border: '1.5px solid var(--ink)', padding: '8px 14px', fontSize: '12px' }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={styles.redButton}
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              Confirmar Talentos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
