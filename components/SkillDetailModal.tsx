'use client';

import { useEffect } from 'react';
import { X, BookOpen, Sparkles, AlertTriangle } from 'lucide-react';
import { getSkillDescription, SkillDetail } from '@/data/skillDescriptions';
import styles from './CharacterSheet.module.css';

interface SkillDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string | null;
  totalValue?: number;
  isArchetypeSkill?: boolean;
}

export default function SkillDetailModal({
  isOpen,
  onClose,
  skillName,
  totalValue,
  isArchetypeSkill
}: SkillDetailModalProps) {
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

  if (!isOpen || !skillName) return null;

  const detail: SkillDetail = getSkillDescription(skillName);
  const currentTotal = totalValue ?? (typeof detail.baseValue === 'number' ? detail.baseValue : 0);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ maxWidth: '640px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <BookOpen size={20} color="var(--red)" />
            <h2 style={{ margin: 0 }}>{detail.name}</h2>
            <span style={{ fontSize: '11px', background: 'var(--ink)', color: 'var(--paper)', padding: '2px 8px', fontWeight: 700 }}>
              {detail.category}
            </span>
            {isArchetypeSkill && (
              <span style={{ fontSize: '11px', background: 'var(--red)', color: 'var(--on-red)', padding: '2px 8px', fontWeight: 700 }}>
                Perícia do Arquétipo
              </span>
            )}
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        {/* Success Levels Tracker */}
        <div style={{ padding: '12px 16px', background: 'var(--field)', borderBottom: '2px solid var(--ink)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--mute)', textTransform: 'uppercase' }}>Sucesso Regular</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>{currentTotal}%</div>
            <div style={{ fontSize: '10px', color: 'var(--mute)' }}>1 até {currentTotal}</div>
          </div>
          <div style={{ width: '1px', height: '36px', background: 'var(--ink)', opacity: 0.2 }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--mute)', textTransform: 'uppercase' }}>Sucesso Bom (½)</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--red)' }}>{Math.floor(currentTotal / 2)}%</div>
            <div style={{ fontSize: '10px', color: 'var(--mute)' }}>1 até {Math.floor(currentTotal / 2)}</div>
          </div>
          <div style={{ width: '1px', height: '36px', background: 'var(--ink)', opacity: 0.2 }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--mute)', textTransform: 'uppercase' }}>Extremo (⅕)</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#8f1f1b' }}>{Math.floor(currentTotal / 5)}%</div>
            <div style={{ fontSize: '10px', color: 'var(--mute)' }}>1 até {Math.floor(currentTotal / 5)}</div>
          </div>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody} style={{ overflowY: 'auto', flex: 1, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Main Description */}
          <div>
            <h3 style={{ font: '700 13px/1 "PT Serif", serif', color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Descrição da Perícia
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--ink)', margin: 0 }}>
              {detail.description}
            </p>
          </div>

          {/* Pulp Notes */}
          {detail.pulpNote && (
            <div style={{ background: 'rgba(196, 48, 43, 0.08)', borderLeft: '4px solid var(--red)', padding: '8px 12px' }}>
              <strong style={{ color: 'var(--red)', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} /> Regra Pulp Cthulhu:
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--ink)', margin: '4px 0 0', lineHeight: 1.4 }}>
                {detail.pulpNote}
              </p>
            </div>
          )}

          {/* Examples of Use */}
          {detail.examples && detail.examples.length > 0 && (
            <div>
              <h3 style={{ font: '700 13px/1 "PT Serif", serif', color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Exemplos de Aplicação
              </h3>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>
                {detail.examples.map((ex, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pushed Roll Consequences */}
          {detail.pushConsequence && (
            <div style={{ background: 'var(--field)', border: '1px solid var(--ink)', padding: '10px 12px' }}>
              <strong style={{ color: 'var(--mute)', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
                <AlertTriangle size={14} color="var(--red)" /> Consequência de Forçar Teste:
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--ink)', margin: '4px 0 0', lineHeight: 1.4, fontStyle: 'italic' }}>
                {detail.pushConsequence}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 16px', borderTop: '2px solid var(--ink)', display: 'flex', justifyContent: 'flex-end', background: 'var(--paper)' }}>
          <button
            type="button"
            onClick={onClose}
            className={styles.redButton}
            style={{ padding: '7px 18px', fontSize: '12px' }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
