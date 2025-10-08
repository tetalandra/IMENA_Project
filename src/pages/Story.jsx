import React, { useEffect, useMemo, useState } from "react"
import { client } from "../sanityClient"
import Ange from "../assets/storyPhotos/Ange2.jpg";
import Nziza from "../assets/storyPhotos/Nziza.jpg";

// Static testimonials data - keeping unchanged
const staticTestimonials = [
      { name: "Mutako", quote: "I had an amazing experience working with this team. They were professional, attentive, and always ready to listen to my needs. The project was delivered on time, with high quality, and far exceeded my expectations. I truly appreciate their dedication and would highly recommend them to anyone looking for reliable and outstanding service.", avatar: Ange},
      { name: "Muheto", quote: "I had an amazing experience working with this team. They were professional, attentive, and always ready to listen to my needs. The project was delivered on time, with high quality, and far exceeded my expectations. I truly appreciate their dedication and would highly recommend them to anyone looking for reliable and outstanding service.", avatar: Ange},
      { name: "Mfura", quote: "I had an amazing experience working with this team. They were professional, attentive, and always ready to listen to my needs. The project was delivered on time, with high quality, and far exceeded my expectations. I truly appreciate their dedication and would highly recommend them to anyone looking for reliable and outstanding service.", avatar:Nziza},
      { name: "Tunga", quote: "I had an amazing experience working with this team. They were professional, attentive, and always ready to listen to my needs. The project was delivered on time, with high quality, and far exceeded my expectations. I truly appreciate their dedication and would highly recommend them to anyone looking for reliable and outstanding service.", avatar: Nziza}
    ]

// Simple block content renderer for Sanity's portable text
const renderBlockContent = (blocks) => {
  if (!blocks || !Array.isArray(blocks)) return "No content available."
  
  return blocks.map((block, index) => {
    if (block._type === 'block') {
      return (
        <p key={index} className="mb-3">
          {block.children?.map((child, childIndex) => {
            if (child.marks && child.marks.length > 0) {
              let element = child.text
              child.marks.forEach(mark => {
                if (mark === 'strong') {
                  element = <strong key={childIndex}>{element}</strong>
                } else if (mark === 'em') {
                  element = <em key={childIndex}>{element}</em>
                }
              })
              return element
            }
            return child.text
          })}
        </p>
      )
    }
    return null
  })
}

export default function PaginatedShowcase() {
  const [pageIndex, setPageIndex] = useState(0)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    
    const fetchStories = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "story"]|order(_createdAt asc){
            _id,
            title,
            body,
            "imageUrl": coalesce(image.asset->url, mainImage.asset->url)
          }`
        )
        if (isMounted && Array.isArray(data)) {
          setStories(data)
        }
      } catch (error) {
        console.error('Error fetching stories:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchStories()
    
    return () => {
      isMounted = false
    }
  }, [])

  const current = useMemo(() => {
    if (loading || !stories[pageIndex]) {
      return {
        title: "Loading...",
        body: "Please wait while we load the story content.",
        image: "",
        testimonials: staticTestimonials
      }
    }
    
    const story = stories[pageIndex]
    return {
      title: story.title || "Untitled",
      body: story.body || [],
      image: story.imageUrl || "",
      testimonials: staticTestimonials
    }
  }, [pageIndex, stories, loading])

  const isFirst = pageIndex === 0
  const isLast = pageIndex === (stories.length - 1)

  const goPrev = () => !isFirst && setPageIndex((i) => Math.max(0, i - 1))
  const goNext = () => !isLast && setPageIndex((i) => Math.min(stories.length - 1, i + 1))
  const goTo = (i) => setPageIndex(i)

  return (
    <main className="w-full min-h-screen bg-white text-gray-900">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center text-gray-900">
            Our stories
          </h1>
          <div className="inline-flex items-center gap-2">
            <span className="text-xs text-gray-500">Page</span>
            <span className="text-sm font-medium text-blue-700">
              {pageIndex + 1} / {stories.length || 1}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {current.image ? (
            <img
                key={current.title}
              src={current.image}
              alt={current.title}
              className="h-[900px] sm:h-[500px] w-full object-cover transition-all duration-500 ease-out opacity-0 [animation:fade-in_.6s_ease-out_forwards]"
            />
            ) : (
              <div className="h-[900px] sm:h-[500px] w-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
            <div>
              <h2
                key={`title-${current.title}`}
                className="text-xl sm:text-2xl font-semibold text-gray-900 transition-all duration-500 ease-out opacity-0 [animation:slide-up_.5s_ease-out_forwards]"
              >
                {current.title}
              </h2>
              <div
                key={`desc-${current.title}`}
                className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed transition-all duration-500 ease-out opacity-0 [animation:slide-up_.6s_.1s_ease-out_forwards]"
              >
                {typeof current.body === 'string' ? current.body : renderBlockContent(current.body)}
              </div>
            </div>

            <nav className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goPrev}
                disabled={isFirst}
                aria-label="Previous page"
                className="inline-flex items-center gap-2 rounded-lg border border-[#1A74ED] bg-[#1A74ED] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1A74ED]/30 disabled:cursor-not-allowed disabled:border-blue-200 disabled:bg-blue-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-2" aria-label="Pagination">
                {stories.map((story, i) => (
                  <button
                    key={story._id || i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to page ${i + 1}`}
                    className={
                      "h-8 min-w-8 rounded-md border px-2 text-xs font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 " +
                      (i === pageIndex
                        ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50")
                    }
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={isLast}
                aria-label="Next page"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-200 disabled:bg-blue-200"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Testimonials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {current.testimonials.map((t, idx) => (
              <div key={idx} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <img src={t.avatar} alt={`${t.name} avatar`} className="h-12 w-12 aspect-square shrink-0 rounded-full object-cover ring-2 ring-blue-100" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{`"${t.quote}"`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slide-up { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </main>
  )
}


