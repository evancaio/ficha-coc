'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllCharacters } from '@/utils/storage';
import styles from '@/app/page.module.css';

interface GalleryItem {
    id: string;
    updatedAt: string;
    data: {
        basicInfo?: {
            name?: string;
            occupation?: string;
            age?: number | string;
            residence?: string;
        };
    };
}

export default function CharacterGallery({ serverCharacters }: { serverCharacters: GalleryItem[] }) {
    const [characters, setCharacters] = useState<GalleryItem[]>(serverCharacters);

    useEffect(() => {
        try {
            const localMap = getAllCharacters();
            const localItems: GalleryItem[] = Object.entries(localMap).map(([id, char]: [string, any]) => ({
                id,
                updatedAt: char.lastModified || new Date().toISOString(),
                data: char
            }));

            // Merge avoiding duplicates by ID
            const existingIds = new Set(serverCharacters.map(c => String(c.id)));
            const merged = [
                ...serverCharacters,
                ...localItems.filter(item => !existingIds.has(String(item.id)))
            ];

            setCharacters(merged);
        } catch (e) {
            console.error('Erro ao ler fichas locais:', e);
        }
    }, [serverCharacters]);

    if (characters.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>
                    Nenhuma ficha encontrada no Grimório
                </p>
                <p className={styles.emptySubtitle}>
                    Seja o primeiro a registrar um investigador!
                </p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {characters.map((character) => {
                const data = character.data || {};
                return (
                    <Link
                        key={character.id}
                        href={`/character/${character.id}`}
                        className={styles.cardLink}
                    >
                        <div className={styles.card}>
                            <div className={styles.cardWatermark}>
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                </svg>
                            </div>

                            <div>
                                <h3 className={styles.cardName}>
                                    {data.basicInfo?.name || 'Sem Nome'}
                                </h3>

                                <div className={styles.cardDetails}>
                                    <p className={styles.cardRow}>
                                        <span>🕵️</span>
                                        <span>{data.basicInfo?.occupation || 'Desconhecido'}</span>
                                    </p>
                                    <p className={styles.cardRow}>
                                        <span>🎂</span>
                                        <span>{data.basicInfo?.age || '?'} anos</span>
                                    </p>
                                    {data.basicInfo?.residence && (
                                        <p className={styles.cardRow}>
                                            <span>🏠</span>
                                            <span>{data.basicInfo.residence}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <span>Atualizado em:</span>
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
