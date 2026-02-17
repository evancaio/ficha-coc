import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Listar todas as fichas (público)
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('Character') // Tenta primeiro com PascalCase que o Prisma cria
            .select('*')
            .order('updatedAt', { ascending: false });

        if (error) {
            // Se falhar, tenta minúsculo (caso o usuário tenha criado tabela manualmente)
            const { data: retryData, error: retryError } = await supabase
                .from('character')
                .select('*')
                .order('updatedAt', { ascending: false });

            if (retryError) throw retryError;
            return NextResponse.json(retryData);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching characters:', error);
        return NextResponse.json(
            { error: 'Failed to fetch characters' },
            { status: 500 }
        );
    }
}

// POST - Criar nova ficha (público)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, occupation, data } = body;

        // Tenta inserir na tabela Character (padrão Prisma)
        const { data: newCharacter, error } = await supabase
            .from('Character')
            .insert([
                {
                    name: name || 'Sem Nome',
                    occupation: occupation || null,
                    data: data,
                    updatedAt: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            // Se der erro (provavelmente tabela minúscula), tenta 'character'
            const { data: retryCharacter, error: retryError } = await supabase
                .from('character')
                .insert([
                    {
                        name: name || 'Sem Nome',
                        occupation: occupation || null,
                        data: data,
                        updatedAt: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (retryError) throw retryError;
            return NextResponse.json(retryCharacter);
        }

        return NextResponse.json(newCharacter);
    } catch (error) {
        console.error('Error creating character:', error);
        return NextResponse.json(
            { error: 'Failed to create character' },
            { status: 500 }
        );
    }
}
