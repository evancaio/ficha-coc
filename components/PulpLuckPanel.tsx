'use client';

import { useState } from 'react';
import { Clover, HelpCircle } from 'lucide-react';
import { pulpLuckOptions, canAffordLuckSpend, executeLuckSpend, PulpLuckOption } from '@/utils/pulpLuck';
import styles from './PulpLuckPanel.module.css';

interface PulpLuckPanelProps {
  currentLuck: number;
  maxLuck?: number;
  hasNineLivesTalent?: boolean;
  onUpdateLuck: (newLuck: number) => void;
  onExplainLuck?: () => void;
}

export default function PulpLuckPanel({
  currentLuck,
  maxLuck = 99,
  hasNineLivesTalent = false,
  onUpdateLuck,
  onExplainLuck
}: PulpLuckPanelProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSpend = (opt: PulpLuckOption) => {
    if (!canAffordLuckSpend(currentLuck, opt, hasNineLivesTalent)) {
      setFeedback(`Sorte insuficiente para: ${opt.name}`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    if (opt.cost === 'all') {
      const confirmSpend = window.confirm(
        'Tem certeza que deseja QUEIMAR TODA A SUA SORTE para escapar da morte certa? Sua Sorte será reduzida a 0!'
      );
      if (!confirmSpend) return;
    }

    const next = executeLuckSpend(currentLuck, opt, hasNineLivesTalent);
    onUpdateLuck(next);
    setFeedback(`Gastou Sorte: ${opt.name}! Sorte restante: ${next}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Clover size={20} color="var(--red)" />
          <h3 
            className={styles.title} 
            onClick={onExplainLuck} 
            style={{ cursor: onExplainLuck ? 'pointer' : 'default', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Clique para entender as regras de Sorte Pulp"
          >
            Mecânicas de Sorte Pulp
            {onExplainLuck && (
              <HelpCircle size={15} className={styles.luckHelpIcon} />
            )}
          </h3>
        </div>
        <div className={styles.luckBadge}>
          <span className={styles.luckLabel}>Sorte Atual:</span>
          <input
            type="number"
            min={0}
            max={maxLuck}
            value={currentLuck}
            onChange={(e) => onUpdateLuck(Math.max(0, Math.min(maxLuck, parseInt(e.target.value) || 0)))}
            className={styles.luckInput}
          />
          <span className={styles.luckMax}>/ {maxLuck}</span>
        </div>
      </div>

      <p className={styles.description}>
        Em <em>Pulp Cthulhu</em>, a Sorte é gasta ativamente para realizar feitos heroicos e escapar da morte.
      </p>

      {/* Quick Spend Buttons */}
      <div className={styles.grid}>
        {pulpLuckOptions.map((opt) => {
          const canAfford = canAffordLuckSpend(currentLuck, opt, hasNineLivesTalent);
          const isDeath = opt.cost === 'all';

          return (
            <button
              key={opt.id}
              type="button"
              disabled={!canAfford}
              onClick={() => handleSpend(opt)}
              className={`${styles.optionButton} ${isDeath ? styles.optionDeath : ''}`}
            >
              <div className={styles.optionTop}>
                <span className={styles.optionName}>
                  {opt.name}
                </span>
                <span
                  className={`${styles.costBadge} ${isDeath ? styles.costBadgeDeath : ''}`}
                >
                  {isDeath ? (hasNineLivesTalent ? '20 Sorte' : 'Toda Sorte') : `-${opt.cost}`}
                </span>
              </div>
              <p className={styles.optionDesc}>
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={styles.feedback}>
          {feedback}
        </div>
      )}
    </div>
  );
}
