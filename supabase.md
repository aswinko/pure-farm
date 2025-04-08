
<!-- product -->
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  image TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT now()
);

<!-- category -->
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE products 
ADD COLUMN features TEXT NULL;
ALTER TABLE products
ALTER COLUMN features TYPE TEXT[] USING string_to_array(features, ',');
