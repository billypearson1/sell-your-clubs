import { Link } from 'react-router-dom'

export default function PriceMatchPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-[#00243D]">Price Match Guarantee</h1>
      <p className="mt-4 text-sm text-[#1A1A1A]/80">If you find a lower price for the exact same golf club from another UK-based golf buyback site, we'll beat that price — or pay you an extra £10. To claim, provide a link to the competing price and order details and we will verify the offer. Terms and conditions apply.</p>
      <div className="mt-6">
        <Link to="/quote" className="rounded-full bg-[#00537E] px-6 py-3 text-sm font-semibold text-white">Get your quote</Link>
      </div>
    </div>
  )
}
