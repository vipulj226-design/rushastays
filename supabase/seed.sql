-- ==============================================================================
-- RUSHA STAYS — PRODUCTION SEED DATA
-- Pre-populates all 6 properties, 2 blogs, 18 FAQs, 4 testimonials, site settings
-- ==============================================================================

-- 1. Global Site Settings
INSERT INTO site_settings (site_name, phone, whatsapp, email, address) VALUES (
    'Rusha Stays',
    '+91-9205859444',
    '919205859444',
    'rushastays@gmail.com',
    'DLF Phase 1, Sector 28, Gurugram, Haryana 122002'
);

-- 2. Properties
INSERT INTO properties (
    id, title, room_type, locality, size, occupancy, price_val, pricing_html,
    about_short, about_full, categories, featured_image, gallery_images,
    property_amenities, in_suite_features, landmarks, neighbourhood_text,
    google_map_embed, is_published, is_featured, display_order, meta_title, meta_description
) VALUES (
    'sushant-lok-1-bhk-studio',
    '1 BHK Studio Suite in Sushant Lok Phase 1',
    '1 BHK Studio Suite',
    'Sushant Lok Phase 1',
    '450 Sq. Ft.',
    'Solo Room',
    44999.0,
    'Starting at 44,999 / month',
    'Experience the privacy of your own fully furnished 1 BHK Studio Suite in the heart of Sushant Lok Phase 1, Gurgaon...',
    'Experience the privacy of your own fully furnished 1 BHK Studio Suite in the heart of Sushant Lok Phase 1, Gurgaon. Located opposite Galleria Market and just minutes from MG Road Metro Station, Cyber City and Golf Course Road, this premium residence offers the perfect balance of comfort, convenience and connectivity.<br><br>Spanning approximately 450 sq. ft., the suite features a spacious bedroom, private living area, fully equipped kitchen and modern washroom, making it ideal for corporate professionals, consultants, startup founders, interns, hybrid workers and relocating individuals.<br><br>The property is designed for modern professionals who value comfort, connectivity and flexibility. With major business hubs, metro connectivity, shopping destinations and lifestyle conveniences located nearby, residents can focus on work and life without worrying about everyday hassles.<br><br>Professionally managed by Rusha Stays, residents enjoy a secure and well-maintained living environment with housekeeping services, high-speed Wi-Fi, power backup, lift access and dedicated resident support. Whether you''re staying for a few weeks or several months, everything is thoughtfully designed to provide a comfortable and hassle-free living experience.',
    '["Studio Apartments", "Managed Living"]'::jsonb,
    '/images/sushant-lok/living-1.jpg',
    '["/images/sushant-lok/living-1.jpg", "/images/sushant-lok/bedroom-3.jpg", "/images/sushant-lok/bedroom-4.jpg", "/images/sushant-lok/kitchen-1.jpg", "/images/sushant-lok/lobby-1.jpg", "/images/sushant-lok/exterior-1.jpg"]'::jsonb,
    '["Daily Housekeeping", "Linen Change & Care", "On-site Caretaker & Support", "24/7 CCTV & Gated Security", "High-Speed Wi-Fi Setup", "Near Metro & Business Hubs"]'::jsonb,
    '["Fully Furnished Luxury Setup", "Private Balcony", "Private Kitchen", "Dedicated Living Area", "High-Speed Wi-Fi", "Power Backup & Lift Access", "In-Unit Fully Automatic Washing Machine"]'::jsonb,
    '[{"icon": "???", "text": "Galleria Market \u0097 2 Mins"}, {"icon": "??", "text": "MG Road Metro \u0097 5 Mins"}, {"icon": "??", "text": "Cyber City \u0097 10 Mins"}, {"icon": "??", "text": "Fortis Hospital \u0097 7 Mins"}]'::jsonb,
    'Sushant Lok Phase 1 is one of Gurgaon''s most prestigious and well-connected residential hubs. Located opposite Galleria Market, residents have instant access to fine dining, cafes, supermarkets and daily conveniences. MG Road Metro Station, IFFCO Chowk, Golf Course Road and Cyber City are all within a 5 to 10 minute drive, making commuting effortless for working professionals.',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.4727786440263!2d77.0754877!3d28.4653068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e592df7859%3A0x6b7bd4d18721adbf!2sSushant%20Lok%20Phase%20I%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    TRUE,
    TRUE,
    0,
    '1 BHK Studio Suite in Sushant Lok Phase 1 | Rusha Stays Gurugram',
    'Experience the privacy of your own fully furnished 1 BHK Studio Suite in the heart of Sushant Lok Phase 1, Gurgaon...'
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    pricing_html = EXCLUDED.pricing_html;

INSERT INTO properties (
    id, title, room_type, locality, size, occupancy, price_val, pricing_html,
    about_short, about_full, categories, featured_image, gallery_images,
    property_amenities, in_suite_features, landmarks, neighbourhood_text,
    google_map_embed, is_published, is_featured, display_order, meta_title, meta_description
) VALUES (
    'sector-42-1-bhk-suite',
    '1 BHK Suite in Sector 42',
    '1 BHK Suite',
    'Sector 42',
    '450 Sq. Ft.',
    'Solo Room',
    44999.0,
    'Starting at 44,999 / month',
    'Experience the comfort of a spacious fully furnished 1 BHK Suite in the prime residential neighbourhood of Sector 42, Gurgaon...',
    'Experience the comfort of a spacious fully furnished 1 BHK Suite in the prime residential neighbourhood of Sector 42, Gurgaon. Strategically located near Golf Course Road, Rapid Metro connectivity, premium commercial hubs and lifestyle destinations, this suite is designed for professionals seeking privacy, convenience and a premium living experience.<br><br>Spanning approximately 450 sq. ft., the suite features a spacious bedroom, private living area, fully equipped kitchen and modern washroom, offering the perfect balance of comfort and functionality for long-term stays.<br><br>The property is ideal for corporate professionals, consultants, startup founders, hybrid workers, expats and relocating individuals looking for a professionally managed residence in one of Gurgaon''s most sought-after locations.<br><br>Professionally managed by Rusha Stays, residents enjoy a secure and well-maintained environment with housekeeping services, high-speed Wi-Fi, power backup and dedicated resident support. A key highlight of this suite is the convenience of a private fully automatic washing machine within the unit, ensuring complete privacy and independence.',
    '["Studio Apartments", "Managed Living"]'::jsonb,
    '/images/sector-42/image-1.jpg',
    '["/images/sector-42/image-1.jpg", "/images/sector-42/image-2.jpg", "/images/sector-42/image-3.jpg", "/images/sector-42/image-4.jpg", "/images/sector-42/image-5.jpg", "/images/sector-42/image-6.jpg", "/images/sector-42/image-7.jpg", "/images/sector-42/image-8.jpg", "/images/sector-42/image-9.jpg", "/images/sector-42/image-10.jpg"]'::jsonb,
    '["Regular Housekeeping Services", "Linen Care & Maintenance", "Dedicated Resident Support", "Gated Community & CCTV", "High-Speed Internet Setup", "Walking Distance to Rapid Metro"]'::jsonb,
    '["Fully Furnished Luxury Setup", "Private Balcony Access", "Private Kitchenette Setup", "Dedicated Workstation Space", "High-Speed Wi-Fi Connection", "Power Backup & Elevator", "In-Unit Automatic Washing Machine"]'::jsonb,
    '[{"icon": "??", "text": "Sector 42-43 Rapid Metro \u0097 3 Mins"}, {"icon": "??", "text": "One Horizon Center \u0097 5 Mins"}, {"icon": "?", "text": "Central Plaza Mall \u0097 4 Mins"}, {"icon": "??", "text": "Max Hospital \u0097 8 Mins"}]'::jsonb,
    'Sector 42 is one of Golf Course Road''s prime residential enclaves. Located adjacent to Sector 42-43 Rapid Metro Station, residents enjoy seamless transit across Gurgaon''s commercial belt. Horizon Center, Central Plaza and Golf Course Road business hubs are located within a 3 to 7 minute drive.',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.0123456789!2d77.091234!3d28.452345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18d123456789%3A0x123456789abcdef!2sSector%2042%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    TRUE,
    TRUE,
    0,
    '1 BHK Suite in Sector 42 | Rusha Stays Gurugram',
    'Experience the comfort of a spacious fully furnished 1 BHK Suite in the prime residential neighbourhood of Sector 42, Gurgaon...'
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    pricing_html = EXCLUDED.pricing_html;

INSERT INTO properties (
    id, title, room_type, locality, size, occupancy, price_val, pricing_html,
    about_short, about_full, categories, featured_image, gallery_images,
    property_amenities, in_suite_features, landmarks, neighbourhood_text,
    google_map_embed, is_published, is_featured, display_order, meta_title, meta_description
) VALUES (
    'sector-28-1-bhk-suite',
    '1 BHK Suite in Sector 28',
    '1 BHK Suite',
    'Sector 28',
    '420 Sq. Ft.',
    'Solo Room',
    39999.0,
    'Starting at 39,999 / month',
    'Enjoy complete independence in a fully furnished 1 BHK Suite in Sector 28, Gurugram. Features private living space, kitchen, and top-tier amenities...',
    'Enjoy complete independence in a fully furnished 1 BHK Suite in Sector 28, Gurugram. Located just off Golf Course Road and MG Road, Sector 28 offers quiet residential living with immediate proximity to Cyber City and DLF Phase 1 Metro.<br><br>Spanning 420 sq. ft., this suite features a well-appointed bedroom, private living area, dedicated workspace, attached washroom and private kitchen setup.<br><br>Managed with care by Rusha Stays, residents receive daily housekeeping, Wi-Fi, power backup, and access to common lounge and recreation areas.',
    '["Studio Apartments", "Managed Living"]'::jsonb,
    '/images/sector-28-1bhk/img-1.jpg',
    '["/images/sector-28-1bhk/img-1.jpg", "/images/sector-28-1bhk/img-2.jpg", "/images/sector-28-1bhk/img-3.jpg", "/images/sector-28-1bhk/img-4.jpg", "/images/sector-28-1bhk/img-5.jpg", "/images/sector-28-1bhk/img-6.jpg", "/images/sector-28-1bhk/img-7.jpg"]'::jsonb,
    '["Daily Housekeeping", "Carefree Living Management", "24/7 CCTV Security", "Recreation & Game Area", "Laundromat / Wash Services"]'::jsonb,
    '["Fully Furnished 1 BHK Setup", "Private Kitchen Area", "Dedicated Workstation Desk", "Smart LED TV", "Attached Modern Bathroom", "High-Speed Wi-Fi & Power Backup"]'::jsonb,
    '[{"icon": "??", "text": "DLF Phase 1 Metro \u0097 4 Mins"}, {"icon": "???", "text": "Galleria Market \u0097 5 Mins"}, {"icon": "??", "text": "Cyber Hub \u0097 8 Mins"}]'::jsonb,
    'Sector 28 is situated between Golf Course Road and MG Road. DLF Phase 1 Metro Station and MG Road Metro Station are both within 5 minutes, giving effortless access to Cyber City, Galleria Market, and Delhi.',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.2!2d77.085!3d28.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e!2sSector%2028%2C%20Gurugram!5e0!3m2!1sen!2sin!4v1700000000000',
    TRUE,
    TRUE,
    0,
    '1 BHK Suite in Sector 28 | Rusha Stays Gurugram',
    'Enjoy complete independence in a fully furnished 1 BHK Suite in Sector 28, Gurugram. Features private living space, kitchen, and top-tier amenities...'
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    pricing_html = EXCLUDED.pricing_html;

INSERT INTO properties (
    id, title, room_type, locality, size, occupancy, price_val, pricing_html,
    about_short, about_full, categories, featured_image, gallery_images,
    property_amenities, in_suite_features, landmarks, neighbourhood_text,
    google_map_embed, is_published, is_featured, display_order, meta_title, meta_description
) VALUES (
    'sector-28-king-room-suite',
    'King Room Suite in Sector 28',
    'King Room Suite',
    'Sector 28',
    '350 Sq. Ft.',
    'Solo Room',
    34999.0,
    'Starting at 34,999 / month',
    'Experience royalty in our King Room Suite at Sector 28, Gurugram. Featuring a plush king-sized bed, seating nook, and terrace access...',
    'Experience comfort in our King Room Suite at Sector 28, Gurugram. Designed for executive professionals who demand extra room to relax, work, and entertain.<br><br>The suite includes a king-size bed, sofa seating area, desk, attached luxury washroom, and access to a rooftop terrace garden.',
    '["Executive Rooms", "Managed Living"]'::jsonb,
    '/images/king-room/bedroom.jpg',
    '["/images/king-room/bedroom.jpg", "/images/king-room/living-area.jpg", "/images/king-room/bathroom.jpg", "/images/king-room/rooftop.jpg", "/images/king-room/terrace.jpg"]'::jsonb,
    '["Daily Housekeeping", "Wi-Fi & Power Backup", "CCTV & Resident Caretaker"]'::jsonb,
    '["King-Size Comfort Bedding", "Private Seating Nook", "Workstation Setup", "Rooftop Terrace Access", "Modern Attached Washroom"]'::jsonb,
    '[{"icon": "??", "text": "DLF Phase 1 Metro \u0097 4 Mins"}, {"icon": "??", "text": "Cyber City \u0097 8 Mins"}]'::jsonb,
    'Sector 28 offers quiet, tree-lined avenues with instant access to Golf Course Road and MG Road commercial districts.',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.2!2d77.085!3d28.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e!2sSector%2028%2C%20Gurugram!5e0!3m2!1sen!2sin!4v1700000000000',
    TRUE,
    TRUE,
    0,
    'King Room Suite in Sector 28 | Rusha Stays Gurugram',
    'Experience royalty in our King Room Suite at Sector 28, Gurugram. Featuring a plush king-sized bed, seating nook, and terrace access...'
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    pricing_html = EXCLUDED.pricing_html;

INSERT INTO properties (
    id, title, room_type, locality, size, occupancy, price_val, pricing_html,
    about_short, about_full, categories, featured_image, gallery_images,
    property_amenities, in_suite_features, landmarks, neighbourhood_text,
    google_map_embed, is_published, is_featured, display_order, meta_title, meta_description
) VALUES (
    'sector-28-executive-rooms',
    'Executive Rooms in Sector 28',
    'Executive Rooms',
    'Sector 28',
    '280 Sq. Ft.',
    'Solo Room',
    26999.0,
    'Starting at 26,999 / month',
    'Fully furnished executive room designed for corporate professionals seeking affordable, hassle-free living in Sector 28...',
    'Fully furnished executive room designed for corporate professionals seeking affordable, hassle-free living in Sector 28, Gurugram. Complete with high-speed Wi-Fi, daily housekeeping, and power backup.',
    '["Executive Rooms"]'::jsonb,
    '/images/sector-28-executive/img-1.jpg',
    '["/images/sector-28-executive/img-1.jpg", "/images/sector-28-executive/img-2.jpg", "/images/sector-28-executive/img-3.jpg", "/images/sector-28-executive/img-4.jpg", "/images/sector-28-executive/img-5.jpg", "/images/sector-28-executive/img-6.jpg", "/images/sector-28-executive/img-7.jpg", "/images/sector-28-executive/img-8.jpg", "/images/sector-28-executive/img-9.jpg", "/images/sector-28-executive/img-10.jpg", "/images/sector-28-executive/img-11.jpg", "/images/sector-28-executive/img-12.jpg", "/images/sector-28-executive/img-13.jpg", "/images/sector-28-executive/img-14.jpg", "/images/sector-28-executive/img-15.jpg", "/images/sector-28-executive/img-16.jpg", "/images/sector-28-executive/img-17.jpg"]'::jsonb,
    '["Daily Housekeeping", "Wi-Fi & Power Backup", "Security & Caretaker"]'::jsonb,
    '["Furnished Single / Double Setup", "Work Desk & Chair", "Wardrobe & Storage", "Attached Washroom"]'::jsonb,
    '[{"icon": "??", "text": "Metro \u0097 5 Mins"}]'::jsonb,
    'Located in Sector 28, Gurugram near MG Road and Golf Course Road.',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.2!2d77.085!3d28.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e!2sSector%2028%2C%20Gurugram!5e0!3m2!1sen!2sin!4v1700000000000',
    TRUE,
    TRUE,
    0,
    'Executive Rooms in Sector 28 | Rusha Stays Gurugram',
    'Fully furnished executive room designed for corporate professionals seeking affordable, hassle-free living in Sector 28...'
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    pricing_html = EXCLUDED.pricing_html;

INSERT INTO properties (
    id, title, room_type, locality, size, occupancy, price_val, pricing_html,
    about_short, about_full, categories, featured_image, gallery_images,
    property_amenities, in_suite_features, landmarks, neighbourhood_text,
    google_map_embed, is_published, is_featured, display_order, meta_title, meta_description
) VALUES (
    'sector-28-executive-premium-rooms',
    'Executive Premium Rooms in Sector 28',
    'Executive Premium Rooms',
    'Sector 28',
    '320 Sq. Ft.',
    'Solo Room',
    29999.0,
    'Starting at 29,999 / month',
    'Premium executive rooms offering extra space, enhanced furnishings, and premium managed services in Sector 28...',
    'Premium executive rooms offering extra space, enhanced furnishings, and premium managed services in Sector 28, Gurugram. Designed for senior consultants and executives.',
    '["Executive Rooms"]'::jsonb,
    '/images/sector-28-premium-rooms/img-1.jpg',
    '["/images/sector-28-premium-rooms/img-1.jpg", "/images/sector-28-premium-rooms/img-2.jpg", "/images/sector-28-premium-rooms/img-3.jpg"]'::jsonb,
    '["Daily Housekeeping & Care", "24/7 Security & Support"]'::jsonb,
    '["Premium Furnished Bedroom", "Ergonomic Workstation Desk", "Attached Bathroom with Water Heater", "High-Speed Wi-Fi & Power Backup"]'::jsonb,
    '[{"icon": "??", "text": "Metro \u0097 5 Mins"}]'::jsonb,
    'Sector 28, Gurugram.',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.2!2d77.085!3d28.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e!2sSector%2028%2C%20Gurugram!5e0!3m2!1sen!2sin!4v1700000000000',
    TRUE,
    TRUE,
    0,
    'Executive Premium Rooms in Sector 28 | Rusha Stays Gurugram',
    'Premium executive rooms offering extra space, enhanced furnishings, and premium managed services in Sector 28...'
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    pricing_html = EXCLUDED.pricing_html;

-- 3. Blog Posts
INSERT INTO blog_posts (slug, title, excerpt, content, featured_image, author, category, published_at, meta_title, meta_description, canonical_url, is_published)
VALUES (
    'top-10-popular-places-in-gurugram',
    'Top 10 Popular Places in Gurugram (Gurgaon) to Visit & Explore',
    'Discover the top 10 must-visit destinations in Gurugram, from CyberHub and Kingdom of Dreams to Sultanpur Bird Sanctuary and Galleria Market.',
    '<p>Gurugram, often referred to as India''s Millennium City, offers an exciting blend of cosmopolitan lifestyle, dynamic nightlife, commercial hubs, and serene cultural spots. Here is our curated guide to the top 10 places you must explore while staying in Gurgaon.</p><h3>1. DLF CyberHub</h3><p>The ultimate social epicenter of Gurgaon, DLF CyberHub is packed with top-rated restaurants, rooftop lounges, and live music venues.</p><h3>2. Galleria Market, DLF Phase 4</h3><p>An iconic open-air shopping paradise perfect for evening strolls, artisan coffee, and street food.</p><h3>3. Sector 29 Food & Brewery District</h3><p>Famous for craft microbreweries, bustling cafes, and vibrant nightlife.</p><h3>4. Sultanpur National Bird Sanctuary</h3><p>A tranquil natural sanctuary hosting over 250 species of resident and migratory birds.</p><h3>5. Ambience Mall</h3><p>One of Asia''s largest luxury shopping destinations featuring premium brands and entertainment.</p>',
    '/images/sector-42/image-1.jpg',
    'Rusha Stays Editorial Team',
    'City Guide',
    '2026-07-29',
    'Top 10 Popular Places in Gurugram (Gurgaon) | Rusha Stays',
    'Explore the top 10 popular destinations in Gurugram, from CyberHub to Sultanpur Sanctuary. A complete travel and local lifestyle guide by Rusha Stays.',
    'https://rushastays.com/blog/top-10-popular-places-in-gurugram.html',
    TRUE
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (slug, title, excerpt, content, featured_image, author, category, published_at, meta_title, meta_description, canonical_url, is_published)
VALUES (
    'why-serviced-apartments-are-replacing-pgs-in-gurugram',
    'Why Serviced Apartments Are Replacing Traditional PGs in Gurugram (Gurgaon)',
    'Explore how modern managed residences and serviced apartments are redefining corporate living for professionals in Gurugram.',
    '<p>For decades, traditional Paying Guest (PG) accommodations were the default choice for newcomers relocating to Gurgaon. However, with the evolution of hybrid work, the demand for privacy, hygienic home-style meals, and professional hospitality has sparked a major transition toward fully serviced residences.</p><h3>1. Privacy and Space</h3><p>Unlike crowded PGs with shared rooms and limited private space, serviced apartments provide spacious private suites with dedicated workstations.</p><h3>2. Professional Management vs Landlord Friction</h3><p>Serviced residences feature transparent terms, digital maintenance ticketing, and zero landlord interference.</p><h3>3. High-Speed Wi-Fi and Hybrid Work Readiness</h3><p>Dedicated high-speed fiber internet and uninterrupted power backup guarantee flawless remote work productivity.</p>',
    '/images/luxury_apartment_living.webp',
    'Rusha Stays Editorial Team',
    'Industry Insights',
    '2026-07-29',
    'Why Serviced Apartments Are Replacing PGs in Gurugram | Rusha Stays',
    'Learn why corporate professionals are choosing managed serviced apartments over traditional PGs in Gurugram.',
    'https://rushastays.com/blog/why-serviced-apartments-are-replacing-pgs-in-gurugram.html',
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 4. FAQs
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('What is Rusha Stays?', 'Rusha Stays offers professionally managed accommodation solutions across Gurugram, including executive rooms, studio suites, serviced apartments, and 1 BHK residences tailored for corporate executives and working professionals.', 'General', 1, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Which locations does Rusha Stays operate in?', 'Rusha Stays currently operates premium residences across prime Gurugram locations including Sector 28 (DLF Phase 1), Sector 42 (Golf Course Road), Sushant Lok Phase 1, with upcoming properties in Sector 43 and Sector 55.', 'Locations', 2, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('What types of accommodation are available at Rusha Stays?', 'Residents can choose from Executive Rooms, Executive Premium Rooms, King Room Suites, 1 BHK Suites, and Studio Apartments depending on their preferences and budget.', 'Accommodations', 3, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Which Rusha Stays property is best for me?', 'Executive Rooms are ideal for individual professionals seeking convenience and comfort. 1 BHK Suites and Studio Apartments offer generous private living spaces with modular kitchenettes.', 'Accommodations', 4, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Is Rusha Stays suitable for working professionals?', 'Yes. Rusha Stays is specifically designed for corporate employees, consultants, and executives with high-speed Wi-Fi, power backup, and quiet environments.', 'Corporate', 5, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Do you offer accommodation near Cyber City and Udyog Vihar?', 'Yes. Our Sector 28 and DLF Phase 1 properties are situated minutes from DLF Cyber City and Rapid Metro stations.', 'Locations', 6, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Do you offer accommodation near Golf Course Road and Galleria Market?', 'Yes. Our Sector 42 and Sushant Lok properties provide direct proximity to Golf Course Road, One Horizon Center, and Galleria Market.', 'Locations', 7, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Do you provide fully furnished Studio Suites in Gurugram?', 'Yes. Rusha Stays offers fully furnished Studio Suites with attached bathrooms, kitchenettes, premium bedding, and storage.', 'Accommodations', 8, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Do you offer corporate accommodation in Gurugram for companies?', 'Yes. We offer customized corporate housing packages for companies needing short-term project stays or long-term employee relocations.', 'Corporate', 9, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Can companies book multiple rooms or suites?', 'Yes. Companies can reserve multiple rooms, suites, or dedicated floors with centralized billing and invoice management.', 'Corporate', 10, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Are meals available?', 'Selected Rusha Stays properties offer freshly prepared home-style breakfasts, comforting dinners, and weekend lunch options.', 'Amenities', 11, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Is housekeeping included?', 'Yes. Regular housekeeping, linen changes, and waste disposal are included with all stays.', 'Amenities', 12, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Is high-speed Wi-Fi available?', 'Yes. All properties feature enterprise-grade high-speed Wi-Fi with dual-band routers and 100% power backup.', 'Amenities', 13, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('What is the difference between a traditional PG and Rusha Stays?', 'Unlike traditional PGs with shared bathrooms and restrictive house rules, Rusha Stays offers private furnished residences with hotel-grade hospitality and responsive management.', 'General', 14, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Do you offer accommodation for relocating professionals?', 'Yes. We assist relocating professionals with move-in ready residences and immediate 24-hour onboarding.', 'Corporate', 15, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Can I schedule a property visit before booking?', 'Absolutely. You can schedule an in-person walkthrough or video tour by contacting us via WhatsApp or phone at +91-9205859444.', 'Booking', 16, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('What are the standard check-in formalities?', 'Check-in is fast and paperless with standard government ID verification (Aadhaar/Passport) and a signed digital stay agreement.', 'Booking', 17, TRUE);
INSERT INTO faqs (question, answer, category, display_order, is_published)
VALUES ('Why choose Rusha Stays?', 'Rusha Stays delivers high-standard furnished living, prime locations, professional upkeep, flexible lease terms, and prompt customer support.', 'General', 18, TRUE);

-- 5. Testimonials
INSERT INTO testimonials (name, role, quote, rating, avatar_initials, display_order, is_published)
VALUES ('Amit Sharma', 'IT Professional', 'Staying at Rusha Stays has been an absolute delight! The rooms are clean, the staff is courteous, and the location is perfect for working professionals. Highly recommended for anyone looking for a comfortable and hassle-free stay in Gurugram!', 5, 'AS', 1, TRUE);
INSERT INTO testimonials (name, role, quote, rating, avatar_initials, display_order, is_published)
VALUES ('Alexa Young', 'Chartered Accountant', 'The amenities and the home-cooked food are amazing. It is very hard to find a serviced residence in DLF Phase 1 / Sector 28 that feels like home, has high speed internet and power backup. Super responsive management team!', 5, 'AY', 2, TRUE);
INSERT INTO testimonials (name, role, quote, rating, avatar_initials, display_order, is_published)
VALUES ('Rohan Mehta', 'Product Manager', 'Highly professional management! The transition from a traditional PG to Rusha Stays has been seamless. The co-working space, fast Wi-Fi, and weekly housekeeping are perfect for my hybrid work schedule.', 5, 'RM', 3, TRUE);
INSERT INTO testimonials (name, role, quote, rating, avatar_initials, display_order, is_published)
VALUES ('Sneha Patel', 'Software Engineer', 'Safe, secure, and beautiful rooms. The community events and shared lounge area make it easy to network with other corporate professionals. Booking and check-in were completely online and smooth!', 5, 'SP', 4, TRUE);

-- 6. Pages Metadata
INSERT INTO pages (slug, title, meta_title, meta_description, canonical_url, is_published)
VALUES ('home', 'Homepage', 'Premium Living & Executive Suites in Gurugram | Rusha Stays', 'Fully furnished executive rooms, studio suites and serviced residences across prime Gurugram locations.', 'https://rushastays.com/', TRUE)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO pages (slug, title, meta_title, meta_description, canonical_url, is_published)
VALUES ('about', 'About Us', 'About Us | Rusha Stays Premium Accommodation', 'Learn about Rusha Stays, our story, founders and dedication to premium managed corporate accommodations.', 'https://rushastays.com/about.html', TRUE)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO pages (slug, title, meta_title, meta_description, canonical_url, is_published)
VALUES ('locations', 'Locations', 'Locations | Managed Serviced Apartments | Rusha Stays', 'Browse managed properties and studio suites across Sector 28, Sector 42, and Sushant Lok in Gurugram.', 'https://rushastays.com/locations.html', TRUE)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO pages (slug, title, meta_title, meta_description, canonical_url, is_published)
VALUES ('corporate', 'Corporate Stays', 'Corporate Stays in Gurugram | Rusha Stays', 'Managed corporate housing and executive suites for business travelers and employee relocations in Gurgaon.', 'https://rushastays.com/corporate.html', TRUE)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO pages (slug, title, meta_title, meta_description, canonical_url, is_published)
VALUES ('faqs', 'FAQs', 'FAQs | Rusha Stays Gurugram', 'Frequently asked questions about Rusha Stays accommodations, bookings, amenities, and corporate stay packages.', 'https://rushastays.com/faqs.html', TRUE)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO pages (slug, title, meta_title, meta_description, canonical_url, is_published)
VALUES ('blog', 'Blogs & Insights', 'Blogs & Insights | Rusha Stays', 'Insights, city guides, and lifestyle tips for living and working in Gurugram (Gurgaon).', 'https://rushastays.com/blog.html', TRUE)
ON CONFLICT (slug) DO NOTHING;