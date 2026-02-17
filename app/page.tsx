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
    <main className="min-h-screen p-4 md:p-8">
      <div className="container animate-fade-in">
        {/* Header */}
        <header className="text-center mb-16 pt-8">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] text-sm font-medium tracking-wider uppercase">
            Sistema de RPG
          </div>
          <h1 className="mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)]">
            Grimório de Investigadores
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto font-serif">
            "A mais antiga e forte emoção da humanidade é o medo, e o tipo mais antigo e forte de medo é o medo do desconhecido."
          </p>

          <Link
            href="/character/new"
            className="modern-btn group"
          >
            <span className="text-xl mr-2 group-hover:rotate-90 transition-transform duration-300">✦</span>
            <span>Criar Nova Ficha</span>
          </Link>
        </header>

        {/* Lista de Fichas */}
        {characters.length === 0 ? (
          <div className="text-center py-24 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] max-w-2xl mx-auto backdrop-blur-sm">
            <div className="text-6xl mb-6 opacity-30">📜</div>
            <h3 className="text-2xl text-[var(--text-primary)] mb-2 font-serif">
              O Grimório está vazio...
            </h3>
            <p className="text-[var(--text-secondary)] mb-8">
              Nenhuma alma corajosa foi registrada ainda.
            </p>
            <Link
              href="/character/new"
              className="text-[var(--color-accent-glow)] hover:text-[var(--color-accent-primary)] font-medium underline underline-offset-4"
            >
              Iniciar a primeira investigação
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-end mb-8 px-2 border-b border-[var(--border-color)] pb-4">
              <div>
                <h2 className="text-2xl font-display text-[var(--text-primary)] m-0 p-0 border-none">
                  Personagens Recentes
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {characters.length} investigadores registrados
                </p>
              </div>
            </div>

            <div className="grid-responsive">
              {characters.map((character: any) => {
                const data = character.data;
                const initials = data.basicInfo?.name
                  ? data.basicInfo.name.substring(0, 2).toUpperCase()
                  : '??';

                return (
                  <Link
                    key={character.id}
                    href={`/character/${character.id}`}
                    className="block h-full no-underline"
                  >
                    <article className="modern-card group">
                      <div className="card-image-placeholder group-hover:text-[var(--color-accent-glow)] transition-colors duration-300">
                        {initials}
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold mb-1 text-[var(--text-primary)] group-hover:text-[var(--color-accent-glow)] transition-colors font-display truncate">
                          {data.basicInfo?.name || 'Sem Nome'}
                        </h3>

                        <div className="text-[var(--text-accent)] text-sm font-medium tracking-wide mb-4 uppercase">
                          {data.basicInfo?.occupation || 'Desconhecido'}
                        </div>

                        <div className="space-y-3 mt-auto text-[var(--text-secondary)] text-sm">
                          <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-3">
                            <span className="flex items-center gap-2">
                              <span>Idade:</span>
                              <span className="text-[var(--text-primary)]">{data.basicInfo?.age || '?'}</span>
                            </span>
                            {data.basicInfo?.residence && (
                              <span className="truncate max-w-[120px] text-right" title={data.basicInfo.residence}>
                                🏠 {data.basicInfo.residence}
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between items-center text-xs opacity-70 pt-1">
                            <span>Atualizado:</span>
                            <span>{new Date(character.updatedAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
