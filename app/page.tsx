import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic'; // Garante que não é gerado estático

export default async function Home() {
  // Buscar todas as fichas do banco
  let characters = [];

  try {
    const { data, error } = await supabase
      .from('Character')
      .select('*')
      .order('updatedAt', { ascending: false })
      .limit(50);

    if (!error && data) {
      characters = data;
    } else {
      // Fallback para tabela minúscula
      const { data: retryData } = await supabase
        .from('character')
        .select('*')
        .order('updatedAt', { ascending: false })
        .limit(50);

      if (retryData) characters = retryData;
    }
  } catch (e) {
    console.error("Erro ao buscar fichas:", e);
  }

  return (
    <main className="min-h-screen bg-[var(--color-parchment-light)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-6 drop-shadow-sm text-[var(--color-eldritch-purple)]" style={{ fontFamily: 'var(--font-display)' }}>
            📜 Fichas Call of Cthulhu
          </h1>
          <p className="text-2xl text-[var(--color-sepia-medium)] mb-8 font-serif italic">
            Galeria Pública de Personagens
          </p>
          <Link
            href="/character/new"
            className="inline-block px-10 py-5 bg-gradient-to-r from-[var(--color-eldritch-purple)] to-[var(--color-eldritch-green)] text-white text-xl font-bold rounded-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-[var(--color-gold)]"
          >
            ✨ Criar Nova Ficha
          </Link>
        </header>

        {/* Lista de Fichas */}
        {characters.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-xl border-2 border-dashed border-[var(--color-sepia-media)]">
            <p className="text-3xl text-[var(--color-sepia-medium)] mb-4 font-serif">
              Nenhuma ficha encontrada no Grimório
            </p>
            <p className="text-xl text-[var(--color-faded-ink)]">
              Seja o primeiro a registrar um investigador!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {characters.map((character: any) => {
              const data = character.data;
              return (
                <Link
                  key={character.id}
                  href={`/character/${character.id}`}
                  className="block group"
                >
                  <div className="h-full bg-[var(--color-parchment)] rounded-xl shadow-md border border-[var(--color-sepia-light)] p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:border-[var(--color-eldritch-green)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      {/* Ícone de fundo decorativo */}
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                      </svg>
                    </div>

                    <h3 className="text-3xl font-bold mb-3 text-[var(--color-eldritch-dark)] border-b-2 border-[var(--color-sepia-light)] pb-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {data.basicInfo?.name || 'Sem Nome'}
                    </h3>

                    <div className="space-y-2 text-[var(--color-sepia-dark)] font-serif text-lg">
                      <p className="flex items-center gap-2">
                        <span className="text-xl">🕵️</span>
                        <span>{data.basicInfo?.occupation || 'Desconhecido'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-xl">🎂</span>
                        <span>{data.basicInfo?.age || '?'} anos</span>
                      </p>
                      {data.basicInfo?.residence && (
                        <p className="flex items-center gap-2">
                          <span className="text-xl">🏠</span>
                          <span className="truncate">{data.basicInfo.residence}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--color-sepia-light)] flex justify-between items-center text-sm text-[var(--color-faded-ink)]">
                      <span>Atualizado em:</span>
                      <span className="font-semibold">{new Date(character.updatedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
