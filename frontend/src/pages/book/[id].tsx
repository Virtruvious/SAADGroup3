import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

const BookDetail: React.FC = () => {
  // const router = useRouter()
  // const { id } = router.query

  //replace with actual API call in production
  const bookData = {
    title: 'James Bond',
    price: '£20',
    tagline: 'Our best pick of the year',
    quote: '"No time to die"',
    description: 'Some random text',
    publicationDate: '2024',
    author: 'Ian Fleming',
    additionalInfo: 'and more...',
    image: '/placeholder.svg?height=400&width=300'
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="text-blue-500 hover:text-blue-600">
                  Home
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <Link href="/all" className="text-blue-500 hover:text-blue-600">
                  All
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-500">{bookData.title}</li>
            </ol>
          </nav>
        </div>

        {/* Book Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted">
            <Image
              src={bookData.image}
              alt={bookData.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* right coulnm - details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{bookData.title}</h1>
            <p className="text-2xl font-semibold text-blue-600">{bookData.price}</p>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-600">
                {bookData.tagline}
              </h2>
              <p className="text-lg italic">
                {bookData.quote}
              </p>
              <p>{bookData.description}</p>
              
              <div className="space-y-2">
                <p><strong>Publication Date:</strong> {bookData.publicationDate}</p>
                <p><strong>Author:</strong> {bookData.author}</p>
                <p>{bookData.additionalInfo}</p>
              </div>
            </div>

            {/* action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                className="flex-1" 
                onClick={() => alert('Borrow functionality to be implemented')}
              >
                Borrow
              </Button>
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={() => alert('Reserve functionality to be implemented')}
              >
                Reserve
              </Button>
              <Button 
                className="flex-1" 
                variant="secondary"
                onClick={() => alert('Add to Cart functionality to be implemented')}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail