// app/api/data/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
    }
}
