export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  discount_price: number | null
  stock: number
  category_id: string | null
  featured: boolean
  created_at: string
  updated_at: string
  category?: Category
  images?: ProductImage[]
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  is_primary: boolean
  display_order: number
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  featured_image: string | null
  author: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  categories?: BlogCategory[]
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  name: string | null
  role: string
  created_at: string
}
