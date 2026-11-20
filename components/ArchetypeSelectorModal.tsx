'use client';

import { useState, useEffect } from 'react';
import { Zap, X } from 'lucide-react';
import { Archetype } from '@/types/character';
import { archetypes, searchArchetypes } from '@/data/archetypes';
import styles from './CharacterSheet.module.css';

interface ArchetypeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (archetype: Archetype) => void;
  currentArchetypeId?: string;
}

export default function ArchetypeSelectorModal({
  isOpen,
  onClose,
  onSelect,
  currentArchetypeId
}: ArchetypeSelectorModalProps) {
  const [search, setSearch] = useState('');

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

  const filtered = searchArchetypes(search);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        style={{ maxWidth: '750px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color="var(--red)" />
            <h2 style={{ margin: 0 }}>Selecionar Arquétipo (Pulp Cthulhu)</h2>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalSearch}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar arquétipo por nome, perícias ou ocupações..."
            autoFocus
          />
        </div>

        <div className={styles.modalBody} style={{ overflowY: 'auto', flex: 1, padding: '14px' }}>
          <p style={{ fontSize: '12px', color: 'var(--mute)', fontStyle: 'italic', marginBottom: '14px' }}>
            O arquétipo define o estilo de ação heróico do seu personagem, concede <strong>+100 pontos de perícia</strong> nas perícias do arquétipo e sugere talentos compatíveis.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((arch) => {
              const isSelected = currentArchetypeId === arch.id;
              return (
                <div
                  key={arch.id}
                  onClick={() => {
                    onSelect(arch);
                    onClose();
                  }}
                  className={`${styles.occupationCard} ${isSelected ? styles.occupationCardSelected : ''}`}
                  style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={14} color="var(--red)" /> {arch.name}
                      {isSelected && <span style={{ fontSize: '10px', background: 'var(--red)', color: 'var(--on-red)', padding: '2px 6px', fontWeight: 700 }}>Atual</span>}
                    </span>
                    <span style={{ fontSize: '11px', background: 'var(--ink)', color: 'var(--paper)', padding: '2px 6px', fontFamily: 'monospace' }}>
                      Atributo: {arch.coreCharacteristic.join(' ou ')}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--ink)', margin: 0, lineHeight: 1.4 }}>
                    {arch.description}
                  </p>

                  <div style={{ fontSize: '12px', color: 'var(--mute)' }}>
                    <strong style={{ color: 'var(--ink)' }}>Perícias (+100 pts):</strong> {arch.skills.join(', ')}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--mute)' }}>
                    <strong>Ocupações Sugeridas:</strong> {arch.suggestedOccupations.slice(0, 8).join(', ')}{arch.suggestedOccupations.length > 8 ? '...' : ''}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--mute)', fontSize: '14px' }}>
                Nenhum arquétipo encontrado para &quot;{search}&quot;.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
