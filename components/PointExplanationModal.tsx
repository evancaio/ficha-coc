'use client';

import { useEffect } from 'react';
import { 
  X, 
  Zap, 
  BookOpen, 
  Briefcase, 
  Dices, 
  Shield, 
  Heart, 
  Clover, 
  Brain, 
  Swords, 
  HelpCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import styles from './CharacterSheet.module.css';

export type ExplanationType = 
  | 'occupation'
  | 'personal'
  | 'archetype'
  | 'rolls'
  | 'characteristics'
  | 'luck'
  | 'sanity'
  | 'combat'
  | null;

interface PointExplanationModalProps {
  type: ExplanationType;
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

  const contentMap: Record<string, {
    icon: React.ReactNode;
    title: string;
    badge: string;
    badgeStyle: React.CSSProperties;
    summary: string;
    sections: Array<{
      subtitle?: string;
      content: string | React.ReactNode;
    }>;
  }> = {
    occupation: {
      icon: <Briefcase size={22} color="#2a9d8f" />,
      title: 'Perícias Ocupacionais & Regras de Rolagem',
      badge: 'EDU × 4 (ou fórmula) · Carreira & Rolagens d100',
      badgeStyle: { background: '#2a9d8f', color: '#ffffff' },
      summary: 'A formação profissional formal do seu investigador e o guia completo de como rolar testes no sistema.',
      sections: [
        {
          subtitle: '1. O que são as Perícias Ocupacionais?',
          content: 'As Perícias Ocupacionais representam os anos de estudo, faculdade, estágio ou trabalho prático na carreira do seu personagem (médico, detetive, soldado, jornalista, professor, etc.). Os pontos devem ser investidos estritamente nas perícias permitidas pela sua ocupação.'
        },
        {
          subtitle: '2. Como funcionam as Rolagens de Teste (D100)?',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ margin: 0 }}>
                Todas as ações no Chamado de Cthulhu são resolvidas rolando <strong>1D100</strong> (dois dados de 10 faces: um para dezenas e outro para unidades, gerando de 01 a 100).
              </p>
              <p style={{ margin: 0, fontWeight: 700, color: '#991b1b' }}>
                Regra de Ouro: Para ter sucesso, o resultado do dado deve ser MENOR OU IGUAL (≤) ao valor da sua perícia!
              </p>
            </div>
          )
        },
        {
          subtitle: '3. Os Três Níveis de Sucesso (Valores na Ficha)',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ padding: '6px 10px', background: 'var(--paper)', border: '1px solid var(--ink)', borderRadius: '4px' }}>
                <strong>• Sucesso Regular (Valor Total, ex: 60%):</strong> Se tirar ≤ 60. Sucesso padrão em tarefas rotineiras ou em condições normais.
              </div>
              <div style={{ padding: '6px 10px', background: 'var(--paper)', border: '1px solid var(--ink)', borderRadius: '4px' }}>
                <strong>• Sucesso Bom / Difícil (Metade, ex: 30%):</strong> Se tirar ≤ 30. Exigido pelo Guardião quando a tarefa é desafiadora, sob pressão temporal, na escuridão, com equipamento improvisado ou contra oponentes hábeis.
              </div>
              <div style={{ padding: '6px 10px', background: 'var(--paper)', border: '1px solid var(--ink)', borderRadius: '4px' }}>
                <strong>• Sucesso Extremo (Quinto, ex: 12%):</strong> Se tirar ≤ 12. Um feito espetacular e genial! Em combate, causa dano máximo e empalação.
              </div>
            </div>
          )
        },
        {
          subtitle: '4. Críticos, Desastres e Forçar o Teste',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ margin: 0 }}>
                <strong>• Crítico (01):</strong> Sempre é o melhor resultado possível, concedendo vantagens narrativas imediatas.
              </p>
              <p style={{ margin: 0 }}>
                <strong>• Desastre / Fumble (96 a 100, ou 100 se perícia ≥ 50%):</strong> Fracasso catastrófico! A arma emperra, a chave quebra dentro da fechadura ou um alarme dispara.
              </p>
              <p style={{ margin: 0 }}>
                <strong>• Forçar o Teste (Pushed Roll):</strong> Se falhar em um teste fora de combate, o jogador pode tentar de novo justificando uma ação mais arriscada. Mas atenção: se falhar no teste forçado, o Guardião impõe uma consequência gravíssima!
              </p>
            </div>
          )
        }
      ]
    },

    personal: {
      icon: <BookOpen size={22} color="#1b1613" />,
      title: 'Perícias de Interesse Pessoal (Pess)',
      badge: 'INT × 2 Pontos · Hobbies, Vivência e Lazer',
      badgeStyle: { background: '#1b1613', color: '#efe2c3' },
      summary: 'Habilidades desenvolvidas fora da carreira através de hobbies, viagens, curiosidade e vivências.',
      sections: [
        {
          subtitle: 'O que representam?',
          content: 'Os Pontos de Interesse Pessoal são calculados multiplicando a Inteligência (INT) do seu personagem por 2. Eles representam tudo que seu personagem aprendeu por curiosidade ou necessidade ao longo da vida: aprender a nadar, atirar no clube de tiro, falar outro idioma, dirigir em viagens, estudar história ou arrombar fechaduras.'
        },
        {
          subtitle: 'Onde podem ser investidos?',
          content: 'Podem ser colocados em qualquer perícia da lista, com exceção de Nível de Crédito (que é estritamente ligado à renda ocupacional da profissão).'
        },
        {
          subtitle: 'Como são testadas em jogo?',
          content: 'Exatamente igual às perícias ocupacionais: rola-se 1D100 e compara-se com o valor total (sucesso normal), metade (sucesso difícil) e um quinto (sucesso extremo).'
        }
      ]
    },

    archetype: {
      icon: <Zap size={22} color="#c4302b" />,
      title: 'Bônus de Arquétipo (Arq)',
      badge: '+100 Pontos Bônus · Regras de Pulp Cthulhu',
      badgeStyle: { background: '#c4302b', color: '#f6ead0' },
      summary: 'Os 100 pontos heróicos que transformam um investigador comum em um Herói Pulp audacioso.',
      sections: [
        {
          subtitle: 'O poder dos Heróis de Ação',
          content: 'No suplemento Pulp Cthulhu, os personagens são maiores que a vida! Ao escolher um Arquétipo (como Atirador, Bon Vivant, Detetive Durão, Cientista Ocultista, Pugilista, etc.), você ganha +100 pontos adicionais para distribuir em perícias.'
        },
        {
          subtitle: 'Perícias do Arquétipo',
          content: 'Cada arquétipo traz uma lista de perícias sugeridas (destacadas na ficha com o bônus Arq). Esses 100 pontos representam o treinamento extremo ou o talento nato do herói.'
        },
        {
          subtitle: 'Gasto de Sorte no Pulp',
          content: 'Diferente do jogo tradicional, heróis Pulp podem gastar pontos da sua reserva de Sorte atual para diminuir o resultado de uma rolagem de perícia e transformá-la em sucesso!'
        }
      ]
    },

    rolls: {
      icon: <Dices size={22} color="#991b1b" />,
      title: 'Guia Completo de Rolagens (D100)',
      badge: 'Regra Central do Chamado de Cthulhu 7ª Edição',
      badgeStyle: { background: '#991b1b', color: '#ffffff' },
      summary: 'Tudo o que você precisa saber sobre o sistema percentual (d100), sucessos e modificadores de rolagem.',
      sections: [
        {
          subtitle: 'Como funciona a rolagem?',
          content: 'O jogador rola dois dados de 10 faces (d100). Um dado representa a dezena (00, 10, 20...) e o outro a unidade (0 a 9). Se você rolar um número menor ou igual ao valor da sua perícia, obteve sucesso!'
        },
        {
          subtitle: 'Os 3 valores na sua ficha (ex: 60% / 30% / 12%)',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>• Normal (60%):</strong> Qualquer resultado de 02 a 60. Sucesso padrão.</div>
              <div><strong>• Difícil (30%):</strong> Metade do valor. Tarefas com alto grau de dificuldade ou oponentes perigosos.</div>
              <div><strong>• Extremo (12%):</strong> Um quinto (1/5) do valor. Sucesso magistral, o melhor que a habilidade humana pode alcançar.</div>
            </div>
          )
        },
        {
          subtitle: 'Dados de Bônus e Penalidade',
          content: 'Quando as condições são especialmente favoráveis, o Guardião pode conceder um Dado de Bônus (rola-se um dado de dezena extra e escolhe-se o menor). Em condições desfavoráveis, rola-se um Dado de Penalidade (escolhe-se o maior dado de dezena).'
        },
        {
          subtitle: 'Forçar o Teste (Pushed Roll)',
          content: 'Falhou em uma investigação ou tentativa de fuga? O jogador pode declarar que está "forçando o teste", detalhando o que fará de diferente. Se falhar na segunda tentativa, as consequências são desastrosas para o grupo!'
        }
      ]
    },

    characteristics: {
      icon: <Brain size={22} color="#1b1613" />,
      title: 'Características dos Investigadores',
      badge: 'FOR · CON · TAM · DES · APA · INT · POD · EDU',
      badgeStyle: { background: '#1b1613', color: '#efe2c3' },
      summary: 'Os 8 atributos básicos que definem o físico, a mente e a personalidade do seu personagem.',
      sections: [
        {
          subtitle: 'O que representa cada atributo?',
          content: (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
              <div><strong>• FOR (Força):</strong> Potência muscular pura, capacidade de levantar peso e dano corpo-a-corpo.</div>
              <div><strong>• CON (Constituição):</strong> Saúde, resistência a venenos, doenças e fadiga física.</div>
              <div><strong>• TAM (Tamanho):</strong> Altura e massa corporal (define PV e bônus de dano).</div>
              <div><strong>• DES (Destreza):</strong> Agilidade, reflexos e velocidade de reação em combate.</div>
              <div><strong>• APA (Aparência):</strong> Charme, presença visual, liderança e atratividade pessoal.</div>
              <div><strong>• INT (Inteligência):</strong> Raciocínio lógico, dedução e percepção de pistas.</div>
              <div><strong>• POD (Poder):</strong> Força de vontade, presença espiritual e base da Sanidade inicial.</div>
              <div><strong>• EDU (Educação):</strong> Conhecimento formal, anos de estudo e cultura geral.</div>
            </div>
          )
        },
        {
          subtitle: 'Testes de Atributo',
          content: 'Assim como perícias, atributos também são testados com 1D100! Por exemplo, para arrombar uma porta pesada rola-se contra FOR; para resistir a um veneno rola-se contra CON.'
        }
      ]
    },

    luck: {
      icon: <Clover size={22} color="#15803d" />,
      title: 'Mecânica de Sorte (LUCK)',
      badge: 'Recurso de Sobrevivência · Clássico vs Pulp Cthulhu',
      badgeStyle: { background: '#15803d', color: '#ffffff' },
      summary: 'A proteção do destino que separa o investigador do caixão nos momentos mais desesperadores.',
      sections: [
        {
          subtitle: 'Sorte no Jogo Clássico',
          content: 'No Chamado de Cthulhu tradicional, o Guardião pede um "Teste de Sorte" (d100 ≤ Sorte) quando o resultado depende puramente do acaso: se a lanterna ainda tem pilha, se o carro tem gasolina ou se a criatura escolhe atacar você ou o colega ao lado.'
        },
        {
          subtitle: 'Gasto de Sorte no Pulp Cthulhu',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ margin: 0 }}>
                No Pulp Cthulhu, a Sorte é uma <strong>moeda de troca vital</strong> que você gasta ponto a ponto:
              </p>
              <div><strong>• Ajustar Testes:</strong> Se você rolou 45 em uma perícia de 40, pode gastar 5 pontos de Sorte para transformar em sucesso!</div>
              <div><strong>• Evitar Ferimento Grave:</strong> Gastando pontos de Sorte é possível amenizar o dano recebido.</div>
              <div><strong>• Fugir da Morte Certa:</strong> Gastando toda a sua Sorte restante (mínimo de 30 pontos), o Herói sobrevive a uma situação fatal por um triz cinematográfico!</div>
            </div>
          )
        }
      ]
    },

    sanity: {
      icon: <AlertTriangle size={22} color="#b91c1c" />,
      title: 'Sanidade (SAN) e os Mitos de Cthulhu',
      badge: 'Saúde Mental · Horror Cósmico',
      badgeStyle: { background: '#b91c1c', color: '#ffffff' },
      summary: 'A medida da firmeza mental do personagem diante de horrores que a mente humana não foi feita para conceber.',
      sections: [
        {
          subtitle: 'Como funciona o Teste de Sanidade?',
          content: 'Ao ver um cadáver desfigurado, um monstro hediondo ou ler um tomo profano, o Guardião pede um Teste de Sanidade (1D100 ≤ SAN atual). Se passar, você perde pouca ou nenhuma Sanidade (ex: 0/1D4). Se falhar, perde o valor maior (ex: 1D4).'
        },
        {
          subtitle: 'Abalos e Loucura',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>• Loucura Temporária:</strong> Se perder 5 ou mais pontos de Sanidade em uma única rolagem, você sofre um episódio agudo de loucura (pânico, paralisia ou amnésia).</div>
              <div><strong>• Loucura Indefinida:</strong> Se perder um quinto (1/5) da sua Sanidade em um único dia do jogo, o personagem desenvolve fobias ou manias graves a longo prazo.</div>
              <div><strong>• Zero de Sanidade:</strong> O personagem enlouquece permanentemente e se torna um devoto dos Mitos (NPC do Guardião).</div>
            </div>
          )
        }
      ]
    },

    combat: {
      icon: <Swords size={22} color="#991b1b" />,
      title: 'Regras de Combate e Sobrevivência',
      badge: 'Iniciativa · Revide · Esquiva · Letalidade',
      badgeStyle: { background: '#991b1b', color: '#ffffff' },
      summary: 'Em Call of Cthulhu o combate é brutal, rápido e impiedoso.',
      sections: [
        {
          subtitle: 'Ordem de Agir (Iniciativa)',
          content: 'Os personagens agem em ordem decrescente de Destreza (DES). Armas de fogo já empunhadas disparam antes de ataques corporais (+50 na DES).'
        },
        {
          subtitle: 'Revide ou Esquiva?',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>• Revidar (Briga):</strong> O defensor tenta golpear o atacante. Quem obtiver o melhor nível de sucesso causa dano!</div>
              <div><strong>• Esquivar:</strong> O defensor foca 100% em não ser atingido. Se vencer o teste oposto, escapa sem sofrer nenhum dano.</div>
            </div>
          )
        },
        {
          subtitle: 'Dano e Morte',
          content: 'Se um único ataque causar dano igual ou superior à metade da sua Vida máxima (PV/2), você sofre uma Lesão Grave. Se os seus Pontos de Vida chegarem a 0 enquanto tiver uma Lesão Grave, você estará Morrendo e precisa de Primeiros Socorros imediatos!'
        }
      ]
    }
  };

  const item = contentMap[type] || contentMap.rolls;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ 
          maxWidth: '560px', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: '0 12px 35px rgba(0,0,0,0.65)'
        }}
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

        <div className={styles.modalBody} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', letterSpacing: '0.04em', ...item.badgeStyle }}>
              {item.badge}
            </span>
          </div>

          <p style={{ fontStyle: 'italic', color: 'var(--ink)', fontSize: '13.5px', margin: 0, fontWeight: 700, borderLeft: '3px solid var(--red)', paddingLeft: '10px' }}>
            {item.summary}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', lineHeight: 1.5, color: 'var(--ink)' }}>
            {item.sections.map((sec, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sec.subtitle && (
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', color: 'var(--red)', fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
                    {sec.subtitle}
                  </h4>
                )}
                <div style={{ color: 'var(--ink)' }}>
                  {sec.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 18px', borderTop: '2px solid var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--paper)', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--mute)', fontStyle: 'italic' }}>
            Chamado de Cthulhu · 7ª Edição & Pulp Cthulhu
          </span>
          <button
            type="button"
            onClick={onClose}
            className={styles.redButton}
            style={{ padding: '7px 20px', fontSize: '12px' }}
          >
            Entendi!
          </button>
        </div>
      </div>
    </div>
  );
}
