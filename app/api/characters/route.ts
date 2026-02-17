import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const characters = await prisma.character.findMany({
            where: {
                userId,
            },
            orderBy: {
                updatedAt: "desc",
            },
            select: {
                id: true,
                name: true,
                occupation: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(characters);
    } catch (error) {
        console.error("[CHARACTERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, occupation, data } = body;

        if (!name || !data) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const character = await prisma.character.create({
            data: {
                userId,
                name,
                occupation,
                data,
            },
        });

        return NextResponse.json(character);
    } catch (error) {
        console.error("[CHARACTERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
