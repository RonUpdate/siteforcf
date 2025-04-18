-- Политики доступа к хранилищу для product-images

-- Разрешить публичный доступ на чтение для product-images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Разрешить загрузку изображений только авторизованным пользователям с ролью admin
CREATE POLICY "Only admins can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- Разрешить обновление изображений только авторизованным пользователям с ролью admin
CREATE POLICY "Only admins can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- Разрешить удаление изображений только авторизованным пользователям с ролью admin
CREATE POLICY "Only admins can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- Политики доступа к хранилищу для blog-images

-- Разрешить публичный доступ на чтение для blog-images
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

-- Разрешить загрузку изображений только авторизованным пользователям с ролью admin
CREATE POLICY "Only admins can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- Разрешить обновление изображений только авторизованным пользователям с ролью admin
CREATE POLICY "Only admins can update blog images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);

-- Разрешить удаление изображений только авторизованным пользователям с ролью admin
CREATE POLICY "Only admins can delete blog images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);
