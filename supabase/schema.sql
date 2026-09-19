-- Drawcaf Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles (utilisateurs)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: stores (boutiques vendeurs)
-- ============================================
CREATE TABLE stores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  category TEXT NOT NULL,
  city TEXT,
  country TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT FALSE,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  is_certified BOOLEAN DEFAULT FALSE,
  certification_date TIMESTAMP WITH TIME ZONE,
  certification_fee_paid BOOLEAN DEFAULT FALSE,
  total_sales INTEGER DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: store_certifications (documents certification)
-- ============================================
CREATE TABLE store_certifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('business_license', 'id_card', 'tax_id', 'other')),
  document_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: products (produits)
-- ============================================
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  sku TEXT,
  stock_quantity INTEGER DEFAULT 0,
  weight DECIMAL(8,2),
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  category TEXT,
  tags TEXT[],
  total_sales INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: product_images (images produits)
-- ============================================
CREATE TABLE product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: product_variants (variantes)
-- ============================================
CREATE TABLE product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: orders (commandes)
-- ============================================
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  shipping_address JSONB,
  billing_address JSONB,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_id TEXT,
  tracking_number TEXT,
  notes TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: order_items (details commandes)
-- ============================================
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: receipts (recus numeriques)
-- ============================================
CREATE TABLE receipts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  receipt_number TEXT UNIQUE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  payment_method TEXT,
  items JSONB NOT NULL,
  buyer_name TEXT,
  buyer_email TEXT,
  store_name TEXT,
  store_slug TEXT,
  qr_code_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: reviews (avis)
-- ============================================
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: conversations (messages vendeur-acheteur)
-- ============================================
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: messages
-- ============================================
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: wishlist (favoris)
-- ============================================
CREATE TABLE wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(buyer_id, product_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_stores_owner ON stores(owner_id);
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_category ON stores(category);
CREATE INDEX idx_stores_approval ON stores(approval_status);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_receipts_order ON receipts(order_id);
CREATE INDEX idx_receipts_buyer ON receipts(buyer_id);
CREATE INDEX idx_receipts_store ON receipts(store_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_conversations_buyer ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller ON conversations(seller_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_certifications_store ON store_certifications(store_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Stores: public read, owner manage, admin full access
CREATE POLICY "Stores are viewable by everyone" ON stores FOR SELECT USING (true);
CREATE POLICY "Users can create own store" ON stores FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own store" ON stores FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own store" ON stores FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Admins can manage all stores" ON stores FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Store Certifications: owner read, admin manage
CREATE POLICY "Store owners can view own certifications" ON store_certifications FOR SELECT USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = store_certifications.store_id AND stores.owner_id = auth.uid())
);
CREATE POLICY "Store owners can create certifications" ON store_certifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = store_certifications.store_id AND stores.owner_id = auth.uid())
);
CREATE POLICY "Admins can manage all certifications" ON store_certifications FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Products: public read active, store owner manage
CREATE POLICY "Active products are viewable by everyone" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Store owners can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid())
);

-- Product Images: public read, store owner manage
CREATE POLICY "Product images are viewable by everyone" ON product_images FOR SELECT USING (true);
CREATE POLICY "Store owners can manage product images" ON product_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products p
    JOIN stores s ON s.id = p.store_id
    WHERE p.id = product_images.product_id AND s.owner_id = auth.uid()
  )
);

-- Product Variants: public read, store owner manage
CREATE POLICY "Product variants are viewable by everyone" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Store owners can manage product variants" ON product_variants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products p
    JOIN stores s ON s.id = p.store_id
    WHERE p.id = product_variants.product_id AND s.owner_id = auth.uid()
  )
);

-- Orders: buyer and store owner can view
CREATE POLICY "Buyers can view own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Store owners can view store orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid())
);
CREATE POLICY "Buyers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Store owners can update order status" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid())
);

-- Order Items: linked to order permissions
CREATE POLICY "Order items viewable by order participants" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.buyer_id = auth.uid() OR EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid())))
);

-- Receipts: buyer and store owner can view
CREATE POLICY "Buyers can view own receipts" ON receipts FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Store owners can view store receipts" ON receipts FOR SELECT USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = receipts.store_id AND stores.owner_id = auth.uid())
);
CREATE POLICY "System can create receipts" ON receipts FOR INSERT WITH CHECK (true);

-- Reviews: public read, buyer create
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = buyer_id);

-- Conversations: participants can view
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);
CREATE POLICY "Buyers can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Messages: conversation participants can view and create
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
  )
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
  )
);

-- Wishlist: buyer manage own
CREATE POLICY "Buyers can view own wishlist" ON wishlist FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can add to wishlist" ON wishlist FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can remove from wishlist" ON wishlist FOR DELETE USING (auth.uid() = buyer_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to create profile on signup (default role: buyer)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for existing users
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Function to update store stats
CREATE OR REPLACE FUNCTION update_store_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stores
  SET
    total_products = (SELECT COUNT(*) FROM products WHERE store_id = NEW.store_id AND is_active = true),
    updated_at = NOW()
  WHERE id = NEW.store_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update product stats
CREATE OR REPLACE FUNCTION update_product_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET
    avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = NEW.product_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id),
    updated_at = NOW()
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new review
CREATE OR REPLACE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_store_stats();

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('drawcaf', 'drawcaf', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to drawcaf bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'drawcaf' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their own files
CREATE POLICY "Allow authenticated updates" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'drawcaf'
    AND auth.role() = 'authenticated'
  );

-- Allow public read access to drawcaf bucket
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'drawcaf'
  );

-- Allow owners to delete their own files
CREATE POLICY "Allow owners to delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'drawcaf' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
