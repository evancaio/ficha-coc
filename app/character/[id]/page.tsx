import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CharacterSheet from "@/components/CharacterSheet";

export default async function CharacterPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    if (id === "new") {
        // Nova ficha - sem dados iniciais
        return <CharacterSheet />;
    }

    // Carregar ficha existente
    const character = await prisma.character.findUnique({
        where: {
            id,
        },
    });

    if (!character) {
        redirect("/");
    }

    return <CharacterSheet initialData={character.data as any} characterId={character.id} />;
}
