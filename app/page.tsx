import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import CharacterGallery from "@/components/CharacterGallery";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export default async function Home() {
    let characters: any[] = [];

    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase
                .from('Character')
                .select('*')
                .order('updatedAt', { ascending: false })
                .limit(50);

            if (!error && data && data.length > 0) {
                characters = data;
            } else {
                const { data: retryData } = await supabase
                    .from('character')
                    .select('*')
                    .order('updatedAt', { ascending: false })
                    .limit(50);

                if (retryData && retryData.length > 0) characters = retryData;
            }
        } catch (e) {
            console.error("Erro ao buscar fichas:", e);
        }
    }

    return (
        <main className={styles.main}>
            <header className={styles.hero}>
                <span className={styles.kicker}>Chamado de Cthulhu · 7ª Edição</span>
                <h1 className={styles.title}>Dossiê de Investigadores</h1>
                <div>
                    <span className={styles.subtitle}>Архив следователей · Arquivo de Fichas</span>
                </div>
            </header>

            <div className={styles.tools}>
                <Link href="/character/new" className={styles.createButton}>
                    + Criar Nova Ficha
                </Link>
            </div>

            <div className={styles.container}>
                <CharacterGallery serverCharacters={characters} />
            </div>
        </main>
    );
}
