export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 py-10">
      <section>
        <h1 className="text-3xl font-semibold text-[#00243D]">Contact Us</h1>
        <p className="mt-4 text-base leading-7 text-[#1A1A1A]/85">
          Have a question or need help with your order? We're here to help.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="font-semibold text-[#00243D]">Email us</p>
          <p className="mt-2 text-sm text-[#1A1A1A]/80">For general enquiries, quotes or order questions:</p>
          <a href="mailto:hello@sellyourclubs.co.uk" className="mt-3 block text-sm font-semibold text-[#00537E] hover:underline">
            hello@sellyourclubs.co.uk
          </a>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="font-semibold text-[#00243D]">Response time</p>
          <p className="mt-2 text-sm text-[#1A1A1A]/80">We aim to respond to all enquiries within 1 working day.</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-[#F4F4F4] p-6">
        <p className="font-semibold text-[#00243D]">Before you contact us</p>
        <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/85">
          Check our <a href="/faq" className="text-[#00537E] hover:underline">FAQ page</a> — your question may already be answered there.
        </p>
      </div>
    </div>
  )
}
