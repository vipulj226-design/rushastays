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
                        window.propertiesData = liveProps.map(p => ({
                            id: p.id,
                            locality: p.locality,
                            roomType: p.room_type,
                            occupancy: p.occupancy,
                            size: p.size,
                            pricingHtml: p.pricing_html,
                            priceVal: String(p.price_val),
                            image: p.featured_image,
                            images: p.gallery_images && p.gallery_images.length ? p.gallery_images : [p.featured_image],
                            aboutShort: p.about_short,
                            aboutFull: p.about_full,
                            googleMapEmbed: p.google_map_embed,
                            categories: p.categories || [],
                            propertyAmenities: p.property_amenities || [],
                            inSuiteFeatures: p.in_suite_features || [],
                            landmarks: p.landmarks || []
                        }));
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
        return; // Retain static HTML title to eliminate layout reflow
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
        if (container.children.length > 0 && properties === propertiesData) {
            return; // Retain pre-rendered static cards for zero CLS
        }
        
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
        
        let html = '';
        const isSubfolder = window.location.pathname.includes('/properties/') || window.location.pathname.includes('/blog/');
        const propLinkPrefix = isSubfolder ? '' : '/properties/';

        properties.forEach(p => {
            const propUrl = `${propLinkPrefix}${p.id}`;
            const imgUrl = p.image.startsWith('/') ? p.image : '/' + p.image;
            html += cardTemplate
                .replace(/{id}/g, propUrl)
                .replace(/{image}/g, imgUrl)
                .replace(/{locality}/g, p.locality)
                .replace(/{occupancy}/g, p.occupancy)
                .replace(/{roomType}/g, p.roomType)
                .replace(/{size}/g, p.size)
                .replace(/{pricingHtml}/g, p.pricingHtml);
        });

        container.innerHTML = html;
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
            if (!url) return '';
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
            if (!url.startsWith('/')) return '/' + url;
            return url;
        };

        let finalImages = (property.images || []).map(fixImgPath);

        // Generate images carousel HTML
        let imagesHtml = '';
        let thumbnailsHtml = '';
        const mainPropertyImg = fixImgPath(property.image);
        if (finalImages && finalImages.length > 0) {
            imagesHtml = finalImages.map((img, index) => 
                `<img src="${img}" alt="Property Image ${index+1}" class="carousel-img ${index === 0 ? 'active' : ''}" style="width: 100%; height: 100%; object-fit: cover; display: ${index === 0 ? 'block' : 'none'}; border-radius: 20px;">`
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
        
        // Landmarks HTML
        const landmarksHtml = property.landmarks.map(l => `
            <div style="background: var(--bg-main); padding: 12px 16px; border-radius: 12px; display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 500;">
                <span style="font-size: 20px;">${l.icon}</span> ${l.text}
            </div>
        `).join('');

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
                    
                    <!-- Carousel -->
                    <div class="property-carousel" style="position: relative; height: 380px; border-radius: 20px; overflow: hidden; margin-bottom: 20px; box-shadow: var(--shadow-md);">
                        <div class="carousel-badge" style="position: absolute; top: 20px; left: 20px; background-color: var(--primary); color: var(--white); padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; z-index: 2;">Rusha Stays</div>
                        <div id="prop-carousel-images" style="width: 100%; height: 100%; cursor: pointer;" onclick="app.nextCarouselImage()">
                            ${imagesHtml}
                        </div>
                        <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.6); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; z-index: 2; pointer-events: none;">
                            <i class="fas fa-camera"></i> Click to view more
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
        if (images.length <= 1 || index < 0 || index >= images.length) return;

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
            // Ensure thumbnail is in view
            if (thumbs[index]) {
                thumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
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



        // Show visual success state immediately (don't wait for API)
        this.showFormSuccessState(form);

        const accessKey = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.web3forms_access_key : '';
        if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
            console.warn('[Rusha Stays] Web3Forms key not set — simulation mode.');
            return;
        }

        const payload = {
            access_key: accessKey,
            subject:    `New Lead — ${inquiry_type || formType} | Rusha Stays`,
            from_name:  "Rusha Stays Website",
            // Web3Forms uses 'email' as the reply-to; fallback to site email so the submission is never rejected
            email:      email || "rushastays@gmail.com",
            name:       name  || "Unknown",
            "Phone":           phone        || "Not provided",
            "Email (visitor)": email        || "Not provided",
            "Inquiry Type":    inquiry_type || "Not specified",
            "Form Source":     formType,
            "Page URL":        window.location.href,
            ...extraData
        };



        // Dual-Save: Record lead into Supabase Enquiries table if connected
        try {
            if (typeof window.getSupabaseClient === 'function') {
                const supabaseClient = window.getSupabaseClient();
                if (supabaseClient) {
                    supabaseClient.from('enquiries').insert({
                        name: name || 'Website Visitor',
                        phone: phone || 'Not provided',
                        email: email || null,
                        property_interest: inquiry_type || extraData.property_id || formType || 'General Enquiry',
                        source_page: window.location.pathname || 'Homepage',
                        status: 'new'
                    }).then(({ error }) => {
                        if (error) console.warn('[Supabase Enquiry]', error.message);
                    }).catch(err => {
                        console.warn('[Supabase Enquiry Exception]', err);
                    });
                }
            }
        } catch (sbErr) {
            console.warn('[Supabase Enquiry Init Error]', sbErr);
        }

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.success) {

            } else {
                console.error('[Rusha Stays] ❌ Web3Forms error:', result);
            }
        } catch (err) {
            console.error('[Rusha Stays] ❌ Network error submitting lead:', err);
        }
    },

    showFormSuccessState(form) {
        if (!form) return;
        
        if (form.id === 'callbackForm') {
            const successState = document.getElementById('modal-success-state');
            const modalHeader = document.querySelector('#callback-modal .modal-header');
            if (successState) {
                form.style.display = 'none';
                successState.style.display = 'block';
                if (modalHeader) modalHeader.style.display = 'none';
            }
            // Trigger 15s reset timeout to match inline scripts
            setTimeout(() => {
                if (typeof window.closeCallbackModal === 'function') {
                    window.closeCallbackModal(true);
                }
            }, 15000);
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
        let shareUrl = window.location.origin;
        const pathParts = window.location.pathname.split('/');
        pathParts.pop(); // Remove current filename
        const basePath = pathParts.join('/');
        shareUrl += (basePath === '/' ? '' : basePath) + '/' + id;

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
