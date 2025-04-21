import Image from "next/image"
import Link from "next/link"
import { AddToCartButton } from "./cart/add-to-cart-button"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { name, slug, price, discount_price, images } = product
  const primaryImage = images?.find((img) => img.is_primary)?.image_url

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/products/${slug}`} className="block aspect-square overflow-hidden">
        <Image
          src={primaryImage || "/placeholder.svg?height=300&width=300&query=product"}
          alt={name}
          width={300}
          height={300}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="p-4">
        <Link href={`/products/${slug}`} className="block">
          <h3 className="mb-2 text-sm font-medium text-gray-900 line-clamp-2">{name}</h3>
        </Link>

        <div className="mb-4 flex items-center">
          {discount_price ? (
            <>
              <span className="text-lg font-bold text-gray-900">{discount_price.toLocaleString()} ₽</span>
              <span className="ml-2 text-sm text-gray-500 line-through">{price.toLocaleString()} ₽</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">{price.toLocaleString()} ₽</span>
          )}
        </div>

        <AddToCartButton product={product} className="w-full" />
      </div>
    </div>
  )
}
