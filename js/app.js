// Global Configuration for Rusha Stays Web Portal
const SITE_CONFIG = {
    // REGISTER AT https://web3forms.com TO GET A FREE ACCESS KEY FOR YOUR EMAIL (rushastays@gmail.com).
    // PASTE YOUR KEY HERE TO RECEIVE REAL EMAIL NOTIFICATIONS ON LEAD SUBMISSION.
    web3forms_access_key: "e5c58afb-dab6-4b34-9021-b74503947cb1",
    notification_email: "rushastays@gmail.com"
};

// Automatically restore inline styles for dynamic and static elements
if (typeof window !== 'undefined') {
    const styleRestorerObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    if (node.hasAttribute('data-style')) {
                        node.setAttribute('style', node.getAttribute('data-style'));
                    }
                    node.querySelectorAll('[data-style]').forEach(el => {
                        el.setAttribute('style', el.getAttribute('data-style'));
                    });
                }
            });
        });
    });
    styleRestorerObserver.observe(document.documentElement, { childList: true, subtree: true });

    // Initial run for static elements
    const runInitialStyles = () => {
        document.querySelectorAll('[data-style]').forEach(el => {
            el.setAttribute('style', el.getAttribute('data-style'));
        });
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInitialStyles);
    } else {
        runInitialStyles();
    }
}

