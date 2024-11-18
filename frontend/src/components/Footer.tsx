import React from 'react'
import Link from "next/link"

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="mb-4 text-xl font-semibold">Footer Information</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-medium">About Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#">About the Library</Link>
              </li>
              <li>
                <Link href="#">Hours & Locations</Link>
              </li>
              <li>
                <Link href="#">Staff Directory</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#">Borrowing</Link>
              </li>
              <li>
                <Link href="#">Research Help</Link>
              </li>
              <li>
                <Link href="#">Teaching Support</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#">Contact Us</Link>
              </li>
              <li>
                <Link href="#">Feedback</Link>
              </li>
              <li>
                <Link href="#">Social Media</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer