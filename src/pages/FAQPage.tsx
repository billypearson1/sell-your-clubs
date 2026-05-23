import { useState } from 'react'

const faqs = [
  {
    q: 'How do I get a quote?',
    a: 'Use our quote tool to search for your club by brand or model. Select the condition and specs, and your offer price will appear instantly. Add multiple clubs to build your basket.',
  },
  {
    q: 'How do I send my clubs?',
    a: "After accepting your offer, we'll email you a free postage label within 24 hours. Pack your clubs securely and drop them at your nearest drop-off point — check the courier details on your label.",
  },
  {
    q: 'When do I get paid?',
    a: 'Once we receive and verify your clubs, PayPal payment is sent within 2 working days.',
  },
  {
    q: 'What condition do you accept?',
    a: 'We accept clubs in New, Excellent, and Fair condition. Select the option that best matches your club during the quote process.',
  },
  {
    q: "What if my club isn't listed?",
    a: 'If your club is not listed in the search results, please contact us at hello@sellyourclubs.co.uk and we may be able to provide a manual quote.',
  },
  {
    q: 'How do you calculate your prices?',
    a: 'Our prices are based on current eBay sold prices. We regularly update our database to make sure our offers reflect the real market value of your clubs.',
  },
  {
    q: 'What happens if my clubs arrive in worse condition than stated?',
    a: "We'll contact you with a revised offer. You can accept the new offer or we'll return your clubs to you free of charge.",
  },
  {
    q: 'Do you buy left-handed clubs?',
    a: 'Yes — select Left in the dexterity field when getting your quote. Left-handed clubs have a slightly smaller resale market so prices may differ from right-handed equivalents.',
  },
]

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="mx-auto max-w-3xl space-y-10 py-10">
      <section>
        <h1 className="text-3xl font-semibold text-[#00243D]">Frequently Asked Questions</h1>
        <p className="mt-4 text-base leading-7 text-[#1A1A1A]/85">
          Everything you need to know about selling your clubs with us.
        </p>
      </section>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={f.q} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <button className="w-full text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-[#00243D]">{f.q}</p>
                <span className="text-sm text-[#00537E]">{openFaq === i ? '−' : '+'}</span>
              </div>
            </button>
            {openFaq === i ? <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/80">{f.a}</p> : null}
          </div>
        ))}
      </div>
    </div>
  )
}
