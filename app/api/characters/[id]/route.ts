import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// GET - Buscar ficha específica (público)
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    if (!isSupabaseConfigured) {
        return NextResponse.json(
            { error: 'Supabase not configured' },
            { status: 503 }
        );
    }

    try {
        const { id } = await context.params;

        const { data, error } = await supabase
            .from('Character')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            const { data: retryData, error: retryError } = await supabase
                .from('character')
                .select('*')
                .eq('id', id)
                .single();

            if (retryError || !retryData) {
                return NextResponse.json(
                    { error: 'Character not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json(retryData);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching character:', error);
        return NextResponse.json(
            { error: 'Failed to fetch character' },
            { status: 500 }
        );
    }
}

async function updateCharacterHandler(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    if (!isSupabaseConfigured) {
        return NextResponse.json(
            { error: 'Supabase not configured' },
            { status: 503 }
        );
    }

    try {
        const { id } = await context.params;
        const body = await request.json();
        const { name, occupation, data } = body;

        const { data: updatedCharacter, error } = await supabase
            .from('Character')
            .update({
                name: name || 'Sem Nome',
                occupation: occupation || null,
                data: data,
                updatedAt: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            const { data: retryCharacter, error: retryError } = await supabase
                .from('character')
                .update({
                    name: name || 'Sem Nome',
                    occupation: occupation || null,
                    data: data,
                    updatedAt: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (retryError) throw retryError;
            return NextResponse.json(retryCharacter);
        }

        return NextResponse.json(updatedCharacter);
    } catch (error) {
        console.error('Error updating character:', error);
        return NextResponse.json(
            { error: 'Failed to update character' },
            { status: 500 }
        );
    }
}

// PUT e PATCH - Atualizar ficha (público)
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    return updateCharacterHandler(request, context);
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    return updateCharacterHandler(request, context);
}

// DELETE - Deletar ficha (público)
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    if (!isSupabaseConfigured) {
        return NextResponse.json(
            { error: 'Supabase not configured' },
            { status: 503 }
        );
    }

    try {
        const { id } = await context.params;

        const { error } = await supabase
            .from('Character')
            .delete()
            .eq('id', id);

        if (error) {
            const { error: retryError } = await supabase
                .from('character')
                .delete()
                .eq('id', id);

            if (retryError) throw retryError;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting character:', error);
        return NextResponse.json(
            { error: 'Failed to delete character' },
            { status: 500 }
        );
    }
}
