const fs = require('fs');

const propertiesData = require('./data.js').propertiesData;

const cms = {
  version: "1.0",
  siteId: "rushastays",
  siteName: "Rusha Stays",
  globals: {
    seo: {
      title: "Premium Living & Executive Suites in Gurugram | Rusha Stays",
      description: "Rusha Stays offers luxury fully-managed serviced suites and PG accommodations across Gurgaon...",
      ogImage: "https://rushastays.com/images/woman_sofa_hero.webp"
    },
    contact: {
      phone: "9205859444",
      email: "rushastays@gmail.com",
      whatsapp: "919205859444"
    },
    social: {
      instagram: "https://www.instagram.com/rushastays",
      facebook: "https://www.facebook.com/profile.php?id=100088761680648"
    },
    footer: {
      aboutText: "Experience premium fully furnished accommodations across Gurugram...",
      copyright: "© 2023 Rusha Stays. All rights reserved.",
      established: "Established in 2023, serving guests with a 99% satisfaction rate."
    }
  },
  pages: [
    {
      id: "home",
      title: "Home",
      fileName: "index.html",
      sections: [
        {
          id: "hero",
          label: "Hero Section",
          type: "section",
          fields: [
            { id: "badge", type: "text", label: "Badge Text", value: "Welcome to Rusha Stays", source: "index.html" },
            { id: "title", type: "richtext", label: "Title", value: "Live Better. <br>Work Smarter. <br><span class=\"highlight-red\">Stay Hassle-Free.</span>", source: "index.html" },
            { id: "subtitle", type: "richtext", label: "Subtitle", value: "Premium fully furnished accommodations...", source: "index.html" },
            { id: "primaryButton", type: "link", label: "Primary Button text", value: "Explore Locations", source: "index.html" },
            { id: "secondaryButton", type: "link", label: "Secondary Button text", value: "Request a Call Back", source: "index.html" }
          ]
        },
        {
          id: "marquee",
          label: "Marquee Ticker",
          type: "section",
          fields: [
            { id: "text", type: "richtext", label: "Marquee Text", value: "— Trusted By <span class=\"highlight\">Working Professionals</span>...", source: "index.html" }
          ]
        },
        {
            id: "hero-features",
            label: "Hero Features Cards",
            type: "list",
            fields: [
                { id: "features", type: "list", label: "Features", value: "List of features", source: "index.html" }
            ]
        }
      ]
    },
    {
      id: "about",
      title: "About Us",
      fileName: "about.html",
      sections: [
        {
          id: "hero",
          label: "About Hero",
          type: "section",
          fields: [
            { id: "title", type: "text", label: "Title", value: "Redefining Managed Living", source: "about.html" },
            { id: "description", type: "richtext", label: "Description", value: "At Rusha Stays, we believe that finding the perfect...", source: "about.html" }
          ]
        },
        {
          id: "vision-mission",
          label: "Vision & Mission",
          type: "section",
          fields: [
              { id: "vision", type: "richtext", label: "Our Vision", value: "To be the most trusted provider...", source: "about.html" },
              { id: "mission", type: "richtext", label: "Our Mission", value: "To deliver premium fully furnished...", source: "about.html" }
          ]
        }
      ]
    },
    {
      id: "corporate",
      title: "Corporate Stays",
      fileName: "corporate.html",
      sections: [
        {
          id: "hero",
          label: "Corporate Hero",
          type: "section",
          fields: [
            { id: "title", type: "text", label: "Title", value: "Corporate & Executive Stays", source: "corporate.html" },
            { id: "description", type: "richtext", label: "Description", value: "Premium fully managed accommodation solutions...", source: "corporate.html" }
          ]
        }
      ]
    },
    {
      id: "locations",
      title: "Locations",
      fileName: "locations.html",
      sections: [
        {
          id: "hero",
          label: "Locations Hero",
          type: "section",
          fields: [
             { id: "title", type: "text", label: "Title", value: "Explore Our Locations", source: "locations.html" },
             { id: "description", type: "text", label: "Description", value: "Find your perfect premium suite across prime locations in Gurugram.", source: "locations.html" }
          ]
        }
      ]
    }
  ],
  properties: propertiesData.map(p => ({
    id: p.id,
    type: "property",
    label: p.roomType + " - " + p.locality,
    source: "data.js",
    fields: [
      { id: "locality", type: "text", label: "Locality", value: p.locality },
      { id: "roomType", type: "text", label: "Room Type", value: p.roomType },
      { id: "occupancy", type: "text", label: "Occupancy", value: p.occupancy },
      { id: "categories", type: "list", label: "Categories", value: p.categories },
      { id: "size", type: "text", label: "Size", value: p.size },
      { id: "pricingHtml", type: "richtext", label: "Pricing Display", value: p.pricingHtml },
      { id: "priceVal", type: "text", label: "Base Price", value: p.priceVal },
      { id: "image", type: "image", label: "Primary Image", value: p.image },
      { id: "images", type: "gallery", label: "Image Gallery", value: p.images },
      { id: "aboutShort", type: "text", label: "Short Description", value: p.aboutShort },
      { id: "aboutFull", type: "richtext", label: "Full Description", value: p.aboutFull },
      { id: "inSuiteFeatures", type: "list", label: "In-Suite Features", value: p.inSuiteFeatures },
      { id: "propertyAmenities", type: "list", label: "Property Amenities", value: p.propertyAmenities },
      { id: "neighbourhoodText", type: "richtext", label: "Neighbourhood Text", value: p.neighbourhoodText },
      { id: "landmarks", type: "list", label: "Landmarks", value: p.landmarks },
      { id: "googleMapEmbed", type: "text", label: "Google Map Embed URL", value: p.googleMapEmbed }
    ]
  }))
};

fs.writeFileSync('cms.json', JSON.stringify(cms, null, 2));
console.log('cms.json generated successfully.');
