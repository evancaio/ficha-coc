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
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            📜 Fichas Call of Cthulhu
          </h1>
          <p className="text-xl text-[var(--color-sepia-medium)] mb-6">
            Galeria Pública de Personagens
          </p>
          <Link
            href="/character/new"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--color-eldritch-purple)] to-[var(--color-eldritch-green)] text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            ✨ Criar Nova Ficha
          </Link>
        </header>

        {/* Lista de Fichas */}
        {characters.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-[var(--color-sepia-medium)] mb-4">
              Nenhuma ficha encontrada
            </p>
            <p className="text-lg text-[var(--color-faded-ink)]">
              Crie a primeira ficha agora mesmo!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character: any) => {
              const data = character.data;
              return (
                <Link
                  key={character.id}
                  href={`/character/${character.id}`}
                  className="block"
                >
                  <div className="card hover:scale-105 transition-transform cursor-pointer h-full">
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {data.basicInfo?.name || 'Sem Nome'}
                    </h3>
                    <div className="space-y-1 text-[var(--color-sepia-medium)]">
                      <p>
                        <strong>Ocupação:</strong> {data.basicInfo?.occupation || 'Não definida'}
                      </p>
                      <p>
                        <strong>Idade:</strong> {data.basicInfo?.age || '?'} anos
                      </p>
                      {data.basicInfo?.residence && (
                        <p>
                          <strong>Residência:</strong> {data.basicInfo.residence}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[var(--color-sepia-light)] text-sm text-[var(--color-faded-ink)]">
                      Atualizado: {new Date(character.updatedAt).toLocaleDateString('pt-BR')}
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
