import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zipCode = searchParams.get('zipCode');

  if (!zipCode) return NextResponse.json({ error: 'zipCode is required' }, { status: 400 });

  // Serve from committed fixture if available — avoids burning RentCast quota
  const fixturePath = join(process.cwd(), 'src', 'data', 'fixtures', zipCode, 'market.json');
  if (existsSync(fixturePath)) {
    console.log(`[RentCast market] ${zipCode} served from fixture`);
    const data = JSON.parse(readFileSync(fixturePath, 'utf-8'));
    return NextResponse.json(data);
  }

  const key = process.env.RENTCAST_API_KEY ?? '';
  if (!key) return NextResponse.json({ error: 'RENTCAST_API_KEY not configured' }, { status: 500 });

  const start = Date.now();
  const url = `https://api.rentcast.io/v1/markets?zipCode=${zipCode}&historyRange=6`;

  try {
    const res = await fetch(url, {
      headers: { 'X-Api-Key': key, Accept: 'application/json' },
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`[RentCast market] ${zipCode} error ${res.status}:`, data);
      return NextResponse.json({ error: data?.message ?? 'RentCast error' }, { status: res.status });
    }

    console.log(`[RentCast market] ${zipCode} ms=${Date.now() - start}`);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
