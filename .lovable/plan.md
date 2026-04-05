## Plan

### 1. Database Setup
- **`slideshow_quotes`** table: stores quote data (quote text, author, font, colors, background, all styling props) + image URL
- **`user_roles`** table: admin role for `lazy@lazyunicorn.ai`
- RLS policies: public read on slideshow_quotes, admin-only write

### 2. Authentication
- Google Sign-In via Lovable Cloud
- Admin route `/admin` protected — only `lazy@lazyunicorn.ai` can access
- Check email from auth session (no client-side role hacks)

### 3. Admin Page (`/admin`)
- User list (from auth admin or profiles)
- Full quote customizer (reuse same controls from homepage)
- Save button that stores the designed quote + generates a preview image
- List of saved slideshow quotes with delete option

### 4. Homepage Hero Section
- Large headline: "Create awesome quotes for your socials."
- Right side: square slideshow cycling through saved quotes from DB
- Push existing quote editor below the hero

### 5. Shared Components
- Extract quote customizer controls into a reusable component (used on both homepage and admin)

**Note:** Google Sign-In requires configuration in Lovable Cloud. I'll set up the auth flow and guide you through enabling Google provider.
