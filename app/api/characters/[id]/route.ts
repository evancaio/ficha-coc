import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        const character = await prisma.character.findUnique({
            where: {
                id,
                userId, // Ensure ownership
            },
        });

        if (!character) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(character);
    } catch (error) {
        console.error("[CHARACTER_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { name, occupation, data } = body;

        const character = await prisma.character.findUnique({
            where: { id, userId },
        });

        if (!character) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const updatedCharacter = await prisma.character.update({
            where: {
                id,
            },
            data: {
                name,
                occupation,
                data,
            },
        });

        return NextResponse.json(updatedCharacter);
    } catch (error) {
        console.error("[CHARACTER_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            // 401
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        const character = await prisma.character.findUnique({
            where: { id, userId },
        });

        if (!character) {
            return new NextResponse("Not Found", { status: 404 });
        }

        await prisma.character.delete({
            where: {
                id,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[CHARACTER_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
