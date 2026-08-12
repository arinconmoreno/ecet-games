import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const keyPrefix = process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) || 'missing';

  try {
    const sb = getServiceSupabase();
    const { data, error } = await sb.from('users').select('count').single();

    return NextResponse.json({
      supabaseUrl: url,
      hasAnonKey: hasAnon,
      hasServiceKey: hasService,
      keyStartsWith: keyPrefix,
      queryResult: data,
      queryError: error?.message || null,
    });
  } catch (err: any) {
    return NextResponse.json({
      supabaseUrl: url,
      hasAnonKey: hasAnon,
      hasServiceKey: hasService,
      keyStartsWith: keyPrefix,
      error: err.message,
    });
  }
}
