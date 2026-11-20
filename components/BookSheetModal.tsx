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
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 12, 10, 0.82)',
                zIndex: 10000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflowY: 'auto',
                padding: '20px 12px 40px'
            }}
            onClick={onClose}
        >
            {/* Barra de ações do modal */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '820px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '14px',
                    background: '#1b1613',
                    padding: '10px 16px',
                    border: '2px solid #efe2c3',
                    flexWrap: 'wrap'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <span style={{ color: '#efe2c3', fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.05em' }}>
                    PRÉ-VISUALIZAÇÃO DA FICHA (ESTILO LIVRO)
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={isGenerating}
                        style={{
                            background: '#c4302b',
                            color: '#f6ead0',
                            padding: '9px 16px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <Download size={16} />
                        {isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}
                    </button>
                    <button
                        type="button"
                        onClick={ onClose }
                        style={{
                            background: '#efe2c3',
                            color: '#1b1613',
                            padding: '9px 14px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <X size={16} /> Fechar
                    </button>
                </div>
            </div>

            {/* Página A4 Estilo Suplemento Oficial */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '820px',
                    minHeight: '1120px',
                    background: '#ffffff',
                    color: '#111111',
                    padding: '46px 52px 54px',
                    boxShadow: '0 20px 55px rgba(0,0,0,0.65)',
                    fontFamily: '"PT Serif", Georgia, serif',
                    fontSize: '14.5px',
                    lineHeight: 1.42
                }}
            >
                {/* Moldura SVG com cantos superiores chanfrados e linha dupla */}
                <svg
                    viewBox="0 0 820 1120"
                    preserveAspectRatio="none"
                    style={{
                        position: 'absolute',
                        inset: '18px',
                        width: 'calc(100% - 36px)',
                        height: 'calc(100% - 36px)',
                        pointerEvents: 'none'
                    }}
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
                <h1
                    style={{
                        fontFamily: '"Saira Stencil One", Impact, sans-serif',
                        fontSize: '23px',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        color: '#111111',
                        margin: '0 0 18px 0'
                    }}
                >
                    {title}
                </h1>

                {/* Bloco com Retrato Flutuando à Direita */}
                <div style={{ position: 'relative' }}>
                    {/* Retrato */}
                    <div
                        style={{
                            float: 'right',
                            width: '215px',
                            marginLeft: '22px',
                            marginBottom: '12px',
                            textAlign: 'center'
                        }}
                    >
                        <div
                            style={{
                                border: '2.5px solid #111111',
                                padding: '3px',
                                background: '#ffffff'
                            }}
                        >
                            <div
                                style={{
                                    border: '1px solid #111111',
                                    aspectRatio: '4 / 5',
                                    overflow: 'hidden',
                                    background: '#f4f4f4',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {character.basicInfo.photo ? (
                                    <img
                                        src={character.basicInfo.photo}
                                        alt={character.basicInfo.name || 'Retrato'}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            filter: 'grayscale(100%) contrast(115%)'
                                        }}
                                    />
                                ) : (
                                    <span style={{ color: '#888', fontSize: '12px' }}>Sem retrato</span>
                                )}
                            </div>
                        </div>
                        <div
                            style={{
                                fontFamily: '"Saira Stencil One", Impact, sans-serif',
                                fontSize: '16px',
                                letterSpacing: '0.04em',
                                marginTop: '6px',
                                color: '#111111',
                                textTransform: 'uppercase'
                            }}
                        >
                            {portraitCaption}
                        </div>
                    </div>

                    {/* Atributos (3 linhas) */}
                    <div style={{ marginBottom: '16px' }}>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5, minmax(70px, 95px))',
                                gap: '2px 8px',
                                marginBottom: '2px'
                            }}
                        >
                            <span>FOR {c.STR}</span>
                            <span>CON {c.CON}</span>
                            <span>TAM {c.SIZ}</span>
                            <span>DES {c.DEX}</span>
                            <span>INT {c.INT}</span>
                            <span>APA {c.APP}</span>
                            <span>POD {c.POW}</span>
                            <span>EDU {c.EDU}</span>
                            <span>SAN {d.SAN}</span>
                            <span>PVs {d.HP}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '2px' }}>
                            <span>DX: {d.damageBonus}</span>
                            <span>Corpo: {d.build}</span>
                            <span>Movimento: {d.movementRate}</span>
                            <span>Sorte: {luck}</span>
                            <span>Pontos de Magia: {d.MP}</span>
                        </div>
                    </div>

                    {/* Combate e Armas */}
                    <div style={{ marginBottom: '16px' }}>
                        {combatLines.map((line, i) => (
                            <div key={i} style={{ marginBottom: '3px' }}>
                                <span style={{ display: 'inline-block', minWidth: '82px' }}>{line.name}</span>{' '}
                                <span>{line.detail}</span>
                            </div>
                        ))}
                    </div>

                    {/* Perícias (> 20%) */}
                    <p style={{ marginBottom: '16px', textAlign: 'justify' }}>
                        <span>Perícias: </span>
                        {skillsText}
                    </p>

                    {/* Antecedentes */}
                    {backstoryItems.length > 0 && (
                        <div style={{ marginBottom: '16px', clear: 'none' }}>
                            <div style={{ marginBottom: '4px' }}>Antecedentes:</div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {backstoryItems.map((item, idx) => (
                                    <li
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            marginBottom: '3px'
                                        }}
                                    >
                                        <span>•</span>
                                        <span>
                                            {item.label}: {item.value}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Parágrafos de História / Background */}
                    {narrativeParagraphs.length > 0 && (
                        <div style={{ clear: 'both', marginBottom: '16px' }}>
                            {narrativeParagraphs.map((para, idx) => (
                                <p
                                    key={idx}
                                    style={{
                                        margin: '0 0 6px 0',
                                        textIndent: idx > 0 ? '24px' : '0',
                                        textAlign: 'justify'
                                    }}
                                >
                                    {para}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Notas do Jogador */}
                    <div style={{ clear: 'both', paddingTop: '6px' }}>
                        Notas do Jogador:
                    </div>
                </div>
            </div>
        </div>
    );
}
