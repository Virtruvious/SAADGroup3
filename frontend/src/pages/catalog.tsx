import React from 'react'
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

const CatalogPage: React.FC = () => {
    // sample data for the lists
    const newItems = Array.from({ length: 7 }, (_, i) => ({
        id: `new-${i}`,
        title: `New Book ${i + 1}`,
        image: `/placeholder.svg?height=200&width=150`,
    }))

    const featuredItems = Array.from({ length: 7 }, (_, i) => ({
        id: `featured-${i}`,
        title: `Featured Book ${i + 1}`,
        image: `/placeholder.svg?height=200&width=150`,
    }))

    const recentItems = Array.from({ length: 7 }, (_, i) => ({
        id: `recent-${i}`,
        title: `Recent Book ${i + 1}`,
        image: `/placeholder.svg?height=200&width=150`,
    }))

    const ScrollableList = ({ title, items, viewMoreLink }: {
        title: string,
        items: Array<{ id: string; title: string; image: string }>,
        viewMoreLink: string
    }) => (
        <section className="py-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <Link
                    href={`/category/${encodeURIComponent(title.toLowerCase().replace(' ', '-'))}`}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    View More
                </Link>
            </div>
            <div className="relative">
                <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                    {items.map((item) => (
                        <Link href={`/book/${item.id}`} key={item.id} className="flex-none">
                            <div className="w-[150px] space-y-3">
                                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={150}
                                        height={200}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="text-sm">{item.title}</div>
                            </div>
                        </Link>
                    ))}
                </div>
                <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full bg-background p-2 shadow-lg"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
        </section >
    )

    return (
        <div className="space-y-4">
            <ScrollableList
                title="New List"
                items={newItems}
                viewMoreLink="/catalog/new"
            />
            <ScrollableList
                title="Some random title"
                items={featuredItems}
                viewMoreLink="/catalog/featured"
            />
            <ScrollableList
                title="Recent Views"
                items={recentItems}
                viewMoreLink="/catalog/recent"
            />
        </div>
    )
}

export default CatalogPage