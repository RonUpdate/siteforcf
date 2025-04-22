import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryGrid } from "@/components/category-grid"
import { FeaturedColoringPages } from "@/components/featured-coloring-pages"
import { Palette, Download, Users } from "lucide-react"
import { SearchForm } from "@/components/search-form"

export default function Home() {
  return (
    <>
      <section className="py-20 bg-gradient-to-b from-accent to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
              <Palette className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Beautiful Coloring Pages for Everyone
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Discover a world of creativity with our premium coloring pages from Creative Factory
            </p>
            <div className="max-w-md mx-auto mt-6 mb-6">
              <SearchForm />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/categories">
                <Button size="lg" className="gap-2">
                  <Palette className="w-5 h-5" />
                  Browse Categories
                </Button>
              </Link>
              <Link href="/featured">
                <Button size="lg" variant="outline" className="gap-2">
                  <Download className="w-5 h-5" />
                  Featured Pages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Popular Categories</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px]">
              Explore our most popular coloring page categories
            </p>
          </div>
          <CategoryGrid limit={6} />
          <div className="flex justify-center mt-12">
            <Link href="/categories">
              <Button variant="outline" size="lg">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-accent">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Featured Coloring Pages</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px]">
              Our hand-picked selection of beautiful coloring pages
            </p>
          </div>
          <FeaturedColoringPages />
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-500 dark:text-gray-400">
                High-quality coloring pages designed by professional artists
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Download</h3>
              <p className="text-gray-500 dark:text-gray-400">Download and start coloring immediately after purchase</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">For All Ages</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Coloring pages for children, adults, and everyone in between
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
