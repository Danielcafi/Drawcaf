// Edge Function: fedapay-verify
// Vérifie le statut d'une transaction Fedapay côté serveur, sans exposer la secretKey au client.
//
// Déployer avec :
//   supabase functions deploy fedapay-verify
//
// Environnement variables à configurer (Dashboard > Project Settings > API > Edge Functions secrets, ou CLI) :
//   FEDAPAY_SECRET_KEY  (clé secrète Fedapay)
//   FEDAPAY_BASE_URL    (optionnel, défaut https://api.fedapay.com/v1)
//
// Appel côté client :
//   const { data, error } = await supabase.functions.invoke('fedapay-verify', {
//     headers: { Authorization: `Bearer ${supabase.auth.getSession().session.access_token}` },
//     body: { transactionId },
//   })

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } }
)

async function handleVerifyRequest(req: Request) {
  const authHeader = req.headers.get('Authorization') || ''
  const match = authHeader.match(/^Bearer (.+)$/)
  const token = match ? match[1] : null

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token manquant' }), {
      status: 401,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !userData) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 403,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const secretKey = Deno.env.get('FEDAPAY_SECRET_KEY')
  const baseUrl = Deno.env.get('FEDAPAY_BASE_URL') || 'https://sandbox-api.fedapay.com/v1'

  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Fedapay non configuré sur le serveur' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { transactionId } = await req.json()
  if (!transactionId) {
    return new Response(JSON.stringify({ error: 'transactionId manquant' }), {
      status: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const response = await fetch(`${baseUrl}/transactions/${encodeURIComponent(transactionId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  })

  if (!response.ok) {
    return new Response(JSON.stringify({ error: `Erreur lors de la vérification: ${response.status}` }), {
      status: 502,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const data = await response.json()

  return new Response(JSON.stringify({ transaction: data.transaction ?? data }), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    return await handleVerifyRequest(req)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inattendue'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
