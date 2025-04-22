import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type ProductProps = {
  id: string
  name: string
  price: number
  image_url: string
  slug: string
  stock_quantity: number
  is_featured: boolean
}

export function ProductCard({ product }: { product: ProductProps }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 w-full">
          <Image
            src={product.image_url || "/placeholder.svg?height=192&width=384&query=product"}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.is_featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-lg font-bold mt-2">{formatPrice(product.price)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          {product.stock_quantity > 0 ? (
            <Badge variant="outline" className="bg-green-50">
              In Stock
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50">
              Out of Stock
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
