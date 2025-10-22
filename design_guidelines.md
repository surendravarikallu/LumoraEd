# LumoraEd Design Guidelines

## Design Approach
**System-Based**: Drawing from Linear's clean aesthetics, Notion's organizational clarity, and Material Design principles for data visualization. This approach prioritizes learning efficiency while maintaining visual appeal for student engagement.

## Color Palette

**Light Mode:**
- Primary: 251 63% 51% (vibrant purple-blue for brand identity)
- Secondary: 217 91% 60% (supporting blue for interactive elements)
- Success: 142 71% 45% (progress indicators, completion states)
- Background: 0 0% 100% (pure white)
- Surface: 240 5% 96% (cards, elevated elements)
- Text Primary: 222 47% 11% (high contrast body text)
- Text Secondary: 215 14% 34% (supporting text, metadata)
- Border: 214 32% 91% (subtle dividers)

**Dark Mode:**
- Primary: 251 70% 65% (lighter purple-blue)
- Secondary: 217 91% 70% (enhanced blue)
- Success: 142 71% 55% (brighter green)
- Background: 222 47% 11% (deep navy-black)
- Surface: 217 33% 17% (elevated cards)
- Text Primary: 0 0% 98% (near-white text)
- Text Secondary: 215 20% 65% (muted text)
- Border: 217 33% 24% (subtle dividers)

**Accent Colors:**
- Warning: 38 92% 50% (alerts, deadlines)
- Chart Colors: Use Material Design's data visualization palette (blue, purple, teal, amber)

## Typography

**Font Family:**
- Primary: Inter (via Google Fonts CDN)
- Mono: JetBrains Mono (code snippets, resource links)

**Scale:**
- Hero/Page Titles: text-4xl md:text-5xl font-bold (tracking-tight)
- Section Headers: text-2xl md:text-3xl font-semibold
- Card Titles: text-xl font-semibold
- Body Text: text-base leading-relaxed
- Labels/Meta: text-sm font-medium
- Captions: text-xs text-secondary

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Tight spacing: p-2, gap-2 (compact data displays)
- Standard spacing: p-4, gap-4 (cards, lists)
- Generous spacing: p-6, gap-6 (sections)
- Major spacing: p-8, p-12 (page containers)

**Grid Structure:**
- Main container: max-w-7xl mx-auto px-4 md:px-6
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Sidebar + Content: Fixed 256px sidebar, flex-1 main content area

## Component Library

**Navigation:**
- Fixed sidebar (256px) with icon + label items
- Top bar with user profile, notifications, search
- Mobile: Collapsible hamburger menu with slide-out drawer

**Challenge Cards:**
- Elevated surface with rounded-xl borders
- Header: Challenge title (text-xl font-semibold)
- Meta row: Duration badge, difficulty indicator, participant count
- Progress bar showing completion percentage
- CTA button: "Continue" or "Start Challenge"
- Hover state: subtle shadow lift (shadow-lg)

**Daily Task View:**
- Breadcrumb navigation (Challenge → Day X)
- Task header with day number badge
- Content area with markdown support
- Resource links section with icons (PDF, video, link)
- Bottom action bar: "Mark Complete" button + Next Day preview

**Quiz Interface:**
- Question counter (3/10) at top
- Large, readable question text (text-lg)
- Radio button options with full-width clickable cards
- Color-coded feedback (green for correct, red for incorrect)
- Progress indicator showing quiz completion

**Dashboard:**
- Hero stats row: 3-4 metric cards (Active Challenges, Completion Rate, Current Streak, Total Points)
- Chart section: Line/area chart for progress over time using Recharts
- Active challenges table with sortable columns
- Recent activity feed with timestamps

**Progress Tracking:**
- Circular progress rings for challenge completion
- Daily streak calendar heatmap (GitHub-style)
- Horizontal progress bars with percentage labels
- Badge system for milestones (7-day, 30-day, 100% completion)

**Forms:**
- Input fields: rounded-lg border with focus:ring-2 ring-primary
- Labels: text-sm font-medium mb-2
- Helper text: text-xs text-secondary
- Validation states: border-red-500 for errors, border-success for valid

**Buttons:**
- Primary: bg-primary text-white rounded-lg px-6 py-3 font-medium
- Secondary: border-2 border-primary text-primary bg-transparent
- Ghost: text-primary hover:bg-primary/10
- Icon buttons: p-2 rounded-lg hover:bg-surface

**Data Visualization:**
- Use Recharts library for charts and graphs
- Color palette: Primary blue, secondary purple, success green
- Tooltips on hover with data details
- Responsive chart sizing with aspect ratio preservation

## Animations

**Minimal, Purposeful Interactions:**
- Hover transitions: duration-200 ease-in-out
- Card elevation on hover: transform scale-105
- Progress bar fills: animate with transition-all duration-500
- Page transitions: fade-in with opacity animation
- NO excessive scroll animations or parallax effects

## Images

**Hero Section:**
- Full-width hero image (1920x600px) showing diverse students collaborating/learning
- Overlaid with gradient (from bg-primary/80 to transparent)
- Centered headline + CTA button on top

**Challenge Cards:**
- Thumbnail images (400x225px) representing challenge topic
- Fallback: gradient backgrounds with topic icon overlay

**Dashboard:**
- Avatar images for user profile (circular, 40px or 64px)
- Achievement badges as small icons (24px)
- No decorative images in data-heavy sections

**Certification Alerts:**
- Provider logos (120x40px) alongside certification details

**Image Placement:**
- Hero: Top of home/landing page
- Challenge thumbnails: Left side of horizontal cards or top of vertical cards
- Profile avatars: Top navigation bar, leaderboard entries
- Empty states: Centered illustration with supporting text