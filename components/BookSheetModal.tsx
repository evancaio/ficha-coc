'use client';

import { useState } from 'react';
import { Download, X } from 'lucide-react';
import { Character } from '@/types/character';
import {
    downloadBookStylePdf,
    formatBackstoryItems,
    formatCombatLines,
    formatHeaderTitle,
    formatLuckValue,
    formatNarrativeParagraphs,
    formatPortraitCaption,
    formatSkillsAbove20
} from '@/utils/pdfExport';
import styles from './BookSheetModal.module.css';

interface BookSheetModalProps {
    isOpen: boolean;
    onClose: () => void;
    character: Character;
}

export default function BookSheetModal({ isOpen, onClose, character }: BookSheetModalProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const c = character.characteristics;
    const d = character.derivedStats;
    const luck = formatLuckValue(character);
    const title = formatHeaderTitle(character);
    const portraitCaption = formatPortraitCaption(character);
    const combatLines = formatCombatLines(character);
    const skillsText = formatSkillsAbove20(character);
    const backstoryItems = formatBackstoryItems(character);
    const narrativeParagraphs = formatNarrativeParagraphs(character);

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            await downloadBookStylePdf(character);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            {/* Barra de ações do modal */}
            <div className={styles.modalHeader} onClick={(e) => e.stopPropagation()}>
                <span className={styles.modalTitle}>
                    PRÉ-VISUALIZAÇÃO DA FICHA (ESTILO LIVRO)
                </span>
                <div className={styles.modalActions}>
                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className={styles.downloadButton}
                    >
                        <Download size={15} />
                        {isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.closeButton}
                    >
                        <X size={15} /> Fechar
                    </button>
                </div>
            </div>

            {/* Página Estilo Livro / Suplemento */}
            <div className={styles.pageContainer} onClick={(e) => e.stopPropagation()}>
                {/* Moldura SVG com cantos superiores chanfrados e linha dupla */}
                <svg
                    viewBox="0 0 820 1120"
                    preserveAspectRatio="none"
                    className={styles.frameSvg}
                >
                    {/* Linha externa grossa */}
                    <polygon
                        points="20,2 800,2 800,20 818,20 818,1118 2,1118 2,20 20,20"
                        fill="none"
                        stroke="#111111"
                        strokeWidth="2.8"
                    />
                    {/* Linha interna fina */}
                    <polygon
                        points="25,7 795,7 795,25 813,25 813,1113 7,1113 7,25 25,25"
                        fill="none"
                        stroke="#111111"
                        strokeWidth="1"
                    />
                </svg>

                {/* Cabeçalho */}
                <h1 className={styles.characterTitle}>
                    {title}
                </h1>

                {/* Bloco Superior (Atributos + Combate na esquerda, Retrato na direita) */}
                <div className={styles.topSection}>
                    <div className={styles.statsAndCombatColumn}>
                        {/* Atributos (2 linhas x 5 colunas) */}
                        <div className={styles.characteristicsBlock}>
                            <div className={styles.characteristicsGrid}>
                                <span className={styles.characteristicItem}>FOR {c.STR}</span>
                                <span className={styles.characteristicItem}>CON {c.CON}</span>
                                <span className={styles.characteristicItem}>TAM {c.SIZ}</span>
                                <span className={styles.characteristicItem}>DES {c.DEX}</span>
                                <span className={styles.characteristicItem}>INT {c.INT}</span>
                                <span className={styles.characteristicItem}>APA {c.APP}</span>
                                <span className={styles.characteristicItem}>POD {c.POW}</span>
                                <span className={styles.characteristicItem}>EDU {c.EDU}</span>
                                <span className={styles.characteristicItem}>SAN {d.SAN}</span>
                                <span className={styles.characteristicItem}>PVs {d.HP}</span>
                            </div>
                            <div className={styles.derivedStatsRow}>
                                <span>DX: {d.damageBonus}</span>
                                <span>Corpo: {d.build}</span>
                                <span>Movimento: {d.movementRate}</span>
                                <span>Sorte: {luck}</span>
                                <span>Pontos de Magia: {d.MP}</span>
                            </div>
                        </div>

                        {/* Combate e Armas */}
                        <div className={styles.combatBlock}>
                            {combatLines.map((line, i) => (
                                <div key={i} className={styles.combatLine}>
                                    <span className={styles.combatSkillName}>{line.name}</span>{' '}
                                    <span>{line.detail}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Retrato à direita */}
                    <div className={styles.portraitWrapper}>
                        <div className={styles.portraitOuterBox}>
                            <div className={styles.portraitInnerBox}>
                                {character.basicInfo.photo ? (
                                    <img
                                        src={character.basicInfo.photo}
                                        alt={character.basicInfo.name || 'Retrato'}
                                        className={styles.portraitImage}
                                    />
                                ) : (
                                    <span className={styles.portraitPlaceholder}>Sem retrato</span>
                                )}
                            </div>
                        </div>
                        <div className={styles.portraitCaption}>
                            {portraitCaption}
                        </div>
                    </div>
                </div>

                {/* Perícias e restante do conteúdo em largura total */}
                <div className={styles.lowerSection}>
                    {/* Perícias (> 20%) */}
                    <p className={styles.skillsParagraph}>
                        <span className={styles.skillsLabel}>Perícias: </span>
                        {skillsText}
                    </p>

                    {/* Antecedentes */}
                    {backstoryItems.length > 0 && (
                        <div className={styles.backstoryBlock}>
                            <div className={styles.backstoryTitle}>Antecedentes:</div>
                            <ul className={styles.backstoryList}>
                                {backstoryItems.map((item, idx) => (
                                    <li key={idx} className={styles.backstoryItem}>
                                        <span>•</span>
                                        <span>
                                            <strong>{item.label}:</strong> {item.value}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Parágrafos de História / Background */}
                    {narrativeParagraphs.length > 0 && (
                        <div className={styles.narrativeBlock}>
                            {narrativeParagraphs.map((para, idx) => (
                                <p
                                    key={idx}
                                    className={styles.narrativeParagraph}
                                    style={{ textIndent: idx > 0 ? '20px' : '0' }}
                                >
                                    {para}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Notas do Jogador */}
                    <div className={styles.playerNotes}>
                        Notas do Jogador:
                    </div>
                </div>
            </div>
        </div>
    );
}
