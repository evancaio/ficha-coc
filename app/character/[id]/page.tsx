import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CharacterSheet from "@/components/CharacterSheet";

export const dynamic = 'force-dynamic';

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (id === "new") {
        // Nova ficha - sem dados iniciais
        return <CharacterSheet />;
    }

    // Carregar ficha existente
    let character = null;

    const { data, error } = await supabase
        .from('Character')
        .select('*')
        .eq('id', id)
        .single();

    if (!error && data) {
        character = data;
    } else {
        // Fallback
        const { data: retryData } = await supabase
            .from('character')
            .select('*')
            .eq('id', id)
            .single();
        character = retryData;
    }

    if (!character) {
        redirect("/");
    }

    return <CharacterSheet initialData={character.data as any} characterId={character.id} />;
}
