import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[var(--color-parchment-light)] flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-[family-name:var(--font-display)] text-[var(--color-sepia-dark)] mb-6">
          Ficha de Investigador
        </h1>
        <p className="text-xl font-[family-name:var(--font-typewriter)] text-[var(--color-sepia-medium)] mb-8">
          Call of Cthulhu • 7ª Edição
        </p>
        <p className="text-lg mb-8 text-[var(--color-sepia-dark)]">
          Crie e gerencie suas fichas de personagem para Call of Cthulhu de forma fácil e organizada.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-in"
            className="bg-[var(--color-gold)] text-[var(--color-sepia-dark)] px-6 py-3 rounded-md hover:brightness-110 font-bold shadow-md transition-all"
          >
            Entrar
          </Link>
          <Link
            href="/sign-up"
            className="bg-[var(--color-sepia-dark)] text-white px-6 py-3 rounded-md hover:brightness-110 font-bold shadow-md transition-all"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </main>
  );
}
