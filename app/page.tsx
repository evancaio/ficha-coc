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

    if (!error && data && data.length > 0) {
      characters = data;
    } else {
      // Fallback: se 'Character' não retornar nada (ou der erro), tenta 'character'
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

  return (
    <main className="min-h-screen bg-[var(--color-parchment-light)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Style */}
        <header className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-[var(--color-sepia-light)] -z-10"></div>
          <div className="inline-block bg-[var(--color-parchment-light)] px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-sepia-dark)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Fichas Call of Cthulhu
            </h1>
            <p className="text-xl text-[var(--color-sepia-medium)] font-serif italic">
              Galeria Pública de Personagens
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/character/new"
              className="inline-block px-8 py-3 bg-[var(--color-sepia-dark)] text-[#f4e8d0] text-lg font-bold rounded shadow-lg hover:bg-[var(--color-sepia-medium)] transition-all hover:-translate-y-1 hover:shadow-xl border border-[#3e3221]"
            >
              + Criar Nova Ficha
            </Link>
          </div>
        </header>

        {/* Lista de Fichas */}
        {characters.length === 0 ? (
          <div className="text-center py-20 bg-[rgba(255,255,255,0.4)] rounded-xl border-2 border-dashed border-[var(--color-sepia-light)]">
            <p className="text-2xl text-[var(--color-sepia-dark)] mb-4 font-serif">
              O Grimório está vazio...
            </p>
            <p className="text-lg text-[var(--color-sepia-medium)]">
              Seja o primeiro a registrar um investigador nestas páginas.
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
                  <div className="h-full bg-[#faebd7] rounded shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] border border-[#d4c5a9] overflow-hidden transition-all duration-300 group-hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] group-hover:-translate-y-1 group-hover:border-[var(--color-sepia-medium)]">

                    {/* Imagem do Personagem (se houver) */}
                    <div className="h-48 bg-[#e6dcc5] relative flex items-center justify-center overflow-hidden border-b border-[#d4c5a9]">
                      {data.basicInfo?.imageUrl ? (
                        <img
                          src={data.basicInfo.imageUrl}
                          alt={data.basicInfo.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x200?text=Sem+Imagem'; }}
                        />
                      ) : (
                        <span className="text-6xl opacity-20 text-[#5c4b37]">👤</span>
                      )}
                      <div className="absolute top-2 right-2 bg-[var(--color-sepia-dark)] text-[#faebd7] text-xs font-bold px-2 py-1 rounded opacity-80">
                        {data.basicInfo?.occupation || 'Desconhecido'}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 text-[#3e3221] group-hover:text-[#5c4b37]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {data.basicInfo?.name || 'Sem Nome'}
                      </h3>

                      <div className="space-y-1 text-[#5c4b37] text-sm">
                        <p>
                          <span className="font-bold opacity-70">Jogador:</span> {data.basicInfo?.player || '-'}
                        </p>
                        <p>
                          <span className="font-bold opacity-70">Idade:</span> {data.basicInfo?.age || '?'} anos
                        </p>
                        {data.basicInfo?.residence && (
                          <p className="truncate">
                            <span className="font-bold opacity-70">Residência:</span> {data.basicInfo.residence}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#d4c5a9] flex justify-between items-center text-xs text-[#8c7b66]">
                        <span>Atualizado:</span>
                        <span className="font-semibold">{new Date(character.updatedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
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
