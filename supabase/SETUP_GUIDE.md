# 🚀 Rusha Stays CMS — Supabase Setup Guide (₹0 Free Tier)

Follow these simple steps to activate your cloud database and Supabase Auth in less than 3 minutes.

---

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and click **Start your project** (or sign in with GitHub).
2. Click **New Project**.
3. Choose a name: `rushastays-cms` (or any name you prefer).
4. Set a secure Database Password (save it in a password manager).
5. Choose region: **South Asia (Mumbai)** for lowest latency in India.
6. Select the **Free Tier** ($0/month) and click **Create new project**.

---

### Step 2: Run the SQL Schema & Seed Data
1. In your Supabase Project Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Open [`supabase/schema.sql`](file:///c:/Users/VIPUL/.gemini/antigravity/playground/crimson-gravity/rushastays/supabase/schema.sql), copy all contents, paste into the SQL Editor, and click **Run**.
4. Create another new query, open [`supabase/seed.sql`](file:///c:/Users/VIPUL/.gemini/antigravity/playground/crimson-gravity/rushastays/supabase/seed.sql), copy all contents, paste into the SQL Editor, and click **Run**.
   - *This will instantly pre-populate all 6 properties, 2 blogs, 18 FAQs, 4 testimonials, and site settings!*

---

### Step 3: Create Your Admin Account
1. In the Supabase left sidebar, click **Authentication** &rarr; **Users**.
2. Click **Add User** &rarr; **Create User**.
3. Enter your admin email (e.g. `rushastays@gmail.com` or your personal email) and a password.
4. Set **Auto Confirm User?** to **YES** (checked).
5. Click **Create User**.

---

### Step 4: Connect the Admin Panel
1. In your Supabase left sidebar, click **Project Settings** (gear icon at the bottom) &rarr; **API**.
2. Copy two values:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API Keys** &rarr; `anon` / `public` key
3. Open your admin panel at [`https://rushastays.com/admin/login.html`](https://rushastays.com/admin/login.html) (or locally in your browser).
4. Click **"⚙️ Configure Supabase Credentials"** and paste your URL and Anon Key.
5. Log in with your email and password.

---

### 🛡️ Security Architecture
- **Public Visitors**: Can only view published properties, blogs, FAQs, and submit callback enquiries.
- **Admin Users**: Authenticated via Supabase JWT with full CRUD access to properties, blogs, media, enquiries, and site settings.
- **Service Role Secrets**: Never stored in the frontend codebase.
