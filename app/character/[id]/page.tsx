import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CharacterSheet from "@/components/CharacterSheet";

export default async function CharacterPage({ params }: { params: { id: string } }) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { id } = await params;

    if (id === "new") {
        // New character - no initial data
        return <CharacterSheet />;
    }

    // Load existing character
    const character = await prisma.character.findUnique({
        where: {
            id,
            userId, // Ensure ownership
        },
    });

    if (!character) {
        redirect("/dashboard");
    }

    return <CharacterSheet initialData={character.data as any} characterId={character.id} />;
}
