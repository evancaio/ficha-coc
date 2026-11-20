'use client';

import { useEffect } from 'react';
import { X, Zap, BookOpen, Briefcase } from 'lucide-react';
import styles from './CharacterSheet.module.css';

interface PointExplanationModalProps {
  type: 'archetype' | 'personal' | 'occupation' | null;
  onClose: () => void;
}

export default function PointExplanationModal({ type, onClose }: PointExplanationModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [type, onClose]);

  if (!type) return null;

  const contentMap = {
    archetype: {
      icon: <Zap size={22} color="#c4302b" />,
      title: 'Bônus de Arquétipo (Arq)',
      badge: '+100 Pontos Bônus · Pulp Cthulhu',
      badgeStyle: { background: '#c4302b', color: '#f6ead0' },
      summary: 'Os 100 pontos bônus que transformam um investigador comum em um Herói Pulp destemido.',
      paragraphs: [
        'Em Pulp Cthulhu, os heróis são maiores que a vida! Ao criar seu personagem, você ganha 100 pontos adicionais concedidos exclusivamente pelo seu Arquétipo heroico (como Atirador, Bon Vivant, Detetive Hard-Boiled, Cientista, etc.).',
        'Estes pontos representam reflexos extraordinários, treinamento de elite ou sorte implacável adquiridos na sua vida de perigo e aventura.',
        'Regra recomendada: As perícias do seu Arquétipo são as sugeridas oficialmente, mas você pode alocar esses 100 pontos conforme a necessidade da sua criação.'
      ]
    },
    personal: {
      icon: <BookOpen size={22} color="#1b1613" />,
      title: 'Pontos de Interesse Pessoal (Pess)',
      badge: 'INT × 2 Pontos · Hobbies e Vida',
      badgeStyle: { background: '#1b1613', color: '#efe2c3' },
      summary: 'Habilidades desenvolvidas fora do trabalho, através de hobbies, viagens e vivências.',
      paragraphs: [
        'Os Pontos de Interesse Pessoal são calculados multiplicando o atributo Inteligência (INT) do seu personagem por 2.',
        'Eles representam tudo o que o seu personagem aprendeu por curiosidade, lazer ou necessidade ao longo da vida: aprender a nadar, atirar no clube de caça, ler em outra língua, dirigir em viagens ou estudar história antiga.',
        'Você pode investir esses pontos em praticamente qualquer perícia na lista de Interesse Pessoal (com exceção de Nível de Crédito, que é restrito à ocupação).'
      ]
    },
    occupation: {
      icon: <Briefcase size={22} color="#2a9d8f" />,
      title: 'Pontos Ocupacionais (Ocup)',
      badge: 'EDU × 4 (ou fórmula) · Carreira',
      badgeStyle: { background: '#2a9d8f', color: '#ffffff' },
      summary: 'A formação profissional formal e o ganha-pão do seu investigador.',
      paragraphs: [
        'Os Pontos Ocupacionais são calculados com base na sua Educação (EDU × 4) ou na fórmula específica da sua Ocupação (por exemplo, Médicos usam EDU × 4, enquanto Soldados usam EDU × 2 + FOR ou DES × 2).',
        'Estes pontos devem ser investidos estritamente nas perícias listadas na seção de Perícias Ocupacionais da sua profissão.',
        'Eles representam anos de faculdade, estágio, aprendizado de ofício ou trabalho diário na sua carreira.'
      ]
    }
  };

  const item = contentMap[type];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ maxWidth: '520px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {item.icon}
            <h2 style={{ margin: 0, fontSize: '18px' }}>{item.title}</h2>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', letterSpacing: '0.05em', ...item.badgeStyle }}>
              {item.badge}
            </span>
          </div>

          <p style={{ fontStyle: 'italic', color: 'var(--ink)', fontSize: '14px', margin: 0, fontWeight: 700 }}>
            {item.summary}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', lineHeight: 1.5, color: 'var(--ink)' }}>
            {item.paragraphs.map((p, idx) => (
              <p key={idx} style={{ margin: 0 }}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 18px', borderTop: '2px solid var(--ink)', display: 'flex', justifyContent: 'flex-end', background: 'var(--paper)' }}>
          <button
            type="button"
            onClick={onClose}
            className={styles.redButton}
            style={{ padding: '7px 18px', fontSize: '12px' }}
          >
            Entendi!
          </button>
        </div>
      </div>
    </div>
  );
}
