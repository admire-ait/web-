import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_WAKATIME_API_KEY;
    
    if (!apiKey || apiKey === 'your-wakatime-api-key-here') {
      return NextResponse.json({ error: 'WakaTime API key not configured' }, { status: 400 });
    }

    const response = await fetch('https://wakatime.com/api/v1/users/current', {
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Invalid WakaTime API key' }, { status: 401 });
      }
      throw new Error(`WakaTime API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch WakaTime user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}