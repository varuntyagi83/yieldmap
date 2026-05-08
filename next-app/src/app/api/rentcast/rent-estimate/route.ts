import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');
  const bedrooms = searchParams.get('bedrooms');
  const bathrooms = searchParams.get('bathrooms');
  const squareFootage = searchParams.get('squareFootage');
  const propertyType = searchParams.get('propertyType');

  if (!address) return NextResponse.json({ error: 'address is required' }, { status: 400 });

  const params = new URLSearchParams();
  params.set('address', address);
  if (bedrooms) params.set('bedrooms', bedrooms);
  if (bathrooms) params.set('bathrooms', bathrooms);
  if (squareFootage) params.set('squareFootage', squareFootage);
  if (propertyType) params.set('propertyType', propertyType);

  try {
    const res = await fetch(`https://api.rentcast.io/v1/avm/rent?${params.toString()}`, {
      headers: {
        'X-Api-Key': process.env.RENTCAST_API_KEY ?? '',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data?.message ?? 'RentCast error' }, { status: res.status });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