const app = {
    contentDiv: null,


    async init() {
        this.contentDiv = document.getElementById('app-content');

        // Optional Live Supabase Properties Sync
        if (typeof window.getSupabaseClient === 'function') {
            const supabaseClient = window.getSupabaseClient();
            if (supabaseClient) {
                try {
                    const { data: liveProps, error } = await supabaseClient
                        .from('properties')
                        .select('*')
                        .eq('is_published', true)
                        .order('display_order', { ascending: true });
                    if (!error && liveProps && liveProps.length > 0) {
                        const staticList = window.propertiesData || [];
                        window.propertiesData = liveProps.map(p => {
                            const sf = staticList.find(s => s.id === p.id) || {};
                            const mainImg = p.featured_image || sf.image || '/images/sector-28-1bhk/img-1.jpg';
                            const galImgs = (p.gallery_images && p.gallery_images.length > 0) ? p.gallery_images : (sf.images && sf.images.length > 0 ? sf.images : [mainImg]);
                            return {
                                id: p.id,
                                locality: p.locality || sf.locality,
                                roomType: p.room_type || sf.roomType,
                                occupancy: p.occupancy || sf.occupancy,
                                size: p.size || sf.size,
                                pricingHtml: p.pricing_html || sf.pricingHtml,
                                priceVal: String(p.price_val || sf.priceVal || '0'),
                                image: mainImg,
                                images: galImgs,
                                aboutShort: p.about_short || sf.aboutShort,
                                aboutFull: p.about_full || sf.aboutFull,
                                googleMapEmbed: p.google_map_embed || sf.googleMapEmbed,
                                categories: p.categories || sf.categories || [],
                                propertyAmenities: p.property_amenities || sf.propertyAmenities || [],
                                inSuiteFeatures: p.in_suite_features || sf.inSuiteFeatures || [],
                                landmarks: p.landmarks || sf.landmarks || []
                            };
                        });
                    }
                } catch (err) {
                    console.warn('[Supabase] Properties sync fallback to static:', err);
                }
            }
        }
        
        if (document.getElementById('home-template')) {
            this.renderHome();
        } else if (document.getElementById('locations-properties-grid')) {
            this.renderPropertiesGrid(propertiesData, 'locations-properties-grid');
        } else {
            // Automatically detect and render property detail pages
            const path = window.location.pathname;
            let slug = '';
            if (path.includes('/properties/')) {
                slug = path.split('/properties/')[1].replace('.html', '').replace(/\/$/, '');
            } else if (path.endsWith('.html')) {
                const fname = path.split('/').pop().replace('.html', '');
                if (fname && !['index', 'locations', 'about', 'corporate', 'faqs', 'blog', '404'].includes(fname)) {
                    slug = fname;
                }
            }
            if (slug) {
                this.renderPropertyDetails(slug);
            }
        }
        
        this.ensureEmailFieldsExist();
        this.ensureSocialLinksExist();
        this.initFormHandlers();
        
        // Handle locality filter via URL query if redirected from location cards on other pages
        const urlParams = new URLSearchParams(window.location.search);
        const locality = urlParams.get('locality');
        if (locality) {
            setTimeout(() => {
                const select = document.getElementById('locality-select');
                if (select) {
                    select.value = locality;
                    this.updateRoomTypes();
                    this.searchProperties();
                }
            }, 100);
        }

        this.initGlobalAnimations();
    },

    renderHome() {
        // Preserve pre-rendered static HTML to eliminate Desktop CLS (Cumulative Layout Shift)
        if (this.contentDiv && this.contentDiv.children.length > 0) {
            if (typeof window.initCarousel === 'function') {
                window.initCarousel();
            }
            this.initGlobalAnimations();
            return;
        }
        const templateEl = document.getElementById('home-template');
        if (templateEl) {
            this.contentDiv.innerHTML = templateEl.innerHTML;
        }
        this.renderPropertiesGrid(propertiesData, 'home-properties-grid');
        if (typeof window.initCarousel === 'function') {
            window.initCarousel();
        }
        this.initGlobalAnimations();
    },

    animateHeroTitle() {
        const titleEl = document.querySelector('.hero-v2__title');
        if (!titleEl) return;
        
        const lines = [
            { text: "Live Better.", class: "" },
            { text: "Work Smarter.", class: "" },
            { text: "Stay Hassle-Free.", class: "highlight-red" }
        ];
        
        let newHTML = '';
        let charGlobalIndex = 0;
        
        lines.forEach((line, lineIdx) => {
            const spanClass = line.class ? ` class="${line.class}"` : '';
            newHTML += `<span${spanClass} style="white-space: nowrap;">`;
            
            for (let i = 0; i < line.text.length; i++) {
                const char = line.text[i];
                if (char === ' ') {
                    newHTML += '&nbsp;';
                } else {
                    newHTML += `<span class="char" style="--char-index: ${charGlobalIndex};">${char}</span>`;
                }
                charGlobalIndex++;
            }
            
            newHTML += '</span>';
            if (lineIdx < lines.length - 1) {
                newHTML += '<br>';
            }
        });
        
        titleEl.innerHTML = newHTML;
    },

    renderPropertiesGrid(properties, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const templateEl = document.getElementById('property-card-template');
        const cardTemplate = templateEl ? templateEl.innerHTML : `
        <div class="property-card" onclick="location.href='{id}'" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.3s ease;">
            <!-- Image Container -->
            <div class="card-image" style="background-image: url('{image}'); height: 240px; background-size: cover; background-position: center; position: relative;">
                <div class="card-badge" style="position: absolute; top: 16px; left: 16px; background-color: var(--primary); color: var(--white); padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Rusha Stays</div>
            </div>
            <!-- Card Body Content -->
            <div class="card-content" style="padding: 24px; display: flex; flex-direction: column; gap: 12px;">
                <div>
                    <!-- Bold Highlighted Title -->
                    <h3 style="font-family: var(--font-heading); font-size: 19px; font-weight: 800; color: var(--text-heading); margin-bottom: 6px; line-height: 1.3;">{roomType}</h3>
                    <!-- Highlighted Locality -->
                    <p style="font-size: 13.5px; color: var(--primary); font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-map-marker-alt"></i> {locality}, Gurugram (Gurgaon)
                    </p>
                </div>
                
                <div style="border-top: 1px solid var(--border-color); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: var(--text-body); font-weight: 500;"><i class="fas fa-vector-square" style="color: var(--primary); margin-right: 5px;"></i> {size}</span>
                    <span style="background-color: rgba(200, 56, 40, 0.08); color: var(--primary); padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; font-family: 'Poppins', sans-serif;">{occupancy}</span>
                </div>

                <div style="border-top: 1px solid var(--border-color); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 14px; font-weight: 700; color: var(--text-heading); font-family: 'Poppins', sans-serif;">
                        {pricingHtml}
                    </div>
                    <button class="btn-share" onclick="event.stopPropagation(); app.shareProperty('{id}')" style="background: none; border: none; font-size: 13px; color: var(--text-body); cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 600; transition: color 0.3s;"><i class="fas fa-share-alt"></i> Share</button>
                </div>
            </div>
        </div>`;
        
        const isSubfolder = window.location.pathname.includes('/properties/') || window.location.pathname.includes('/blog/');
        const propLinkPrefix = isSubfolder ? '' : '/properties/';

        // Group properties by locality: Sector 28 (with 4 subcategories), Sector 42, Sushant Lok Phase 1
        const groupDefs = [
            {
                key: 'Sector 28',
                title: '📍 Sector 28, Gurugram (DLF Phase 1)',
                subcats: ['1 BHK Suite', 'Executive Rooms', 'Executive Premium Rooms', 'King Room Suite']
            },
            {
                key: 'Sector 42',
                title: '📍 Sector 42, Gurugram (Golf Course Road)',
                subcats: ['1 BHK Suite']
            },
            {
                key: 'Sushant Lok',
                title: '📍 Sushant Lok Phase 1, Gurugram',
                subcats: ['1 BHK Studio Suite']
            }
        ];

        // Helper to render card HTML
        const makeCard = (p) => {
            const propUrl = `${propLinkPrefix}${p.id}`;
            const imgUrl = p.image.startsWith('/') ? p.image : '/' + p.image;
            return cardTemplate
                .replace(/{id}/g, propUrl)
                .replace(/{image}/g, imgUrl)
                .replace(/{locality}/g, p.locality)
                .replace(/{occupancy}/g, p.occupancy)
                .replace(/{roomType}/g, p.roomType)
                .replace(/{size}/g, p.size)
                .replace(/{pricingHtml}/g, p.pricingHtml);
        };

        // If filtering by specific locality or search, render simple grid
        if (properties.length < propertiesData.length && containerId !== 'locations-properties-grid') {
            container.innerHTML = properties.map(makeCard).join('');
            return;
        }

        // Render Grouped View by Locality and Subcategories
        let fullHtml = '';

        groupDefs.forEach(group => {
            const groupProps = properties.filter(p => p.locality && p.locality.includes(group.key));
            if (groupProps.length === 0) return;

            const subcatBadges = group.subcats.map(s => 
                `<span style="background: rgba(200,56,40,0.08); color: var(--primary); border: 1px solid rgba(200,56,40,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; font-family: 'Poppins', sans-serif;"><i class="fas fa-bed" style="margin-right: 4px;"></i> ${s}</span>`
            ).join(' ');

            fullHtml += `
                <div class="locality-group-block" style="margin-bottom: 48px; background: var(--card-bg, #ffffff); padding: 28px; border-radius: 24px; border: 1px solid var(--border-color, #e2e8f0); box-shadow: var(--shadow-sm);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; border-bottom: 2px solid var(--primary); padding-bottom: 14px;">
                        <h2 style="font-family: var(--font-heading); font-size: 22px; font-weight: 800; color: var(--text-heading); margin: 0;">${group.title}</h2>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                            <span style="font-size: 12px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; margin-right: 4px;">Categories (${groupProps.length}):</span>
                            ${subcatBadges}
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
                        ${groupProps.map(makeCard).join('')}
                    </div>
                </div>
            `;
        });

        // Catch any ungrouped properties
        const groupedIds = new Set();
        groupDefs.forEach(g => properties.filter(p => p.locality && p.locality.includes(g.key)).forEach(p => groupedIds.add(p.id)));
        const remaining = properties.filter(p => !groupedIds.has(p.id));
        if (remaining.length > 0) {
            fullHtml += `
                <div class="locality-group-block" style="margin-bottom: 48px;">
                    <h2 style="font-family: var(--font-heading); font-size: 22px; font-weight: 800; color: var(--text-heading); margin-bottom: 20px;">Other Managed Properties</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
                        ${remaining.map(makeCard).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = fullHtml;
    },

    activeFilter: null,

    filterByOffering(category, cardEl) {
        if (this.activeFilter === category) {
            this.clearFilter();
            return;
        }

        this.activeFilter = category;

        document.querySelectorAll('.offering-card').forEach(card => {
            card.classList.remove('active');
        });

        if (cardEl) {
            cardEl.classList.add('active');
        }

        const filtered = propertiesData.filter(p => p.categories && p.categories.includes(category));
        const targetGrid = document.getElementById('locations-properties-grid') ? 'locations-properties-grid' : 'home-properties-grid';
        this.renderPropertiesGrid(filtered, targetGrid);

        const feedbackBar = document.getElementById('filter-feedback-bar');
        const activeLabel = document.getElementById('active-filter-label');
        if (feedbackBar && activeLabel) {
            activeLabel.textContent = category;
            feedbackBar.style.display = 'flex';
        }

        const exploreSection = document.getElementById('explore-section');
        if (exploreSection) {
            exploreSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    clearFilter() {
        this.activeFilter = null;

        document.querySelectorAll('.offering-card').forEach(card => {
            card.classList.remove('active');
        });

        const targetGrid = document.getElementById('locations-properties-grid') ? 'locations-properties-grid' : 'home-properties-grid';
        this.renderPropertiesGrid(propertiesData, targetGrid);

        const feedbackBar = document.getElementById('filter-feedback-bar');
        if (feedbackBar) {
            feedbackBar.style.display = 'none';
        }
    },

    updateRoomTypes() {
        const localitySelect = document.getElementById('locality-select');
        const roomTypeSelect = document.getElementById('room-type-select');
        const locality = localitySelect.value;
        
        roomTypeSelect.innerHTML = '<option value="">Select Room Type</option>';
        roomTypeSelect.disabled = false;
        
        if (locality === "Sector-43" || locality === "Sector-55") {
            const opt = document.createElement('option');
            opt.value = "Coming Soon";
            opt.textContent = "Coming Soon";
            roomTypeSelect.appendChild(opt);
            roomTypeSelect.value = "Coming Soon";
            roomTypeSelect.disabled = true;
            return;
        }
        
        if (locality && localityRoomMap[locality]) {
            localityRoomMap[locality].forEach(room => {
                const opt = document.createElement('option');
                opt.value = room;
                opt.textContent = room;
                roomTypeSelect.appendChild(opt);
            });
        }
    },

    searchProperties() {
        const locality = document.getElementById('locality-select').value;
        const roomType = document.getElementById('room-type-select').value;
        
        if (!locality) {
            alert('Please select a locality to search.');
            return;
        }

        if (locality === "Sector-43" || locality === "Sector-55") {
            alert(`${locality} properties are Coming Up Soon! Please request a call back to pre-book.`);
            if (typeof openCallbackModal === 'function') openCallbackModal();
            return;
        }

        let filtered = propertiesData.filter(p => p.locality === locality);
        if (roomType) {
            filtered = filtered.filter(p => p.roomType === roomType);
        }

        if (filtered.length === 1) {
            const isSubfolder = window.location.pathname.includes('/properties/') || window.location.pathname.includes('/blog/');
            location.href = isSubfolder ? `${filtered[0].id}` : `properties/${filtered[0].id}`;
        } else if (filtered.length > 1) {
            const hasLocationsGrid = document.getElementById('locations-properties-grid') !== null;
            if (!hasLocationsGrid) {
                this.renderHome();
                setTimeout(() => {
                    document.getElementById('locality-select').value = locality;
                    this.updateRoomTypes();
                    setTimeout(() => {
                        document.getElementById('room-type-select').value = roomType;
                    }, 0);
                    
                    document.getElementById('home-properties-grid').scrollIntoView({ behavior: 'smooth' });
                    this.renderPropertiesGrid(filtered, 'home-properties-grid');
                }, 0);
            } else {
                this.renderPropertiesGrid(filtered, 'locations-properties-grid');
                document.getElementById('locations-properties-grid').scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            alert('No properties found for this selection.');
        }
    },
    async renderPropertyDetails(propertyId) {
        if (!this.contentDiv) {
            this.contentDiv = document.getElementById('app-content');
        }
        let property = propertiesData.find(p => p.id === propertyId);
        


        if (!property) {
            this.contentDiv.innerHTML = '<div style="padding: 100px 24px; text-align: center;"><h2>Property not found.</h2><br><a href="locations" class="btn-primary">Back to Locations</a></div>';
            return;
        }

        // Fix image paths for subfolder depth (e.g. properties/ or blog/)
        const fixImgPath = (url) => {
            if (!url) return '/images/rusha-stays-logo.webp';
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
            let clean = url.replace(/^[\/.]+/, '');
            const path = window.location.pathname;
            if (path.includes('/properties/') || path.includes('/blog/')) {
                return '../' + clean;
            }
            return '/' + clean;
        };

        let finalImages = (property.images || []).map(fixImgPath);

        // Generate images carousel HTML
        let imagesHtml = '';
        let thumbnailsHtml = '';
        const mainPropertyImg = fixImgPath(property.image);
        if (finalImages && finalImages.length > 0) {
            imagesHtml = finalImages.map((img, index) => 
                `<img src="${img}" alt="Property Image ${index+1}" draggable="false" ondragstart="return false;" class="carousel-img ${index === 0 ? 'active' : ''}" style="width: 100%; height: 100%; object-fit: cover; display: ${index === 0 ? 'block' : 'none'}; border-radius: 20px;">`
            ).join('');
            thumbnailsHtml = `<div id="prop-carousel-thumbnails" style="display: flex; gap: 10px; margin-top: 10px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none; -ms-overflow-style: none;">` + 
                finalImages.map((img, index) => 
                `<img src="${img}" onclick="app.goToCarouselImage(${index})" class="thumb-img" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid ${index === 0 ? 'var(--primary)' : 'transparent'}; opacity: ${index === 0 ? '1' : '0.6'}; transition: all 0.2s; flex-shrink: 0;" alt="Thumb ${index+1}">`
                ).join('') + 
            `</div>`;
        } else {
            imagesHtml = `<img src="${mainPropertyImg}" alt="Property Image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">`;
        }

        // Features & Amenities HTML
        const featuresHtml = property.inSuiteFeatures.map(f => `<li><i class="fas fa-check-circle" style="color: var(--primary); margin-right: 8px;"></i>${f}</li>`).join('');
        const amenitiesHtml = property.propertyAmenities.map(a => `<li><i class="fas fa-star" style="color: #F9D976; margin-right: 8px;"></i>${a}</li>`).join('');
        
        // Landmarks HTML (Supports Emojis & FontAwesome Icons)
        const landmarksHtml = (property.landmarks || []).map(l => {
            const iconStr = l.icon || '📍';
            const iconElement = (iconStr.startsWith('fa') || iconStr.includes('fa-'))
                ? `<i class="${iconStr}" style="font-size: 18px; color: var(--primary); width: 24px; text-align: center;"></i>`
                : `<span style="font-size: 20px; width: 24px; text-align: center; display: inline-block;">${iconStr}</span>`;
            return `
                <div style="background: var(--bg-main); padding: 12px 16px; border-radius: 12px; display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 500; border: 1px solid var(--border-color);">
                    ${iconElement} <span>${l.text}</span>
                </div>
            `;
        }).join('');

        const detailsHtml = `
            <!-- Full Width Title Block -->
            <div class="property-title-block">
                <h1 class="property-title">
                    Luxury Coliving | ${property.roomType} at ${property.locality}
                </h1>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt" style="color: var(--primary);"></i> ${property.locality}, Gurugram (Gurgaon)
                </div>
            </div>

            <div class="property-details-layout">
                
                <!-- LEFT COLUMN -->
                <div class="property-main-content">
                    
                    <!-- Carousel with Drag, Touch Swipe & Nav Arrows -->
                    <div class="property-carousel" id="prop-carousel-wrapper" style="position: relative; height: 400px; border-radius: 20px; overflow: hidden; margin-bottom: 20px; box-shadow: var(--shadow-md); touch-action: pan-y;">
                        <div class="carousel-badge" style="position: absolute; top: 20px; left: 20px; background-color: var(--primary); color: var(--white); padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; z-index: 2;">Rusha Stays</div>
                        
                        <!-- Left Arrow Button -->
                        <button onclick="event.stopPropagation(); app.prevCarouselImage()" title="Previous Image (Left Swipe)" style="position: absolute; top: 50%; left: 16px; transform: translateY(-50%); background: rgba(15,23,42,0.7); border: none; color: #fff; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; z-index: 5; backdrop-filter: blur(4px); transition: all 0.2s;" onmouseover="this.style.background='rgba(200,56,40,0.9)'" onmouseout="this.style.background='rgba(15,23,42,0.7)'">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        
                        <!-- Right Arrow Button -->
                        <button onclick="event.stopPropagation(); app.nextCarouselImage()" title="Next Image (Right Swipe)" style="position: absolute; top: 50%; right: 16px; transform: translateY(-50%); background: rgba(15,23,42,0.7); border: none; color: #fff; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; z-index: 5; backdrop-filter: blur(4px); transition: all 0.2s;" onmouseover="this.style.background='rgba(200,56,40,0.9)'" onmouseout="this.style.background='rgba(15,23,42,0.7)'">
                            <i class="fas fa-chevron-right"></i>
                        </button>

                        <div id="prop-carousel-images" style="width: 100%; height: 100%; cursor: grab;" onclick="app.openLightbox()">
                            ${imagesHtml}
                        </div>
                        
                        <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(15,23,42,0.8); color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; z-index: 2; pointer-events: none; backdrop-filter: blur(4px);">
                            <i class="fas fa-arrows-left-right" style="color: #38bdf8; margin-right: 4px;"></i> Drag or Swipe ◄ ►
                        </div>
                    </div>
                    ${thumbnailsHtml}

                    <!-- Highlights Bar -->
                    <div class="highlights-bar">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-vector-square" style="color: var(--primary); font-size: 18px;"></i>
                            <div>
                                <div style="font-size: 11px; color: var(--text-body); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Area Size</div>
                                <div style="font-size: 14px; font-weight: 700; color: var(--text-heading);">${property.size}</div>
                            </div>
                        </div>
                        <div style="width: 1px; height: 30px; background: var(--border-color);" class="highlight-divider"></div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-users" style="color: var(--primary); font-size: 18px;"></i>
                            <div>
                                <div style="font-size: 11px; color: var(--text-body); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Occupancy</div>
                                <div style="font-size: 14px; font-weight: 700; color: var(--text-heading);">${property.occupancy}</div>
                            </div>
                        </div>
                        <div style="width: 1px; height: 30px; background: var(--border-color);" class="highlight-divider"></div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-tags" style="color: var(--primary); font-size: 18px;"></i>
                            <div>
                                <div style="font-size: 11px; color: var(--text-body); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Pricing</div>
                                <div style="font-size: 14px; font-weight: 700; color: var(--text-heading);">${property.pricingHtml}</div>
                            </div>
                        </div>
                        <button onclick="app.shareProperty('${property.id}')" style="margin-left: auto; background: none; border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;"><i class="fas fa-share-alt"></i> Share</button>
                    </div>

                    <!-- About -->
                    <section style="margin-bottom: 40px;">
                        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">About the Property</h2>
                        <p style="color: var(--text-body); line-height: 1.8; font-size: 16px;">${property.aboutFull}</p>
                    </section>

                    <!-- Privileges -->
                    <section class="privileges-section" style="margin-bottom: 40px; background: var(--bg-main); padding: 30px; border-radius: 20px; border: 1px solid var(--border-color);">
                        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">Key Privileges</h2>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;" class="privileges-grid">
                            <div>
                                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: var(--primary);">In-Suite Features</h3>
                                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; font-size: 15px;">
                                    ${featuresHtml}
                                </ul>
                            </div>
                            <div>
                                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: var(--text-heading);">Property Amenities</h3>
                                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; font-size: 15px;">
                                    ${amenitiesHtml}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- Neighbourhood -->
                    <section style="margin-bottom: 40px;">
                        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Neighbourhood</h2>
                        <p style="color: var(--text-body); line-height: 1.8; font-size: 16px; margin-bottom: 24px;">${property.neighbourhoodText}</p>
                        <div class="landmarks-grid">
                            ${landmarksHtml}
                        </div>
                    </section>

                    <!-- Location & Reviews -->
                    <section style="margin-bottom: 40px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;" class="location-reviews-grid">
                            <div>
                                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Address</h2>
                                <p style="color: var(--text-body); margin-bottom: 16px;"><i class="fas fa-map-marker-alt" style="color: var(--primary); margin-right: 8px;"></i> ${property.locality}, Gurugram (Gurgaon), Haryana</p>
                                <div style="border-radius: 16px; overflow: hidden; border: 1px solid var(--border-color); height: 250px;">
                                    <iframe src="${property.googleMapEmbed}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                                </div>
                            </div>
                            <div>
                                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Google Reviews</h2>
                                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                                    <h3 style="font-size: 42px; font-weight: 800; margin: 0;">4.8</h3>
                                    <div>
                                        <div style="color: #F9D976; font-size: 18px; margin-bottom: 4px;">
                                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                        </div>
                                        <div style="font-size: 13px; color: var(--text-body); font-weight: 600;">Based on 124 reviews</div>
                                    </div>
                                </div>
                                <div class="review-card" style="background: var(--bg-main); padding: 20px; border-radius: 16px; margin-bottom: 12px; border: 1px solid var(--border-color);">
                                    <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 8px;">
                                        <div style="width: 32px; height: 32px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;">A</div>
                                        <div>
                                            <div style="font-weight: 600; font-size: 14px;">Amit K.</div>
                                            <div style="color: #F9D976; font-size: 10px;"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                                        </div>
                                    </div>
                                    <p style="font-size: 13px; color: var(--text-body); margin: 0; line-height: 1.5;">"Excellent managed property. The suite is exactly as shown in pictures and housekeeping is extremely professional."</p>
                                </div>
                                <div class="review-card" style="background: var(--bg-main); padding: 20px; border-radius: 16px; border: 1px solid var(--border-color);">
                                    <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 8px;">
                                        <div style="width: 32px; height: 32px; background: #333; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;">S</div>
                                        <div>
                                            <div style="font-weight: 600; font-size: 14px;">Sneha R.</div>
                                            <div style="color: #F9D976; font-size: 10px;"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                                        </div>
                                    </div>
                                    <p style="font-size: 13px; color: var(--text-body); margin: 0; line-height: 1.5;">"Prime location and great amenities. Perfect for long term corporate stays."</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Call Now CTA below Address and Google Reviews -->
                        <div style="margin-top: 30px; padding: 24px; background: var(--bg-main); border-radius: 16px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                            <div>
                                <h4 style="font-size: 16px; font-weight: 700; color: var(--text-heading); margin: 0 0 4px 0;">Need immediate assistance?</h4>
                                <p style="font-size: 14px; color: var(--text-body); margin: 0;">Speak directly to our accommodation advisor for booking and tours.</p>
                            </div>
                            <a href="https://wa.me/919205859444" target="_blank" style="display: inline-flex; align-items: center; gap: 10px; background: #C83828; color: white; padding: 12px 24px; border-radius: 50px; font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; text-decoration: none; box-shadow: 2px 4px 0px 0px #43130d; transition: all 0.2s;" onmouseover="this.style.background='#85251B'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#C83828'; this.style.transform='none'">
                                <i class="fas fa-phone-alt"></i> Call Now: 9205859444
                            </a>
                        </div>
                    </section>

                </div>

                <!-- RIGHT COLUMN (Sticky Form) -->
                <div class="property-sidebar">
                    <div style="position: sticky; top: 110px; background: var(--white); padding: 30px; border-radius: 20px; border: 1px solid var(--border-color); box-shadow: var(--shadow-lg);">
                        <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 12px;">Interested in this Property?</h3>
                        
                        <div id="sticky-form-wrapper">
                            <p style="font-size: 14px; color: var(--text-body); margin-bottom: 24px; line-height: 1.6;">Schedule a property tour or get more details from our hospitality advisors.</p>
                            
                            <form id="stickyLeadForm" onsubmit="app.handleStickyLeadSubmit(event, '${property.locality} - ${property.roomType}')">
                                <div class="form-group" style="margin-bottom: 16px;">
                                    <label style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-heading); margin-bottom: 8px; display: block;">Name</label>
                                    <input type="text" id="sticky-name" required placeholder="Your Name" style="width: 100%; padding: 12px 16px; border: 1px solid var(--border-color); border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 14px;">
                                </div>
                                <div class="form-group" style="margin-bottom: 16px;">
                                    <label style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-heading); margin-bottom: 8px; display: block;">Phone Number</label>
                                    <input type="tel" id="sticky-phone" required placeholder="+91" style="width: 100%; padding: 12px 16px; border: 1px solid var(--border-color); border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 14px;">
                                </div>
                                <div class="form-group" style="margin-bottom: 24px;">
                                    <label style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-heading); margin-bottom: 8px; display: block;">Email Address</label>
                                    <input type="email" id="sticky-email" required placeholder="e.g. rahul@example.com" style="width: 100%; padding: 12px 16px; border: 1px solid var(--border-color); border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 14px;">
                                </div>
                                <button type="submit" class="btn-primary" style="width: 100%; padding: 14px; border-radius: 10px; font-size: 15px; border: none; cursor: pointer;">Request a Call</button>
                            </form>
                        </div>

                        <div id="sticky-success" style="display: none; text-align: center; padding: 20px 0;">
                            <div style="color: var(--primary); font-size: 32px; margin-bottom: 12px;"><i class="fas fa-check-circle"></i></div>
                            <h4 style="font-weight: 700; margin-bottom: 8px; line-height: 1.3;">Thank you for your enquiry!</h4>
                            <p style="font-size: 14px; color: var(--text-body); line-height: 1.4;">Our accommodation advisor will contact you shortly.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- You May Also Like -->
            <div class="also-like-section" style="background: var(--bg-main); padding: 80px 24px; border-top: 1px solid var(--border-color);">
                <div style="max-width: 1200px; margin: 0 auto;">
                    <h2 class="also-like-title" style="font-size: 28px; font-weight: 800; margin-bottom: 30px;">You May Also Like</h2>
                    <div class="properties-grid" id="you-may-also-like-grid">
                        <!-- Rendered by JS -->
                    </div>
                </div>
            </div>
        `;

        this.contentDiv.innerHTML = detailsHtml;
        this.renderYouMayAlsoLike(propertyId);
        this.initCarouselSwipeListeners();
    },

    prevCarouselImage() {
        const container = document.getElementById('prop-carousel-images');
        if (!container) return;
        const images = container.querySelectorAll('img');
        if (images.length <= 1) return;

        let activeIndex = 0;
        images.forEach((img, index) => {
            if (img.style.display === 'block') activeIndex = index;
        });

        const prevIndex = (activeIndex - 1 + images.length) % images.length;
        this.goToCarouselImage(prevIndex);
    },

    nextCarouselImage() {
        const container = document.getElementById('prop-carousel-images');
        if (!container) return;
        const images = container.querySelectorAll('img');
        if (images.length <= 1) return;

        let activeIndex = 0;
        images.forEach((img, index) => {
            if (img.style.display === 'block') activeIndex = index;
        });

        const nextIndex = (activeIndex + 1) % images.length;
        this.goToCarouselImage(nextIndex);
    },

    goToCarouselImage(index) {
        const container = document.getElementById('prop-carousel-images');
        const thumbsContainer = document.getElementById('prop-carousel-thumbnails');
        if (!container) return;
        
        const images = container.querySelectorAll('img');
        if (images.length === 0 || index < 0 || index >= images.length) return;

        images.forEach(img => img.style.display = 'none');
        images[index].style.display = 'block';

        if (thumbsContainer) {
            const thumbs = thumbsContainer.querySelectorAll('img');
            thumbs.forEach((thumb, i) => {
                if (i === index) {
                    thumb.style.border = '2px solid var(--primary)';
                    thumb.style.opacity = '1';
                } else {
                    thumb.style.border = '2px solid transparent';
                    thumb.style.opacity = '0.6';
                }
            });
            if (thumbs[index]) {
                thumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    },

    initCarouselSwipeListeners() {
        const wrapper = document.getElementById('prop-carousel-wrapper');
        if (!wrapper) return;

        // Prevent native browser image drag
        wrapper.querySelectorAll('img').forEach(img => {
            img.draggable = false;
            img.ondragstart = (e) => { e.preventDefault(); return false; };
        });

        let startX = 0;
        let isDragging = false;

        // Touch Events for Mobile Left/Right Swipe
        wrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            if (Math.abs(diffX) > 35) {
                if (diffX > 0) {
                    this.nextCarouselImage(); // Swiped Left -> Next
                } else {
                    this.prevCarouselImage(); // Swiped Right -> Prev
                }
            }
        }, { passive: true });

        // Mouse Drag Events for Desktop Left/Right Drag
        wrapper.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            wrapper.style.cursor = 'grabbing';
        });

        wrapper.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            wrapper.style.cursor = 'grab';
            const endX = e.clientX;
            const diffX = startX - endX;
            if (Math.abs(diffX) > 35) {
                if (diffX > 0) {
                    this.nextCarouselImage(); // Dragged Left -> Next
                } else {
                    this.prevCarouselImage(); // Dragged Right -> Prev
                }
            }
        });

        wrapper.addEventListener('mouseleave', () => {
            isDragging = false;
            wrapper.style.cursor = 'grab';
        });
    },

    openLightbox() {
        const container = document.getElementById('prop-carousel-images');
        if (!container) return;
        const images = Array.from(container.querySelectorAll('img')).map(img => img.src);
        if (images.length === 0) return;

        let activeIndex = 0;
        container.querySelectorAll('img').forEach((img, i) => {
            if (img.style.display === 'block') activeIndex = i;
        });

        let lightbox = document.getElementById('property-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'property-lightbox';
            lightbox.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,23,42,0.95); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);';
            lightbox.innerHTML = `
                <button onclick="app.closeLightbox()" style="position: absolute; top: 24px; right: 24px; background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 28px; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; z-index: 10;">&times;</button>
                <button onclick="app.lightboxPrev()" style="position: absolute; top: 50%; left: 24px; transform: translateY(-50%); background: rgba(255,255,255,0.15); border: none; color: #fff; width: 50px; height: 50px; border-radius: 50%; font-size: 20px; cursor: pointer; z-index: 10;"><i class="fas fa-chevron-left"></i></button>
                <button onclick="app.lightboxNext()" style="position: absolute; top: 50%; right: 24px; transform: translateY(-50%); background: rgba(255,255,255,0.15); border: none; color: #fff; width: 50px; height: 50px; border-radius: 50%; font-size: 20px; cursor: pointer; z-index: 10;"><i class="fas fa-chevron-right"></i></button>
                <img id="lightbox-img" style="max-width: 90vw; max-height: 85vh; object-fit: contain; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); transition: opacity 0.2s;" src="">
                <div style="position: absolute; bottom: 24px; color: #fff; font-size: 14px; background: rgba(0,0,0,0.6); padding: 6px 16px; border-radius: 20px;">
                    <span id="lightbox-counter">1 / 1</span> (Drag / Swipe ◄ ► or Press Arrow Keys)
                </div>
            `;
            document.body.appendChild(lightbox);

            // Lightbox Keydown listener
            document.addEventListener('keydown', (e) => {
                if (lightbox.style.display !== 'flex') return;
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowRight') this.lightboxNext();
                if (e.key === 'ArrowLeft') this.lightboxPrev();
            });

            // Lightbox Touch/Mouse Swipe
            let lX = 0;
            lightbox.addEventListener('touchstart', (e) => { lX = e.touches[0].clientX; }, { passive: true });
            lightbox.addEventListener('touchend', (e) => {
                const diff = lX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                    if (diff > 0) this.lightboxNext(); else this.lightboxPrev();
                }
            }, { passive: true });
        }

        window._lightboxImages = images;
        window._lightboxIndex = activeIndex;
        this.updateLightboxDisplay();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
        const lightbox = document.getElementById('property-lightbox');
        if (lightbox) lightbox.style.display = 'none';
        document.body.style.overflow = '';
    },

    lightboxNext() {
        if (!window._lightboxImages) return;
        window._lightboxIndex = (window._lightboxIndex + 1) % window._lightboxImages.length;
        this.updateLightboxDisplay();
    },

    lightboxPrev() {
        if (!window._lightboxImages) return;
        window._lightboxIndex = (window._lightboxIndex - 1 + window._lightboxImages.length) % window._lightboxImages.length;
        this.updateLightboxDisplay();
    },

    updateLightboxDisplay() {
        const img = document.getElementById('lightbox-img');
        const counter = document.getElementById('lightbox-counter');
        if (img && window._lightboxImages) {
            img.src = window._lightboxImages[window._lightboxIndex];
            if (counter) counter.textContent = `${window._lightboxIndex + 1} / ${window._lightboxImages.length}`;
            this.goToCarouselImage(window._lightboxIndex);
        }
    },



    initFormHandlers() {
        window.handleCallbackSubmit = (e) => {
            this.submitLead(e, 'Modal Callback Form');
        };
        window.handleSidebarCallbackSubmit = (e, propId) => {
            this.submitLead(e, 'Homepage Sidebar Form', { property_id: propId });
        };
        window.handleHomepageCallbackSubmit = (e) => {
            this.submitLead(e, 'Homepage Callback Form');
        };
    },

    async submitLead(event, formType, extraData = {}) {
        if (event) event.preventDefault();
        const form = event ? event.target : null;
        if (!form) return;

        const nameInput  = form.querySelector('input[type="text"], input[id*="name"], input[placeholder*="Name"]');
        const phoneInput = form.querySelector('input[type="tel"],  input[id*="phone"], input[placeholder*="Phone"]');
        const emailInput = form.querySelector('input[type="email"], input[id*="email"], input[placeholder*="Email"]');
        const interestSelect = form.querySelector('select[id*="interest"], select[id*="query"], select[id*="type"], select');

        const name         = nameInput      ? nameInput.value.trim()      : '';
        const phone        = phoneInput     ? phoneInput.value.trim()     : '';
        const email        = emailInput     ? emailInput.value.trim()     : '';
        const inquiry_type = interestSelect ? interestSelect.value.trim() : '';

        const leadObj = {
            id: 'lead_' + Date.now(),
            name: name || 'Website Visitor',
            phone: phone || 'Not provided',
            email: email || null,
            property_interest: inquiry_type || extraData.property_id || formType || 'General Enquiry',
            source_page: window.location.pathname || 'Homepage',
            status: 'new',
            created_at: new Date().toISOString()
        };

        // Visual feedback
        this.showFormSuccessState(form);

        // A. Always save to LocalStorage Backup
        try {
            const saved = JSON.parse(localStorage.getItem('rusha_local_enquiries') || '[]');
            saved.unshift(leadObj);
            localStorage.setItem('rusha_local_enquiries', JSON.stringify(saved));
        } catch (e) {}

        // B. Send to Supabase REST API directly (Guaranteed DB Insert)
        const sbConfig = window.SUPABASE_CONFIG;
        if (sbConfig && sbConfig.url && sbConfig.anonKey) {
            try {
                await fetch(`${sbConfig.url}/rest/v1/enquiries`, {
                    method: 'POST',
                    headers: {
                        'apikey': sbConfig.anonKey,
                        'Authorization': `Bearer ${sbConfig.anonKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        name: leadObj.name,
                        phone: leadObj.phone,
                        email: leadObj.email,
                        property_interest: leadObj.property_interest,
                        source_page: leadObj.source_page,
                        status: 'new'
                    })
                });
            } catch (sbErr) {
                console.warn('[Supabase Enquiry Insert Exception]', sbErr);
            }
        }

        // C. Send Email Notification via Web3Forms
        const accessKey = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.web3forms_access_key : '';
        if (accessKey && accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
            const payload = {
                access_key: accessKey,
                subject:    `New Lead — ${inquiry_type || formType} | Rusha Stays`,
                from_name:  "Rusha Stays Website",
                email:      email || "rushastays@gmail.com",
                name:       name  || "Unknown",
                "Phone":           phone        || "Not provided",
                "Email (visitor)": email        || "Not provided",
                "Inquiry Type":    inquiry_type || "Not specified",
                "Form Source":     formType,
                "Page URL":        window.location.href,
                ...extraData
            };
            try {
                await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (wErr) {
                console.warn('[Web3Forms Email Error]', wErr);
            }
        }
    },

    showFormSuccessState(form) {
        if (!form) return;
        
        if (form.id === 'callbackForm') {
            const successState = document.getElementById('modal-success-state');
            const modalHeader = document.querySelector('#callback-modal .modal-header');
            if (successState) {
                form.style.display = 'none';
                form.classList.add('d-none');
                successState.style.display = 'block';
                successState.classList.remove('d-none');
                if (modalHeader) modalHeader.style.display = 'none';
            }
            // Trigger 4s auto close
            setTimeout(() => {
                if (typeof window.closeCallbackModal === 'function') {
                    window.closeCallbackModal(true);
                }
            }, 4000);
        }
        else if (form.id === 'stickyLeadForm') {
            const wrapper = document.getElementById('sticky-form-wrapper');
            const success = document.getElementById('sticky-success');
            if (wrapper && success) {
                wrapper.style.display = 'none';
                success.style.display = 'block';
            }
            setTimeout(() => {
                if (wrapper && success) {
                    wrapper.style.display = 'block';
                    success.style.display = 'none';
                    form.reset();
                }
            }, 5000);
        }
        else if (form.id === 'sidebarCallbackForm') {
            const success = document.getElementById('sidebar-callback-success');
            if (success) {
                form.style.display = 'none';
                success.style.display = 'block';
            }
            setTimeout(() => {
                if (success) {
                    form.style.display = 'flex';
                    success.style.display = 'none';
                    form.reset();
                }
            }, 5000);
        }
    },

    handleStickyLeadSubmit(e, propertyInfo) {
        this.submitLead(e, 'Property Sticky Lead Form', { property: propertyInfo });
    },


    renderYouMayAlsoLike(currentPropertyId) {
        // Filter out current property and get max 5 others (all remaining stays)
        const others = propertiesData.filter(p => p.id !== currentPropertyId).slice(0, 5);
        this.renderPropertiesGrid(others, 'you-may-also-like-grid');
    },
    shareProperty(id) {
        // Construct the full URL safely
        const cleanId = id.replace(/^\/+/, '').replace(/\/properties\//, '');
        const shareUrl = `${window.location.origin}/properties/${cleanId}`;

        if (navigator.share) {
            navigator.share({
                title: 'Check out this property on Rusha Stays',
                text: 'Check out this premium managed accommodation on Rusha Stays!',
                url: shareUrl
            }).catch(err => {

                this.openCustomShareModal(shareUrl);
            });
        } else {
            // Open custom share sheet modal directly for insecure context / unsupported browsers
            this.openCustomShareModal(shareUrl);
        }
    },

    openCustomShareModal(url) {
        let modal = document.getElementById('custom-share-modal');
        if (!modal) {
            // Dynamically construct and append modal to document body
            modal = document.createElement('div');
            modal.id = 'custom-share-modal';
            modal.className = 'share-modal-overlay';
            modal.innerHTML = `
                <div class="share-modal-container">
                    <div class="share-modal-header">
                        <h3>Share Property</h3>
                        <button class="share-modal-close" onclick="app.closeCustomShareModal()">&times;</button>
                    </div>
                    <div class="share-options-grid">
                        <button class="share-option" onclick="app.shareToSocial('whatsapp')">
                            <div class="share-icon-wrapper" style="background-color: #25D366;"><i class="fab fa-whatsapp"></i></div>
                            <span>WhatsApp</span>
                        </button>
                        <button class="share-option" onclick="app.shareToSocial('facebook')">
                            <div class="share-icon-wrapper" style="background-color: #1877F2;"><i class="fab fa-facebook-f"></i></div>
                            <span>Facebook</span>
                        </button>
                        <button class="share-option" onclick="app.shareToSocial('twitter')">
                            <div class="share-icon-wrapper" style="background-color: #000000;"><i class="fab fa-x-twitter"></i></div>
                            <span>Twitter</span>
                        </button>
                        <button class="share-option" onclick="app.shareToSocial('email')">
                            <div class="share-icon-wrapper" style="background-color: #E55C3E;"><i class="fas fa-envelope"></i></div>
                            <span>Email</span>
                        </button>
                    </div>
                    <div class="share-copy-field">
                        <input type="text" readonly id="share-copy-url" class="share-copy-input">
                        <button class="share-copy-btn" onclick="app.copyShareUrlFromInput()">Copy</button>
                    </div>
                </div>
            `;
            // Add click listener to close modal when clicking overlay
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'custom-share-modal') {
                    this.closeCustomShareModal();
                }
            });
            document.body.appendChild(modal);
        }

        // Set URL text value
        const copyInput = modal.querySelector('#share-copy-url');
        if (copyInput) {
            copyInput.value = url;
        }

        // Keep a reference to the active URL for social sharing triggers
        this.activeShareUrl = url;

        // Reset copy button styling
        const copyBtn = modal.querySelector('.share-copy-btn');
        if (copyBtn) {
            copyBtn.textContent = 'Copy';
            copyBtn.style.backgroundColor = 'var(--primary)';
        }

        // Show modal with a tiny delay to trigger CSS transition
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    },

    closeCustomShareModal() {
        const modal = document.getElementById('custom-share-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    copyShareUrlFromInput() {
        const copyInput = document.getElementById('share-copy-url');
        if (!copyInput) return;
        
        try {
            copyInput.focus();
            copyInput.select();
            copyInput.setSelectionRange(0, 99999); // For mobile devices
            
            // Traditional copy fallback
            const successful = document.execCommand('copy');
            if (successful) {
                const copyBtn = document.querySelector('.share-copy-btn');
                if (copyBtn) {
                    copyBtn.textContent = 'Copied!';
                    copyBtn.style.backgroundColor = '#25D366';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy';
                        copyBtn.style.backgroundColor = 'var(--primary)';
                    }, 2000);
                }
            } else {
                alert('Could not copy link. Please manually select and copy it.');
            }
        } catch (err) {
            console.error('Failed to copy', err);
            alert('Could not copy link. Please manually select and copy it.');
        }
    },

    shareToSocial(platform) {
        if (!this.activeShareUrl) return;
        
        const url = encodeURIComponent(this.activeShareUrl);
        const text = encodeURIComponent("Check out this premium stay on Rusha Stays!");
        let shareLink = '';
        
        switch (platform) {
            case 'whatsapp':
                shareLink = `https://api.whatsapp.com/send?text=${text}%20${url}`;
                break;
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                break;
            case 'email':
                shareLink = `mailto:?subject=Rusha%20Stays%20Accommodation&body=${text}%20${url}`;
                break;
        }
        
        if (shareLink) {
            window.open(shareLink, '_blank');
        }
    },

    initGlobalAnimations() {
        // 1. Entrance load animations for hero elements
        const heroBadges = document.querySelectorAll('.hero-badge, .corp-hero-badge, .blog-hero .badge, .about-hero .badge, .locations-hero .badge, .faq-hero .badge, .hero-v2__badge');
        heroBadges.forEach(el => el.classList.add('animate-fade-in-up', 'delay-1'));

        const heroTitles = document.querySelectorAll('.hero-title, .corp-hero h1, .locations-hero h1, .about-hero h1, .blog-hero h1, .faq-hero h1, .property-hero h1, .hero-v2__title');
        heroTitles.forEach(el => el.classList.add('animate-fade-in-up', 'delay-2'));

        const heroSubs = document.querySelectorAll('.hero-subtitle, .corp-hero-sub-red, .locations-hero p, .about-hero p, .blog-hero p, .faq-hero p, .property-hero p, .corp-hero-sub, .hero-v2__sub, .hero-v2__text');
        heroSubs.forEach(el => el.classList.add('animate-fade-in-up', 'delay-3'));

        const heroBtns = document.querySelectorAll('.hero-buttons, .corp-hero-btns, .locations-hero .search-widget-container, .property-hero .action-buttons, .hero-v2__actions, .hero-v2__stats');
        heroBtns.forEach(el => el.classList.add('animate-fade-in-up', 'delay-4'));

        const heroImages = document.querySelectorAll('.hero-image img, .corp-hero-img-main, .about-hero__image, .property-gallery, .hero-v2__img-main');
        heroImages.forEach(el => el.classList.add('animate-fade-in', 'delay-3'));

        // 2. Native Scroll Reveal Observer
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.02, rootMargin: '0px 0px -20px 0px' });

        // Select elements to reveal on scroll across all pages (excluding .hero-feature-card to prevent mobile loading delays)
        const selectors = [
            '.serve-card', '.corp-format-card', '.ideal-card', '.loc-prop-item', 
            '.process-step', '.corp-h2', '.corp-lead', '.why-check-item', 
            '.loc-img-wrap', '.why-img', '.property-card', '.testimonial-card',
            '.facility-card', '.advantage-card', '.blog-card', '.faq-item',
            'h2.section-title', '.section-subtitle', '.about-story__content',
            '.about-story__image', '.values-grid > div', '.team-grid > div',
            '.section-header', '.about-block', '.gallery-item',
            '.contact-info-card', '.contact-form-container', '.vision-mission-card',
            '.value-card', '.team-card', '.team-header', '.values-header', '.amenities-container',
            '.vision-mission-section', '.values-section', '.team-section', '.amenities-tag-section'
        ].join(', ');

        document.querySelectorAll(selectors).forEach(el => {
            el.classList.add('reveal-on-scroll');
            revealObserver.observe(el);
        });
    },

    ensureEmailFieldsExist() {
        // 1. Check callbackForm (modal popup across all pages)
        const form = document.getElementById('callbackForm');
        if (form) {
            const hasEmail = form.querySelector('input[type="email"]') || 
                              form.querySelector('input[id="modal-email"]') || 
                              form.querySelector('input[id="email"]');
            if (!hasEmail) {
                const phoneInput = form.querySelector('input[type="tel"]') || 
                                   form.querySelector('input[id="modal-phone"]') || 
                                   form.querySelector('input[id="phone"]');
                if (phoneInput) {
                    const phoneGroup = phoneInput.closest('.form-group') || phoneInput.parentElement;
                    if (phoneGroup) {
                        const isFaqPage = window.location.pathname.includes('faqs');
                        const emailId = isFaqPage ? 'email' : 'modal-email';
                        const emailGroup = document.createElement('div');
                        emailGroup.className = 'form-group';
                        emailGroup.style.marginBottom = phoneGroup.style.marginBottom || '';
                        emailGroup.innerHTML = `
                            <label for="${emailId}">Email Address</label>
                            <input type="email" id="${emailId}" class="form-control" placeholder="e.g. rahul@example.com" required>
                        `;
                        phoneGroup.parentNode.insertBefore(emailGroup, phoneGroup.nextSibling);

                    }
                }
            }
        }

        // 2. Check sidebarCallbackForm (sticky sidebar on index.html)
        const sidebarForm = document.getElementById('sidebarCallbackForm');
        if (sidebarForm) {
            const hasEmail = sidebarForm.querySelector('input[type="email"]') || 
                              sidebarForm.querySelector('input[id="sidebar-email"]');
            if (!hasEmail) {
                const phoneInput = sidebarForm.querySelector('#sidebar-phone');
                if (phoneInput) {
                    const phoneGroup = phoneInput.closest('div') || phoneInput.parentElement;
                    if (phoneGroup) {
                        const emailGroup = document.createElement('div');
                        emailGroup.style.display = 'flex';
                        emailGroup.style.flexDirection = 'column';
                        emailGroup.style.gap = '6px';
                        emailGroup.innerHTML = `
                            <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-heading); font-family: 'Poppins', sans-serif;">Email Address</label>
                            <input type="email" id="sidebar-email" required placeholder="e.g. rahul@example.com" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-color); font-size: 13.5px; outline: none; background-color: var(--bg-main); font-family: 'Inter', sans-serif;">
                        `;
                        phoneGroup.parentNode.insertBefore(emailGroup, phoneGroup.nextSibling);

                    }
                }
            }
        }
    },

    ensureSocialLinksExist() {
        const footerCol = document.querySelector('.premium-footer .footer-col');
        if (footerCol) {
            const hasSocials = footerCol.querySelector('.footer-social-block');
            if (!hasSocials) {
                // Social links are missing due to browser cache of HTML! Inject them.
                const socialDiv = document.createElement('div');
                socialDiv.className = 'footer-social-block';
                socialDiv.style.marginTop = '20px';
                socialDiv.style.display = 'flex';
                socialDiv.style.flexDirection = 'column';
                socialDiv.style.gap = '8px';
                socialDiv.style.alignItems = 'flex-start';
                socialDiv.innerHTML = `
                    <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-heading);">Follow Us</span>
                    <div style="display: flex; gap: 12px;">
                        <a href="https://www.instagram.com/rushastays" target="_blank" class="social-icon-btn instagram" aria-label="Follow us on Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100088761680648&mibextid=ZbWKwL" target="_blank" class="social-icon-btn facebook" aria-label="Follow us on Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                    </div>
                `;
                footerCol.appendChild(socialDiv);

            }
        }
    },

    toggleSidebar() {
        document.getElementById('mobile-sidebar').classList.toggle('open');
        document.getElementById('sidebar-overlay').classList.toggle('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});


// ==============================================================================
// GLOBAL WINDOW EVENT HANDLERS (for HTML onclick attributes)
// ==============================================================================
window.toggleSidebar = function() {
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
};

window.resetCallbackModalState = function() {
    const form = document.getElementById('callbackForm');
    const successState = document.getElementById('modal-success-state');
    const modalHeader = document.querySelector('#callback-modal .modal-header');
    
    if (form) {
        form.reset();
        form.style.display = '';
        form.classList.remove('d-none');
    }
    if (successState) {
        successState.style.display = 'none';
        successState.classList.add('d-none');
    }
    if (modalHeader) {
        modalHeader.style.display = '';
        modalHeader.classList.remove('d-none');
    }
};

window.openCallbackModal = function(propName) {
    if (typeof window.resetCallbackModalState === 'function') {
        window.resetCallbackModalState();
    }
    
    if (propName && typeof propName === 'string') {
        const select = document.getElementById('modal-interest');
        if (select) {
            for (let opt of select.options) {
                if (opt.value.toLowerCase().includes(propName.toLowerCase()) || opt.text.toLowerCase().includes(propName.toLowerCase())) {
                    select.value = opt.value;
                    break;
                }
            }
        }
    }
    
    const modal = document.getElementById('callback-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeCallbackModal = function(e) {
    // e === true  → programmatic close (Got It button, auto-timer)
    // e is Event  → only close if click was on overlay background or close button
    if (e && e !== true && typeof e === 'object' && e.target) {
        const isOverlay = e.target.id === 'callback-modal';
        const isCloseBtn = !!(e.target.closest('.modal-close') || e.target.closest('.btn-success-close'));
        if (!isOverlay && !isCloseBtn) {
            return; // clicked inside modal content — do nothing
        }
    }
    const modal = document.getElementById('callback-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (typeof window.resetCallbackModalState === 'function') {
        window.resetCallbackModalState();
    }
};

window.shareProperty = function(id) {
    if (typeof app !== 'undefined' && app.shareProperty) {
        app.shareProperty(id);
    }
};

window.toggleAccordion = function(el) {
    const item = el ? (el.closest('.faq-item') || el.parentElement) : null;
    if (item) {
        item.classList.toggle('active');
    }
};

window.scrollToCategory = function(catId) {
    const el = document.getElementById(catId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};
