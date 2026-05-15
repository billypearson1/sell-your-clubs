import { serve } from 'https://deno.land/std@0.203.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.4'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') ?? ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY || !OWNER_EMAIL) {
  console.error('Missing required environment variables for send-order-email function.')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

interface OrderItem {
  title: string
  type: string
  specs: Record<string, string>
  condition: string
  price: number
}

interface Payload {
  full_name: string
  email: string
  phone: string
  collection_address: string
  paypal_email: string
  items: OrderItem[]
  total_amount: number
}

function formatItem(item: OrderItem) {
  const specs = Object.entries(item.specs)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
    .join(' · ')
  return `<li style="margin-bottom: 16px;"><strong>${item.title}</strong><br/>Condition: ${item.condition}<br/>Price: £${item.price.toFixed(2)}<br/><small>${specs}</small></li>`
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } })
  }

  let body: Payload
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  const { full_name, email, phone, collection_address, paypal_email, items, total_amount } = body
  if (!full_name || !email || !phone || !collection_address || !paypal_email || !items?.length || !total_amount) {
    return new Response(JSON.stringify({ error: 'Missing required order fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  const { data: order, error: insertError } = await supabase
    .from('orders')
    .insert([
      {
        full_name,
        email,
        phone,
        collection_address,
        paypal_email,
        items,
        total_amount,
        status: 'pending',
      },
    ])
    .select()
    .single()

  if (insertError) {
    console.error('Order insert failed', insertError)
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }

  const itemHtml = items.map(formatItem).join('')
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1A1A1A;line-height:1.5;">
      <h2 style="color:#00243D;">New Sell Your Clubs order</h2>
      <p><strong>Seller:</strong> ${full_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Collection address:</strong> ${collection_address}</p>
      <p><strong>PayPal email:</strong> ${paypal_email}</p>
      <h3 style="margin-top:24px;color:#00243D;">Quote summary</h3>
      <ul style="padding-left:18px;">${itemHtml}</ul>
      <p style="font-weight:600;margin-top:16px;">Total: £${total_amount.toFixed(2)}</p>
      <p style="margin-top:24px;color:#00537E;">Please review the order and send the free postage label to the seller.</p>
    </div>
  `

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Sell Your Clubs <no-reply@sell-your-clubs.com>',
      to: [OWNER_EMAIL],
      subject: 'New Sell Your Clubs order submitted',
      html,
    }),
  })

  if (!emailResponse.ok) {
    const text = await emailResponse.text()
    console.error('Resend error', text)
    return new Response(JSON.stringify({ error: 'Failed to send notification email' }), { status: 502, headers: { 'Content-Type': 'application/json' } })
  }

  return new Response(JSON.stringify({ order }), { status: 201, headers: { 'Content-Type': 'application/json' } })
})
