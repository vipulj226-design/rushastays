import os
import glob
import re
import datetime

ws = r"c:\Users\VIPUL\.gemini\antigravity\playground\crimson-gravity\rushastays"
sitemap_path = os.path.join(ws, "sitemap.xml")

today = datetime.date.today().isoformat()

urls = [
    # Main pages (clean URLs matching site standard)
    ("https://rushastays.com/", today, "daily", "1.0"),
    ("https://rushastays.com/about", today, "monthly", "0.8"),
    ("https://rushastays.com/locations", today, "weekly", "0.9"),
    ("https://rushastays.com/corporate", today, "monthly", "0.8"),
    ("https://rushastays.com/faqs", today, "monthly", "0.8"),
    ("https://rushastays.com/blog", today, "weekly", "0.8"),
]

# Property pages
prop_files = sorted(glob.glob(os.path.join(ws, "properties", "*.html")))
for pf in prop_files:
    fname = os.path.basename(pf)
    urls.append((f"https://rushastays.com/properties/{fname}", today, "weekly", "0.8"))

# Blog posts
blog_files = sorted(glob.glob(os.path.join(ws, "blog", "*.html")))
for bf in blog_files:
    fname = os.path.basename(bf)
    urls.append((f"https://rushastays.com/blog/{fname}", today, "monthly", "0.7"))

xml_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
]

for loc, lastmod, changefreq, priority in urls:
    xml_lines.append(f"""  <url>
    <loc>{loc}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

xml_lines.append('</urlset>')

xml_content = "\n".join(xml_lines)

with open(sitemap_path, "w", encoding="utf-8") as f:
    f.write(xml_content)

print(f"sitemap.xml regenerated successfully with {len(urls)} URLs (lastmod: {today})")
