'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { getAllCharacters, deleteCharacter } from '@/utils/storage';
import styles from '@/app/page.module.css';

interface GalleryItem {
    id: string;
    updatedAt: string;
    data: {
        gameMode?: 'classic' | 'pulp';
        archetype?: string;
        basicInfo?: {
            name?: string;
            occupation?: string;
            age?: number | string;
            residence?: string;
            photo?: string;
        };
    };
}

export default function CharacterGallery({ serverCharacters }: { serverCharacters: GalleryItem[] }) {
    const [characters, setCharacters] = useState<GalleryItem[]>(serverCharacters);

    const loadAll = () => {
        try {
            const localMap = getAllCharacters();
            const localItems: GalleryItem[] = Object.entries(localMap).map(([id, char]: [string, any]) => ({
                id,
                updatedAt: char.lastModified || new Date().toISOString(),
                data: char
            }));

            const existingIds = new Set(serverCharacters.map(c => String(c.id)));
            const merged = [
                ...serverCharacters,
                ...localItems.filter(item => !existingIds.has(String(item.id)))
            ];

            merged.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            setCharacters(merged);
        } catch (e) {
            console.error('Erro ao ler fichas locais:', e);
        }
    };

    useEffect(() => {
        loadAll();
    }, [serverCharacters]);

    const handleDelete = (e: React.MouseEvent, id: string, name?: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(`Deseja apagar a ficha "${name || 'Sem Nome'}" do cache deste navegador?`)) return;
        deleteCharacter(id);
        loadAll();
    };

    if (characters.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>
                    Nenhuma ficha encontrada no Arquivo
                </p>
                <p className={styles.emptySubtitle}>
                    Suas fichas ficam salvas automaticamente no cache deste navegador. Clique em "+ Criar Nova Ficha" para começar!
                </p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {characters.map((character) => {
                const data = character.data || {};
                const isLocal = String(character.id).startsWith('char_');
                return (
                    <Link
                        key={character.id}
                        href={`/character/${character.id}`}
                        className={styles.cardLink}
                    >
                        <div className={styles.card}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: '6px', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                                        <h3 className={styles.cardName} style={{ marginBottom: 0 }}>
                                            {data.basicInfo?.name || 'Sem Nome'}
                                        </h3>
                                        {data.gameMode === 'pulp' && (
                                            <span style={{ fontSize: '10px', background: '#b91c1c', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                <Zap size={10} /> PULP
                                            </span>
                                        )}
                                    </div>
                                    {isLocal && (
                                        <button
                                            type="button"
                                            onClick={(e) => handleDelete(e, character.id, data.basicInfo?.name)}
                                            title="Apagar ficha do cache"
                                            style={{ background: 'var(--red)', color: 'var(--on-red)', padding: '0 10px', fontSize: '16px' }}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    {data.basicInfo?.photo && (
                                        <img
                                            src={data.basicInfo.photo}
                                            alt={data.basicInfo.name || 'Retrato'}
                                            style={{
                                                width: '58px',
                                                height: '76px',
                                                objectFit: 'cover',
                                                border: '1.5px solid var(--ink)',
                                                filter: 'grayscale(1) contrast(1.1)',
                                                flexShrink: 0
                                            }}
                                        />
                                    )}
                                    <div className={styles.cardDetails} style={{ flex: 1 }}>
                                        {data.gameMode === 'pulp' && data.archetype && (
                                            <p className={styles.cardRow}>
                                                <span style={{ color: '#b91c1c' }}><strong>Arq.:</strong> {data.archetype}</span>
                                            </p>
                                        )}
                                        <p className={styles.cardRow}>
                                            <span><strong>Ocup.:</strong> {data.basicInfo?.occupation || 'Desconhecido'}</span>
                                        </p>
                                        <p className={styles.cardRow}>
                                            <span><strong>Idade:</strong> {data.basicInfo?.age || '?'} anos</span>
                                        </p>
                                        {data.basicInfo?.residence && (
                                            <p className={styles.cardRow}>
                                                <span><strong>Resid.:</strong> {data.basicInfo.residence}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <span>{isLocal ? 'Salvo no Cache' : 'Nuvem'}</span>
                                <strong>
                                    {character.updatedAt
                                        ? new Date(character.updatedAt).toLocaleDateString('pt-BR')
                                        : '-'}
                                </strong>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
