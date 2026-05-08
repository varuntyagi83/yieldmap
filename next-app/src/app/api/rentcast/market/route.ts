import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zipCode = searchParams.get('zipCode');

  if (!zipCode) return NextResponse.json({ error: 'zipCode is required' }, { status: 400 });

  const start = Date.now();
  const url = `https://api.rentcast.io/v1/markets?zipCode=${zipCode}&historyRange=6`;

  try {
    const res = await fetch(url, {
      headers: {
        'X-Api-Key': process.env.RENTCAST_API_KEY ?? '',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`[RentCast market] ${zipCode} error ${res.status}:`, data);
      return NextResponse.json({ error: data?.message ?? 'RentCast error' }, { status: res.status });
    }

    console.log(`[RentCast market] zip=${zipCode} ms=${Date.now() - start}`);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
