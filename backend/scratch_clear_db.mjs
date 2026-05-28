import { createSupabaseClient } from './lib/supabase.mjs';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const REST_BASE = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1`;

function buildHeaders() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };
}

async function clearTable(table) {
  // PostgREST needs a filter to delete, we can use id.neq=null or something similar
  // Some tables might have 'id', some 'uuid'. Most have 'id'.
  const url = `${REST_BASE}/${table}?id=not.is.null`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: buildHeaders(),
  });
  
  if (!response.ok) {
    const err = await response.text();
    console.error(`Failed to clear ${table}:`, err);
  } else {
    console.log(`Successfully cleared ${table}`);
  }
}

async function run() {
  console.log('Clearing simulation data...');
  await clearTable('investigator_feedback');
  await clearTable('str_ctr_reports');
  await clearTable('fraud_alerts');
  await clearTable('transactions');
  console.log('Done! The database is now reset and ready for the first transaction.');
}

run();
