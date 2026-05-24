import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'

const categoryLabels = {
  review: 'Review',
  vs: 'Head to Head',
  guide: 'Guide',
}

const categoryColours = {
  review: 'bg-[#EAF7FF] text-[#00537E]',
  vs: 'bg-[#FFF3E0] text-[#E65100]',
  guide: 'bg-[#F1F8E9] text-[#2E7D32]',
}

export default function BlogPage() {
  return (
    <div className="space-y-10">
      <section className="-mt-10 -mx-4 sm:-mx-6 bg-[#00537E] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-semibold sm:text-4xl">Golf Club Guides</h1>
          <p className="mt-3 max-w-3xl text-lg">Driver reviews, head-to-head comparisons, and buying guides to help you make the right call on your next upgrade.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#00537E] hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColours[post.category]}`}>
                  {categoryLabels[post.category]}
                </span>
                <span className="text-xs text-slate-400">{post.date}</span>
              </div>
              <h2 className="mt-4 text-base font-semibold leading-6 text-[#00243D] group-hover:text-[#00537E]">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/80 line-clamp-3">
                {post.excerpt}
              </p>
              <p className="mt-4 text-sm font-semibold text-[#00537E]">Read more →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
