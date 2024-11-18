import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

// helper function to format category name
const formatCategoryName = (category: string) => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const CategoryPage: React.FC = () => {
  const router = useRouter()
  const { category } = router.query

  // sample data, need api
  const items = Array.from({ length: 28 }, (_, i) => ({
    id: `item-${i}`,
    title: i === 0 ? 'James Bond' : i === 1 ? 'Ben 10' : `Book ${i + 1}`,
    image: `/placeholder.svg?height=250&width=180`,
    author: `Author ${i + 1}`,
    link: `#`
  }))

  return (
    <div className="min-h-screen">
      {/* Category Title */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-center">
            {category ? formatCategoryName(category.toString()) : 'Loading...'}
          </h1>
        </div>
      </div>

      {/* grid layput */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {items.map((item) => (
            <Link href={`/book/${item.id}`} key={item.id} className="group">
              <div className="space-y-3">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={180}
                    height={250}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-medium leading-none group-hover:text-primary">
                    {item.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {item.author}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryPage