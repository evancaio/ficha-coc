import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Listar todas as fichas (público)
export async function GET() {
    try {
        const characters = await prisma.character.findMany({
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return NextResponse.json(characters);
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

        const character = await prisma.character.create({
            data: {
                name: name || 'Sem Nome',
                occupation: occupation || null,
                data: data
            }
        });

        return NextResponse.json(character);
    } catch (error) {
        console.error('Error creating character:', error);
        return NextResponse.json(
            { error: 'Failed to create character' },
            { status: 500 }
        );
    }
}
