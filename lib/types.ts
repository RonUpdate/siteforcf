// Добавим новые типы для заказов и корзины
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discount_price?: number
  stock: number
  category_id: string
  featured: boolean
  created_at: string
  updated_at: string
  images?: ProductImage[]
  category?: Category
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  is_primary: boolean
  display_order: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  author: string
  published: boolean
  published_at: string
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

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  user_id?: string
  customer_email: string
  customer_name: string
  customer_phone?: string
  shipping_address: string
  total_amount: number
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  notes?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  price: number
  created_at: string
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentMethod = "cash" | "card" | "bank_transfer"
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

// Добавим новый тип для заметок
export interface Note {
  id: string
  user_id: string
  title: string
  content: string | null
  created_at: string
  updated_at: string
}
