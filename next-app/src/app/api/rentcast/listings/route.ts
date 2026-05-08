import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zipCode = searchParams.get('zipCode');
  const limit = searchParams.get('limit') ?? '500';
  const offset = searchParams.get('offset') ?? '0';

  if (!zipCode) return NextResponse.json({ error: 'zipCode is required' }, { status: 400 });

  const start = Date.now();
  const url = `https://api.rentcast.io/v1/listings/sale?zipCode=${zipCode}&status=Active&limit=${limit}&offset=${offset}`;

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
      console.error(`[RentCast listings] ${zipCode} error ${res.status}:`, data);
      return NextResponse.json({ error: data?.message ?? 'RentCast error', status: res.status }, { status: res.status });
    }

    const count = Array.isArray(data) ? data.length : (data?.listings?.length ?? 0);
    console.log(`[RentCast listings] zip=${zipCode} count=${count} ms=${Date.now() - start}`);

    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error(`[RentCast listings] ${zipCode} network error:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
