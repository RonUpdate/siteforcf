import { ArrowLeft, Palette, Download, Users, Heart } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <Link href="/" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter mb-4">About Art Market</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px]">
          Discover the story behind our premium coloring pages
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            At Art Market, we believe in the power of creativity and mindfulness. Our mission is to provide high-quality
            coloring pages that inspire creativity, reduce stress, and bring joy to people of all ages.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Each coloring page is carefully designed by professional artists from Creative Factory, ensuring a premium
            experience for our customers.
          </p>
        </div>
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
          <Image src="/artist-coloring-pages.png" alt="Artist creating coloring pages" fill className="object-cover" />
        </div>
      </div>

      <div className="bg-accent rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Art Market?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
            <p className="text-gray-600 dark:text-gray-300">
              High-quality coloring pages designed by professional artists with attention to detail
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Download</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Purchase and download immediately, ready to print and color
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">For Everyone</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Coloring pages for all ages and skill levels, from children to adults
            </p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Meet the Team</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
              <Image src="/confident-leader.png" alt="Sarah Johnson" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">Sarah Johnson</h3>
            <p className="text-gray-500">Founder & Creative Director</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
              <Image src="/confident-leader.png" alt="Michael Chen" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">Michael Chen</h3>
            <p className="text-gray-500">Lead Artist</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
              <Image src="/confident-leader.png" alt="Emily Rodriguez" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">Emily Rodriguez</h3>
            <p className="text-gray-500">Customer Experience</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you! Contact us at{" "}
          <a href="mailto:support@artmarket.com" className="text-primary hover:underline">
            support@artmarket.com
          </a>{" "}
          or follow us on social media.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="icon">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Facebook</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
