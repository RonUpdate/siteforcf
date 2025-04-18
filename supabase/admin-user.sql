-- Проверка существования пользователя admin@example.com
SELECT * FROM auth.users WHERE email = 'admin@example.com';

-- Проверка политик безопасности для таблиц
SELECT * FROM pg_policies WHERE tablename = 'products';
SELECT * FROM pg_policies WHERE tablename = 'categories';
SELECT * FROM pg_policies WHERE tablename = 'blog_posts';

-- Проверка определения функции is_admin
SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'is_admin';

-- Обновление функции is_admin (если необходимо)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') = 'admin@example.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Обновление политик безопасности для таблицы products
CREATE OR REPLACE POLICY "Only admins can create products"
ON products
FOR INSERT
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

CREATE OR REPLACE POLICY "Only admins can update products"
ON products
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

CREATE OR REPLACE POLICY "Only admins can delete products"
ON products
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- Обновление политик безопасности для таблицы categories
CREATE OR REPLACE POLICY "Only admins can create categories"
ON categories
FOR INSERT
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

CREATE OR REPLACE POLICY "Only admins can update categories"
ON categories
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

CREATE OR REPLACE POLICY "Only admins can delete categories"
ON categories
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- Обновление политик безопасности для таблицы blog_posts
CREATE OR REPLACE POLICY "Only admins can create blog posts"
ON blog_posts
FOR INSERT
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

CREATE OR REPLACE POLICY "Only admins can update blog posts"
ON blog_posts
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');

CREATE OR REPLACE POLICY "Only admins can delete blog posts"
ON blog_posts
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@example.com');
