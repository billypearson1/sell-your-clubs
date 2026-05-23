import { serve } from 'https://deno.land/std@0.203.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.4'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') ?? ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

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
  address_line1: string
  address_line2: string
  town: string
  county: string
  postcode: string
  paypal_email: string
  items: OrderItem[]
  total_amount: number
}

function formatItem(item: OrderItem) {
  const specs = Object.entries(item.specs)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
    .join(' | ')
  return `<li style="margin-bottom:16px"><strong>${item.title}</strong><br/>Condition: ${item.condition}<br/>Price: GBP ${item.price.toFixed(2)}<br/><small>${specs}</small></li>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let body: Payload
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { full_name, email, phone, address_line1, address_line2, town, county, postcode, paypal_email, items, total_amount } = body

  if (!full_name || !email || !phone || !address_line1 || !town || !postcode || !paypal_email || !items?.length || !total_amount) {
    return new Response(JSON.stringify({ error: 'Missing required order fields' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const collection_address = [address_line1, address_line2, town, county, postcode].filter(Boolean).join(', ')

  const { data: order, error: insertError } = await supabase
    .from('orders')
    .insert([{
      full_name,
      email,
      phone,
      address_line1,
      address_line2,
      town,
      county,
      postcode,
      collection_address,
      paypal_email,
      items,
      total_amount,
      status: 'pending',
    }])
    .select()
    .single()

  if (insertError) {
    console.error('Order insert failed', insertError)
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const itemHtml = items.map(formatItem).join('')

  const adminHtml = `<div style="font-family:Arial,sans-serif;color:#1A1A1A;line-height:1.6;max-width:600px;margin:0 auto">
  <div style="background:#00243D;padding:24px 32px;border-radius:8px 8px 0 0">
    <h1 style="color:white;margin:0;font-size:20px">New Order — Sell Your Clubs</h1>
  </div>
  <div style="background:#f4f4f4;padding:32px;border-radius:0 0 8px 8px">
    <p style="margin:0 0 24px 0">A new order has been submitted. Please review the details below and send the free postage label to the seller within 24 hours.</p>
    <h2 style="color:#00243D;font-size:16px;margin:0 0 12px 0">Seller details</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <tr><td style="padding:8px 0;color:#555;width:140px">Name</td><td style="padding:8px 0;font-weight:600">${full_name}</td></tr>
      <tr><td style="padding:8px 0;color:#555">Email</td><td style="padding:8px 0;font-weight:600">${email}</td></tr>
      <tr><td style="padding:8px 0;color:#555">Phone</td><td style="padding:8px 0;font-weight:600">${phone}</td></tr>
      <tr><td style="padding:8px 0;color:#555">Collection address</td><td style="padding:8px 0;font-weight:600">${collection_address}</td></tr>
      <tr><td style="padding:8px 0;color:#555">PayPal email</td><td style="padding:8px 0;font-weight:600">${paypal_email}</td></tr>
    </table>
    <h2 style="color:#00243D;font-size:16px;margin:0 0 12px 0">Order summary</h2>
    <ul style="padding-left:18px;margin:0 0 24px 0">${itemHtml}</ul>
    <div style="background:#00537E;color:white;padding:16px 24px;border-radius:8px;margin-bottom:24px">
      <p style="margin:0;font-size:18px;font-weight:600">Total offer: £${total_amount.toFixed(2)}</p>
    </div>
    <h2 style="color:#00243D;font-size:16px;margin:0 0 12px 0">Action required</h2>
    <ol style="padding-left:18px;margin:0;color:#333">
      <li style="margin-bottom:8px">Send a free postage label to <strong>${email}</strong> within 24 hours</li>
      <li style="margin-bottom:8px">Inspect clubs on arrival and confirm condition</li>
      <li style="margin-bottom:8px">Send £${total_amount.toFixed(2)} to <strong>${paypal_email}</strong> via PayPal within 2 working days</li>
    </ol>
  </div>
  <p style="text-align:center;color:#999;font-size:12px;margin-top:24px">Sell Your Clubs — sellyourclubs.co.uk</p>
</div>`

  const customerHtml = `<div style="font-family:Arial,sans-serif;color:#1A1A1A;line-height:1.6;max-width:600px;margin:0 auto">
  <div style="background:#00243D;padding:24px 32px;border-radius:8px 8px 0 0">
    <h1 style="color:white;margin:0;font-size:20px">Order confirmed — Sell Your Clubs</h1>
  </div>
  <div style="background:#f4f4f4;padding:32px;border-radius:0 0 8px 8px">
    <p style="margin:0 0 16px 0">Hi ${full_name},</p>
    <p style="margin:0 0 24px 0">Thank you for your order. We've received your quote and everything is confirmed. Here's what happens next:</p>
    
    <h2 style="color:#00243D;font-size:16px;margin:0 0 12px 0">What happens next</h2>
    <ol style="padding-left:18px;margin:0 0 24px 0;color:#333">
      <li style="margin-bottom:8px">We'll email your <strong>free postage label</strong> to this address within 24 hours</li>
      <li style="margin-bottom:8px">Pack your clubs securely and drop them off at your nearest post office</li>
      <li style="margin-bottom:8px">Once we receive and verify your clubs we'll send <strong>£${total_amount.toFixed(2)}</strong> to your PayPal within 2 working days</li>
    </ol>

    <h2 style="color:#00243D;font-size:16px;margin:0 0 12px 0">Your order summary</h2>
    <ul style="padding-left:18px;margin:0 0 24px 0">${itemHtml}</ul>

    <div style="background:#00537E;color:white;padding:16px 24px;border-radius:8px;margin-bottom:24px">
      <p style="margin:0;font-size:18px;font-weight:600">Total offer: £${total_amount.toFixed(2)}</p>
    </div>

    <p style="margin:0;color:#555">If you have any questions please reply to this email or contact us at <a href="mailto:hello@sellyourclubs.co.uk" style="color:#00537E">hello@sellyourclubs.co.uk</a>.</p>
  </div>
  <p style="text-align:center;color:#999;font-size:12px;margin-top:24px">Sell Your Clubs — sellyourclubs.co.uk</p>
</div>`

  const adminEmailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Sell Your Clubs <no-reply@sellyourclubs.co.uk>',
      to: [OWNER_EMAIL],
      subject: `New order from ${full_name} — £${total_amount.toFixed(2)}`,
      html: adminHtml,
    }),
  })

  if (!adminEmailResponse.ok) {
    const text = await adminEmailResponse.text()
    console.error('Resend admin email error', text)
    return new Response(JSON.stringify({ error: 'Failed to send notification email' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const customerEmailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Sell Your Clubs <no-reply@sellyourclubs.co.uk>',
      to: [email],
      subject: 'Your Sell Your Clubs order is confirmed',
      html: customerHtml,
    }),
  })

  if (!customerEmailResponse.ok) {
    const text = await customerEmailResponse.text()
    console.error('Resend customer email error', text)
  }

  return new Response(JSON.stringify({ order }), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
