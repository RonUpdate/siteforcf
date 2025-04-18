-- Enable Row Level Security (RLS) on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- PRODUCTS TABLE POLICIES

-- Allow public read access to products
CREATE POLICY "Products are publicly viewable"
ON products
FOR SELECT
USING (true);

-- Only authenticated admin users can insert products
CREATE POLICY "Only admins can create products"
ON products
FOR INSERT
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- Only authenticated admin users can update products
CREATE POLICY "Only admins can update products"
ON products
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- Only authenticated admin users can delete products
CREATE POLICY "Only admins can delete products"
ON products
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- CATEGORIES TABLE POLICIES

-- Allow public read access to categories
CREATE POLICY "Categories are publicly viewable"
ON categories
FOR SELECT
USING (true);

-- Only authenticated admin users can insert categories
CREATE POLICY "Only admins can create categories"
ON categories
FOR INSERT
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- Only authenticated admin users can update categories
CREATE POLICY "Only admins can update categories"
ON categories
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- Only authenticated admin users can delete categories
CREATE POLICY "Only admins can delete categories"
ON categories
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- BLOG_POSTS TABLE POLICIES

-- Allow public read access to blog posts
CREATE POLICY "Blog posts are publicly viewable"
ON blog_posts
FOR SELECT
USING (true);

-- Only authenticated admin users can insert blog posts
CREATE POLICY "Only admins can create blog posts"
ON blog_posts
FOR INSERT
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- Only authenticated admin users can update blog posts
CREATE POLICY "Only admins can update blog posts"
ON blog_posts
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- Only authenticated admin users can delete blog posts
CREATE POLICY "Only admins can delete blog posts"
ON blog_posts
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- STORAGE POLICIES

-- PRODUCT IMAGES BUCKET POLICIES

-- Allow public read access to product images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Only authenticated admin users can upload product images
CREATE POLICY "Only admins can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- Only authenticated admin users can update product images
CREATE POLICY "Only admins can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- Only authenticated admin users can delete product images
CREATE POLICY "Only admins can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- BLOG IMAGES BUCKET POLICIES

-- Allow public read access to blog images
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

-- Only authenticated admin users can upload blog images
CREATE POLICY "Only admins can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- Only authenticated admin users can update blog images
CREATE POLICY "Only admins can update blog images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- Only authenticated admin users can delete blog images
CREATE POLICY "Only admins can delete blog images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') = 'admin@example.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger function to set created_at timestamp
CREATE OR REPLACE FUNCTION set_created_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table to automatically set created_at
CREATE TRIGGER set_products_created_at
BEFORE INSERT ON products
FOR EACH ROW
EXECUTE FUNCTION set_created_at();

CREATE TRIGGER set_categories_created_at
BEFORE INSERT ON categories
FOR EACH ROW
EXECUTE FUNCTION set_created_at();

CREATE TRIGGER set_blog_posts_created_at
BEFORE INSERT ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION set_created_at();
