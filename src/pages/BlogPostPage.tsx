import { useParams, Link } from 'react-router-dom'
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

function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="mt-8 mb-3 text-xl font-semibold text-[#00243D]">
          {line.replace('## ', '')}
        </h2>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="mb-2" />)
    } else {
      elements.push(
        <p key={key++} className="mb-4 text-base leading-7 text-[#1A1A1A]/85">
          {line}
        </p>
      )
    }
  }

  return elements
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h1 className="text-2xl font-semibold text-[#00243D]">Post not found</h1>
        <Link to="/blog" className="mt-6 inline-block text-sm font-semibold text-[#00537E] hover:underline">
          ← Back to guides
        </Link>
      </div>
    )
  }

  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <div className="mx-auto max-w-3xl space-y-10 py-6">
      <div>
        <Link to="/blog" className="text-sm font-semibold text-[#00537E] hover:underline">
          ← Back to guides
        </Link>
      </div>

      <article>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColours[post.category]}`}>
            {categoryLabels[post.category]}
          </span>
          <span className="text-sm text-slate-400">{post.date}</span>
        </div>

        <h1 className="mt-4 text-3xl font-semibold leading-tight text-[#00243D] sm:text-4xl">
          {post.title}
        </h1>

        <p className="mt-4 text-lg leading-7 text-[#1A1A1A]/70">
          {post.excerpt}
        </p>

        <div className="mt-2 border-t border-slate-200" />

        <div className="mt-6">
          {renderContent(post.content)}
        </div>
      </article>

      <div className="rounded-[28px] bg-[#00537E] p-8 text-white">
        <h2 className="text-xl font-semibold">Thinking about selling your clubs?</h2>
        <p className="mt-2 text-sm leading-7">Get an instant valuation. Free postage, fast PayPal payment.</p>
        <Link
          to="/quote"
          className="mt-4 inline-flex items-center justify-center rounded-[8px] bg-white px-6 py-3 text-sm font-semibold text-[#00537E] hover:bg-slate-100"
        >
          Get a quote
        </Link>
      </div>

      {otherPosts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-[#00243D]">More guides</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {otherPosts.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#00537E]"
              >
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColours[p.category]}`}>
                  {categoryLabels[p.category]}
                </span>
                <p className="mt-3 text-sm font-semibold leading-5 text-[#00243D] group-hover:text-[#00537E]">
                  {p.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
