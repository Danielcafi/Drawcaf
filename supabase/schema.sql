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
CREATE POLICY "Buyers can create own receipts" ON receipts FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Store owners can create store receipts" ON receipts FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders o
    JOIN stores s ON s.id = o.store_id
    WHERE o.id = receipts.order_id AND s.owner_id = auth.uid()
  )
);

-- Reviews: public read, buyer create
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = buyer_id);

-- Conversations: participants can view, create and update
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);
CREATE POLICY "Buyers can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Participants can update conversations" ON conversations FOR UPDATE USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);

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
  FOR EACH ROW EXECUTE FUNCTION update_product_stats();

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

-- ============================================
-- RPC: create_checkout_order (étape 1)
-- Fonction SQL transactionnelle pour le checkout :
-- - insère la commande, les items, la réception
-- - décrémente le stock produit/variante
-- - met à jour total_sales du produit et de la boutique
-- Usage depuis le client :
--   supabase.rpc('create_checkout_order', { items: [...] })
-- Chaque item doit contenir : product_id, variant_id (optionnel), quantity
-- ============================================
CREATE OR REPLACE FUNCTION create_checkout_order(
  p_items JSONB,
  p_shipping_cost NUMERIC(10,2) DEFAULT 0,
  p_payment_method TEXT DEFAULT 'unknown',
  p_payment_status TEXT DEFAULT 'pending',
  p_order_status TEXT DEFAULT 'confirmed',
  p_shipping_address JSONB DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_item JSONB;
  v_order_id UUID;
  v_store_id UUID;
  v_product_id UUID;
  v_variant_id UUID;
  v_qty INTEGER;
  v_price NUMERIC(10,2);
  v_title TEXT;
  v_image_url TEXT;
  v_subtotal NUMERIC(10,2) := 0;
  v_store_sales_delta INTEGER := 0;
BEGIN
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Panier vide';
  END IF;

  v_item := p_items->0;
  v_product_id := (v_item->>'product_id')::UUID;

  SELECT p.store_id INTO v_store_id
  FROM products p
  WHERE p.id = v_product_id;

  IF v_store_id IS NULL THEN
    RAISE EXCEPTION 'Produit introuvable';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    IF v_product_id IS NULL THEN
      RAISE EXCEPTION 'Item sans product_id';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM products p
      WHERE p.id = v_product_id AND p.store_id = v_store_id
    ) THEN
      RAISE EXCEPTION 'Tous les produits doivent appartenir à la même boutique';
    END IF;
  END LOOP;

  INSERT INTO orders (
    buyer_id,
    store_id,
    subtotal,
    shipping_cost,
    total,
    shipping_address,
    payment_method,
    payment_status,
    status,
    notes
  ) VALUES (
    auth.uid(),
    v_store_id,
    0,
    p_shipping_cost,
    0,
    p_shipping_address,
    p_payment_method,
    p_payment_status,
    p_order_status,
    p_notes
  ) RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_variant_id := (v_item->>'variant_id')::UUID;
    v_qty := COALESCE((v_item->>'quantity')::INTEGER, 1);

    IF v_qty IS NULL OR v_qty <= 0 THEN
      RAISE EXCEPTION 'Quantité invalide';
    END IF;

    SELECT p.title, p.price, pi.url
    INTO v_title, v_price, v_image_url
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.position = 0
    WHERE p.id = v_product_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Produit introuvable: %', v_product_id;
    END IF;

    IF v_variant_id IS NOT NULL THEN
      UPDATE product_variants
      SET stock_quantity = stock_quantity - v_qty
      WHERE id = v_variant_id;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Variante introuvable: %', v_variant_id;
      END IF;

      IF (SELECT stock_quantity FROM product_variants WHERE id = v_variant_id) < 0 THEN
        RAISE EXCEPTION 'Stock variante insuffisant';
      END IF;

      SELECT COALESCE(price, v_price) INTO v_price
      FROM product_variants
      WHERE id = v_variant_id;
    ELSE
      UPDATE products
      SET stock_quantity = stock_quantity - v_qty
      WHERE id = v_product_id;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Produit introuvable: %', v_product_id;
      END IF;

      IF (SELECT stock_quantity FROM products WHERE id = v_product_id) < 0 THEN
        RAISE EXCEPTION 'Stock insuffisant pour le produit %', v_product_id;
      END IF;
    END IF;

    INSERT INTO order_items (
      order_id,
      product_id,
      variant_id,
      title,
      price,
      quantity,
      image_url
    ) VALUES (
      v_order_id,
      v_product_id,
      v_variant_id,
      v_title,
      v_price,
      v_qty,
      v_image_url
    );

    v_subtotal := v_subtotal + (v_price * v_qty);
    v_store_sales_delta := v_store_sales_delta + v_qty;

    UPDATE products
    SET total_sales = total_sales + v_qty
    WHERE id = v_product_id;
  END LOOP;

  UPDATE orders
  SET subtotal = v_subtotal,
      total = v_subtotal + p_shipping_cost
  WHERE id = v_order_id;

  UPDATE stores
  SET total_sales = total_sales + v_store_sales_delta
  WHERE id = v_store_id;

  BEGIN
    INSERT INTO receipts (order_id, buyer_id, store_id)
    VALUES (v_order_id, auth.uid(), v_store_id);
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'subtotal', v_subtotal,
    'total', v_subtotal + p_shipping_cost
  );
END;
$function$;

-- Autoriser les utilisateurs authentifiés à exécuter la RPC checkout
GRANT EXECUTE ON FUNCTION public.create_checkout_order(JSONB, NUMERIC(10,2), TEXT, TEXT, TEXT, JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_checkout_order(JSONB, NUMERIC(10,2), TEXT, TEXT, TEXT, JSONB, TEXT) TO anon;
