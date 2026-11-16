import { redirect } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import CharacterSheet from "@/components/CharacterSheet";

export const dynamic = 'force-dynamic';

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (id === "new") {
        return <CharacterSheet isNew />;
    }

    // Se for ID salvo no localStorage ou se o Supabase não estiver configurado, carrega no cliente
    if (id.startsWith("char_") || !isSupabaseConfigured) {
        return <CharacterSheet characterId={id} />;
    }

    // Carregar ficha existente do Supabase
    let character = null;

    try {
        const { data, error } = await supabase
            .from('Character')
            .select('*')
            .eq('id', id)
            .single();

        if (!error && data) {
            character = data;
        } else {
            const { data: retryData } = await supabase
                .from('character')
                .select('*')
                .eq('id', id)
                .single();
            character = retryData;
        }
    } catch (e) {
        console.error("Erro ao carregar ficha:", e);
    }

    if (!character) {
        redirect("/");
    }

    return <CharacterSheet initialData={character.data as any} characterId={String(character.id)} />;
}
