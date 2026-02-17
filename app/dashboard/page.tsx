import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Plus, Scroll, Trash2 } from "lucide-react";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const characters = await prisma.character.findMany({
        where: {
            userId,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    return (
        <div className="min-h-screen bg-[var(--color-parchment-light)] p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-[family-name:var(--font-display)] text-[var(--color-sepia-dark)]">
                        Meus Investigadores
                    </h1>
                    <Link
                        href="/character/new"
                        className="flex items-center gap-2 bg-[var(--color-gold)] text-[var(--color-sepia-dark)] px-4 py-2 rounded-md hover:brightness-110 font-bold shadow-md transition-all"
                    >
                        <Plus size={20} />
                        Nova Ficha
                    </Link>
                </header>

                {characters.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-[var(--color-sepia-medium)] rounded-xl opacity-60">
                        <Scroll size={48} className="mx-auto mb-4" />
                        <p className="text-xl font-[family-name:var(--font-typewriter)]">
                            Você ainda não tem investigadores.
                        </p>
                        <Link
                            href="/character/new"
                            className="inline-block mt-4 text-[var(--color-eldritch-purple)] underline"
                        >
                            Criar o primeiro
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {characters.map((char) => (
                            <div
                                key={char.id}
                                className="bg-[rgba(255,255,255,0.7)] border-2 border-[var(--color-sepia-light)] p-6 rounded-lg shadow-sm hover:shadow-md transition-all relative group"
                            >
                                <Link href={`/character/${char.id}`} className="block">
                                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] mb-2 text-[var(--color-sepia-dark)] truncate">
                                        {char.name || "Sem Nome"}
                                    </h3>
                                    <p className="text-sm font-[family-name:var(--font-typewriter)] text-[var(--color-sepia-medium)] mb-4">
                                        {char.occupation || "Ocupação não definida"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Atualizado em {new Date(char.updatedAt).toLocaleDateString()}
                                    </p>
                                </Link>

                                {/* Delete button could allow implementing delete functionality later */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
