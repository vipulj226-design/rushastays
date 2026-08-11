-- ==============================================================================
-- RUSHA STAYS — COMPLETE SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Target: PostgreSQL / Supabase Free Tier (₹0 recurring cost)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. SITE SETTINGS TABLE (Global Configuration)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name TEXT NOT NULL DEFAULT 'Rusha Stays',
    phone TEXT NOT NULL DEFAULT '+91-9205859444',
    whatsapp TEXT NOT NULL DEFAULT '919205859444',
    email TEXT NOT NULL DEFAULT 'rushastays@gmail.com',
    address TEXT NOT NULL DEFAULT 'DLF Phase 1, Sector 28, Gurugram, Haryana 122002',
    satisfaction_rate TEXT DEFAULT '99%',
    established_year TEXT DEFAULT '2023',
    social_links JSONB DEFAULT '{
        "instagram": "https://www.instagram.com/rushastays",
        "facebook": "https://www.facebook.com/profile.php?id=100088761680648&mibextid=ZbWKwL",
        "developer_whatsapp": "https://wa.me/918470990283"
    }'::jsonb,
    meta_defaults JSONB DEFAULT '{
        "title": "Premium Living & Executive Suites in Gurugram | Rusha Stays",
        "description": "Rusha Stays provides fully furnished premium executive suites, studio apartments, and serviced rooms in Gurugram.",
        "og_image": "https://rushastays.com/images/luxury_apartment_living.webp"
    }'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. PROPERTIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY, -- Unique slug: e.g., 'sector-28-1-bhk-suite'
    title TEXT NOT NULL,
    room_type TEXT NOT NULL,
    locality TEXT NOT NULL,
    size TEXT NOT NULL,
    occupancy TEXT NOT NULL,
    price_val NUMERIC NOT NULL DEFAULT 0,
    pricing_html TEXT NOT NULL,
    about_short TEXT,
    about_full TEXT,
    categories JSONB DEFAULT '[]'::jsonb,
    featured_image TEXT NOT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    property_amenities JSONB DEFAULT '[]'::jsonb,
    in_suite_features JSONB DEFAULT '[]'::jsonb,
    landmarks JSONB DEFAULT '[]'::jsonb,
    neighbourhood_text TEXT,
    google_map_embed TEXT,
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. BLOG POSTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author TEXT DEFAULT 'Rusha Stays Editorial Team',
    category TEXT DEFAULT 'Gurugram Living',
    read_time TEXT DEFAULT '5 min read',
    is_published BOOLEAN DEFAULT true,
    published_at DATE DEFAULT CURRENT_DATE,
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. FAQS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    display_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. TESTIMONIALS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_initials TEXT,
    avatar_image TEXT,
    display_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. ENQUIRIES TABLE (Contact / Callback Form Submissions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    property_interest TEXT DEFAULT 'General Enquiry',
    message TEXT,
    source_page TEXT DEFAULT 'Homepage',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'contacted', 'closed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. MEDIA LIBRARY TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    bucket TEXT DEFAULT 'media',
    file_size BIGINT,
    mime_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. PAGES TABLE (Page Metadata & Content Blocks)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- e.g. 'home', 'about', 'locations', 'corporate', 'faqs', 'blog'
    title TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    og_image TEXT,
    noindex BOOLEAN DEFAULT false,
    content_json JSONB DEFAULT '{}'::jsonb,
    is_published BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- A. SITE SETTINGS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view site settings" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON site_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- B. PROPERTIES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published properties" ON properties
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all properties" ON properties
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- C. BLOG POSTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published blog posts" ON blog_posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all blog posts" ON blog_posts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- D. FAQS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published faqs" ON faqs
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all faqs" ON faqs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- E. TESTIMONIALS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published testimonials" ON testimonials
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all testimonials" ON testimonials
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- F. ENQUIRIES POLICIES (Public can ONLY insert, Admins have full access)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can submit enquiries" ON enquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage enquiries" ON enquiries
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- G. MEDIA POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view media references" ON media
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage media" ON media
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- H. PAGES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published pages metadata" ON pages
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage pages" ON pages
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 11. STORAGE BUCKET CREATION & POLICIES
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('properties', 'properties', true),
    ('blog', 'blog', true),
    ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for storage objects
CREATE POLICY "Public can view property images" ON storage.objects
    FOR SELECT USING (bucket_id IN ('properties', 'blog', 'media'));

-- Admin full access for storage objects
CREATE POLICY "Admins can upload and manage images" ON storage.objects
    FOR ALL TO authenticated USING (bucket_id IN ('properties', 'blog', 'media'))
    WITH CHECK (bucket_id IN ('properties', 'blog', 'media'));
