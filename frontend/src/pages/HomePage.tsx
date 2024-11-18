import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'

const Homepage: React.FC = () => {
    return (
        <>
            <section className="border-b bg-muted/50 w-full">
                <div className="py-16">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="mb-4 text-4xl font-bold">Welcome to Our Library</h1>
                        <p className="mb-6 text-lg text-muted-foreground">
                            Discover millions of resources at your fingertips. Our advanced library management system
                            makes it easier than ever to explore, learn, and grow.
                        </p>
                        <Link href="/catalog">
                            <Button>Learn More</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
                            <h2 className="mb-2 text-xl font-semibold">Feature {i}</h2>
                            <p className="text-sm text-muted-foreground">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-y bg-muted/50 w-full">
                <div className="py-12">
                    <div className="flex justify-between">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div
                                key={i}
                                className="h-16 w-16 rounded-full bg-muted"
                                aria-label={`Partner logo ${i}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="mb-4 text-2xl font-bold">Sign up for newsletter</h2>
                    <div className="flex space-x-2">
                        <Input type="email" placeholder="Enter your email" />
                        <Button>Subscribe</Button>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Homepage