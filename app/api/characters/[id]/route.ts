import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Props = {
    params: Promise<{ id: string }>
}

// GET - Buscar ficha específica (público)
export async function GET(
    request: NextRequest,
    props: Props
) {
    try {
        const params = await props.params;
        const { id } = params;

        const character = await prisma.character.findUnique({
            where: { id }
        });

        if (!character) {
            return NextResponse.json(
                { error: 'Character not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(character);
    } catch (error) {
        console.error('Error fetching character:', error);
        return NextResponse.json(
            { error: 'Failed to fetch character' },
            { status: 500 }
        );
    }
}

// PUT - Atualizar ficha (público - qualquer um pode editar)
export async function PUT(
    request: NextRequest,
    props: Props
) {
    try {
        const params = await props.params;
        const { id } = params;
        const body = await request.json();
        const { name, occupation, data } = body;

        const character = await prisma.character.update({
            where: { id },
            data: {
                name: name || 'Sem Nome',
                occupation: occupation || null,
                data: data
            }
        });

        return NextResponse.json(character);
    } catch (error) {
        console.error('Error updating character:', error);
        return NextResponse.json(
            { error: 'Failed to update character' },
            { status: 500 }
        );
    }
}

// DELETE - Deletar ficha (público - qualquer um pode deletar)
export async function DELETE(
    request: NextRequest,
    props: Props
) {
    try {
        const params = await props.params;
        const { id } = params;

        await prisma.character.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting character:', error);
        return NextResponse.json(
            { error: 'Failed to delete character' },
            { status: 500 }
        );
    }
}
