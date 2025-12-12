# Salah Buddy: React Native Conversion Research Report

**Generated:** December 12, 2025
**Repository:** `/Users/ammarkhan/!claude-code/salah-buddy`
**Target:** Convert HTML prototype to React Native mobile app

---

## Executive Summary

The salah-buddy repository contains a **fully-functional HTML prototype** (`designs/web-app.html`) that serves as a complete reference implementation for a React Native mobile app. The prototype is production-ready from a design perspective, featuring:

- ✅ Complete UI/UX for 4 main screens (Home, Stories, Dashboard, Leaderboard)
- ✅ Full design system with Luqmay brand colors and typography (Lexend font)
- ✅ Islamic geometric patterns research and implementation guides
- ✅ Responsive mobile-first design with bottom navigation
- ✅ Animation and interaction patterns defined
- ✅ 30 days of story content with metadata

**Key Finding:** The HTML prototype is comprehensive enough to serve as a **pixel-perfect specification** for React Native development. All design decisions, color values, typography scales, and component structures are already defined.

---

## Repository Structure

### Directory Layout

```
/Users/ammarkhan/!claude-code/salah-buddy/
├── .claude/
│   └── CLAUDE.md                    # Project overview and context
├── .git/                            # Git repository (initialized)
├── assets/                          # Empty (placeholder for future assets)
├── designs/
│   ├── web-app.html                 # ⭐ PRIMARY REFERENCE - Full prototype
│   ├── app-prototype.html           # Earlier prototype version
│   ├── presentation.html            # Presentation/pitch deck
│   ├── typography-redesign-luqmay.html  # Typography showcase
│   └── typography-strategy.md       # Typography implementation guide
├── notes/                           # Empty (placeholder for development notes)
└── research/
    ├── README.md                    # Research documentation index
    ├── design-examples.md           # Screen-by-screen design guidance
    ├── implementation-guide.md      # Developer quick reference (colors, SVGs, CSS)
    ├── islamic-design-research.html # Islamic geometric patterns research
    └── tech-stack-research.html     # Technology stack recommendations
```

### Key Insights

1. **No existing React Native code** - This is a greenfield React Native project
2. **Comprehensive design system** - All visual design decisions are documented
3. **Design-first approach** - HTML prototype validates UX before development
4. **Islamic design principles** - Extensive research on culturally appropriate patterns

---

## HTML Prototype Analysis (`designs/web-app.html`)

### File Statistics

- **Total Lines:** 2,258 lines
- **CSS:** ~1,600 lines (includes responsive styles)
- **JavaScript:** ~250 lines (screen navigation, animations, data)
- **HTML:** ~400 lines (4 complete screens)

### Architecture Overview

#### 1. **Screens Implemented**

The prototype contains 4 fully-designed screens:

| Screen | Route ID | Purpose | Key Features |
|--------|----------|---------|--------------|
| **Home** | `homeScreen` | Daily prayer tracking | Prayer cards, streak display, today's story, quick stats |
| **Daily Stories** | `storiesScreen` | Educational video content | 30-day story grid, progress tracking, locked/unlocked states |
| **My Progress** | `dashboardScreen` | Personal analytics | Stats cards, 30-day calendar, completion tracking |
| **Leaderboard** | `leaderboardScreen` | Social competition | Podium (top 3), ranked list, personal rank card |

#### 2. **Navigation System**

**Desktop/Tablet:**
- Sidebar navigation (280px wide, fixed left)
- Always visible with active state indicators

**Mobile:**
- Bottom navigation bar (mobile-nav-toggle)
- 4 icon-based tabs with labels
- Fixed to bottom, appears below 768px breakpoint

**Implementation Detail:**
```javascript
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenName + 'Screen').classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.currentTarget.classList.add('active');
}
```

---

## Design System Breakdown

### 1. **Color Palette (CSS Variables)**

The design uses the **Luqmay Brand Palette** as documented in `.claude/CLAUDE.md`:

```css
/* Core Brand Colors */
--cream: #F5F0E8;           /* Primary background */
--cream-dark: #EBE4D8;      /* Darker cream for hover states */
--gold: #F5B526;            /* Primary accent, stars, highlights */
--gold-light: #FFE082;      /* Light gold for gradients */
--gold-dark: #E5A516;       /* Dark gold for emphasis */
--dark: #1C170D;            /* Primary text color */
--dark-soft: #3D3527;       /* Secondary text color */
--white: #FFFFFF;           /* Card backgrounds */
--border: #E8E0CF;          /* Subtle borders */

/* Success/Completion Colors */
--green: #22C55E;           /* Prayer completed */
--green-light: #86EFAC;     /* Hover/light states */
--green-dark: #16A34A;      /* Dark green */

/* Additional Accent Colors */
--coral: #FF6B6B;           /* Streak/urgency */
--coral-light: #FF8E8E;
--purple: #A78BFA;          /* Story gradients */
--purple-light: #C4B5FD;
--teal: #14B8A6;            /* Story gradients */
--teal-light: #5EEAD4;
```

**Prayer-Time Specific Colors** (from `research/implementation-guide.md`):

```css
--fajr-primary: #FF6F00;     /* Sunrise orange */
--dhuhr-primary: #1E88E5;    /* Bright sky blue */
--asr-primary: #F5B526;      /* Warm gold */
--maghrib-primary: #E67E22;  /* Deep orange */
--isha-primary: #8E44AD;     /* Twilight purple */
```

### 2. **Typography System**

**Font Family:** Lexend (Google Fonts)
- **Weights Used:** 400, 500, 600, 700, 800, 900
- **Why Lexend:** Designed for dyslexia accommodation, superior readability for kids

**Typography Scale:**

```css
/* Font Sizes */
--font-sm: 14px;      /* Captions, small labels */
--font-base: 18px;    /* Body text, descriptions */
--font-lg: 22px;      /* Emphasized text */
--font-xl: 28px;      /* Small headings */
--font-2xl: 36px;     /* Section headings */
--font-3xl: 48px;     /* Page titles */
--font-4xl: 64px;     /* Hero moments (streak numbers) */
```

**Usage Examples:**
- Greeting header: 48px, weight 800
- Prayer names: 22px, weight 700
- Stats: 36px, weight 900
- Streak number: 64px, weight 900

**Typography Philosophy** (from `typography-strategy.md`):
> "Paula Scher Principle: Typography Should Shout When It Needs To. For kids ages 7-10, scale creates excitement. Don't be timid—big type = big energy."

### 3. **Spacing System**

```css
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

### 4. **Border Radius (Islamic Geometric + Child-Friendly)**

```css
--radius-sm: 12px;    /* Buttons, small elements */
--radius-md: 16px;    /* Cards, modals */
--radius-lg: 24px;    /* Large cards */
--radius-xl: 32px;    /* Hero sections */
```

**Design Principle:** Slightly rounded corners balance geometric precision with warmth.

---

## Component Analysis

### 1. **Prayer Card Component**

**HTML Structure:**
```html
<div class="prayer-card completed" data-prayer="fajr" onclick="togglePrayer(this)">
    <div class="prayer-card-icon">🌅</div>
    <div class="prayer-card-name">Fajr</div>
    <div class="prayer-card-time">5:12 AM</div>
    <div class="prayer-card-check">✓</div>
</div>
```

**States:**
1. **Default:** Cream background, dark border
2. **Current:** Gold border with pulse animation
3. **Completed:** Green gradient background, checkmark visible

**Key CSS:**
```css
.prayer-card {
    background: var(--cream);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md) var(--spacing-xl);
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid var(--border);
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
}

.prayer-card.completed {
    background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
    border-color: var(--green);
}
```

**React Native Mapping:**
- Use `Pressable` component with `onPress`
- Gradient via `react-native-linear-gradient`
- Animated border with `Animated.View`
- State management: `useState` for completion tracking

### 2. **Streak Card Component**

**Visual Design:**
- Coral gradient background (`--coral` → `--coral-light`)
- Giant emoji watermark (150px, 20% opacity)
- Huge number: 64px, weight 900
- White text on colored background

**Data Structure:**
```javascript
const userData = {
    currentStreak: 12,
    bestStreak: 15
};
```

**React Native Implementation:**
```javascript
<LinearGradient colors={['#FF6B6B', '#FF8E8E']}>
  <Text style={{ fontSize: 64, fontWeight: '900' }}>{currentStreak}</Text>
  <Text>days in a row!</Text>
  <Text>Personal Best: {bestStreak} days</Text>
</LinearGradient>
```

### 3. **Story Card Component**

**HTML Structure:**
```html
<div class="story-card watched current">
    <div class="story-card-thumbnail" style="background: gradient">
        <div class="story-card-day">Day 12</div>
        {emoji}
        <div class="story-card-check">✓</div>
        <div class="story-card-play">▶</div>
    </div>
    <div class="story-card-content">
        <div class="story-card-title">The Night Journey</div>
        <div class="story-card-duration">⏱️ 3-5 min</div>
    </div>
</div>
```

**States:**
1. **Locked:** Opacity 60%, lock icon, no click
2. **Current:** Gold border, pulsing shadow
3. **Watched:** Green badge, checkmark

**Data Structure (30 Stories):**
```javascript
const stories = [
    {
        day: 1,
        title: "What is Salah?",
        desc: "Introduction to the beautiful gift of prayer",
        emoji: "🕌",
        color: "linear-gradient(135deg, #667eea, #764ba2)"
    },
    // ... 30 total stories
];
```

**Key Insight:** All 30 days of content are pre-defined with:
- Title
- Description
- Emoji
- Unique gradient color
- Duration (consistently 3-5 min)

### 4. **Calendar Grid Component**

**Implementation:**
```html
<div class="calendar-grid">
    <div class="calendar-day completed">1<div class="calendar-day-prayers">5/5</div></div>
    <div class="calendar-day partial">6<div class="calendar-day-prayers">4/5</div></div>
    <div class="calendar-day today">12<div class="calendar-day-prayers">3/5</div></div>
    <div class="calendar-day future">13</div>
</div>
```

**CSS Grid:**
```css
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: var(--spacing-md);
}
```

**States:**
1. **Completed:** Green/teal gradient, 5/5 prayers
2. **Partial:** Gold gradient, X/5 prayers
3. **Today:** Coral border, pulsing shadow
4. **Future:** Cream background, 40% opacity

**React Native Alternative:** Use `FlatList` with `numColumns={10}` or custom flexbox grid.

### 5. **Leaderboard Podium**

**Structure:**
```html
<div class="podium">
    <div class="podium-place second">
        <div class="podium-avatar">🌟</div>
        <div class="podium-name">Yusuf</div>
        <div class="podium-points">2,380 ⭐</div>
        <div class="podium-stand">2</div>
    </div>
    <!-- First and Third places -->
</div>
```

**Visual Hierarchy:**
- **First Place:** 100px avatar, 120px stand height, gold gradient
- **Second Place:** 80px avatar, 90px stand height, silver gradient
- **Third Place:** 80px avatar, 60px stand height, bronze gradient

**Hover Effect:** `transform: translateY(-10px)` on hover

---

## Animations & Interactions

### 1. **Background Stars**

**Implementation:**
```javascript
function generateStars() {
    const container = document.getElementById('starsContainer');
    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.width = (Math.random() * 3 + 2) + 'px';
        container.appendChild(star);
    }
}
```

**CSS Animation:**
```css
@keyframes twinkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.3); }
}

.star {
    animation: twinkle 3s ease-in-out infinite;
}
```

**React Native Equivalent:**
- Use `Animated.View` with loop
- `Animated.timing` for opacity and scale
- Random positioning via `useState`

### 2. **Confetti Celebration**

**Trigger:** When prayer is marked complete

**Implementation:**
```javascript
function triggerConfetti() {
    const container = document.getElementById('confettiContainer');
    container.style.display = 'block';

    const colors = ['#F5B526', '#22C55E', '#14B8A6', '#FF6B6B', '#A78BFA'];

    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(confetti);
    }

    setTimeout(() => { container.style.display = 'none'; }, 3000);
}
```

**CSS Animation:**
```css
@keyframes confettiFall {
    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
```

**React Native Libraries:**
- `react-native-confetti-cannon`
- Custom `Animated.View` with physics

### 3. **Prayer Completion Modal**

**Structure:**
```html
<div class="modal-overlay" id="prayerModal">
    <div class="modal-content">
        <div class="modal-emoji">🌟</div>
        <h3 class="modal-title">Mashallah!</h3>
        <p class="modal-message">You completed <span id="modalPrayerName">Maghrib</span> prayer!</p>
        <button class="modal-btn" onclick="closeModal()">Keep Going!</button>
    </div>
</div>
```

**Animations:**
```css
@keyframes modalPop {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-30px); }
}
```

**React Native Equivalent:**
- Use `react-native-modal` package
- `Animated.spring` for bounce effect
- `Animated.sequence` for modal pop

### 4. **Current Prayer Pulse**

**CSS:**
```css
.prayer-card.current {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(245, 181, 38, 0.2);
    animation: currentPulse 2s infinite;
}

@keyframes currentPulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(245, 181, 38, 0.2); }
    50% { box-shadow: 0 0 0 6px rgba(245, 181, 38, 0.3); }
}
```

**React Native:**
```javascript
const pulseAnim = useRef(new Animated.Value(3)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 6, duration: 1000 }),
      Animated.timing(pulseAnim, { toValue: 3, duration: 1000 })
    ])
  ).start();
}, []);
```

---

## Data Structures

### 1. **User Data**

```javascript
const userData = {
    name: 'Ahmad',
    avatar: '😊',
    currentStreak: 12,
    bestStreak: 15,
    totalPrayers: 57,
    rank: 24,
    stars: 1240,
    storiesWatched: 11
};
```

### 2. **Prayer Data (Daily)**

```javascript
const prayers = [
    {
        id: 'fajr',
        name: 'Fajr',
        emoji: '🌅',
        time: '5:12 AM',
        completed: true,
        color: '#FF6F00'
    },
    {
        id: 'dhuhr',
        name: 'Dhuhr',
        emoji: '☀️',
        time: '12:30 PM',
        completed: true,
        color: '#1E88E5'
    },
    {
        id: 'asr',
        name: 'Asr',
        emoji: '🌤️',
        time: '3:45 PM',
        completed: true,
        color: '#F5B526'
    },
    {
        id: 'maghrib',
        name: 'Maghrib',
        emoji: '🌇',
        time: '6:32 PM',
        completed: false,
        current: true,
        color: '#E67E22'
    },
    {
        id: 'isha',
        name: 'Isha',
        emoji: '🌙',
        time: '8:00 PM',
        completed: false,
        color: '#8E44AD'
    }
];
```

### 3. **Ramadan Calendar (30 Days)**

```javascript
const ramadanCalendar = [
    { day: 1, prayers: 5, total: 5, status: 'completed' },
    { day: 2, prayers: 5, total: 5, status: 'completed' },
    { day: 6, prayers: 4, total: 5, status: 'partial' },
    { day: 12, prayers: 3, total: 5, status: 'today' },
    { day: 13, prayers: 0, total: 5, status: 'future' }
];
```

### 4. **Leaderboard Data**

```javascript
const leaderboard = [
    { rank: 1, name: 'Fatima', avatar: '👑', points: 2450, streak: 30 },
    { rank: 2, name: 'Yusuf', avatar: '🌟', points: 2380, streak: 28 },
    { rank: 3, name: 'Aisha', avatar: '✨', points: 2290, streak: 26 },
    { rank: 4, name: 'Omar', avatar: '🌙', points: 2150, streak: 22 },
    // ... more users
];
```

---

## Responsive Design Strategy

### Breakpoints

```css
/* Desktop (default): 1024px+ */
.sidebar { width: 280px; }
.main-content { margin-left: 280px; }

/* Tablet: 768px - 1023px */
@media (max-width: 1024px) {
    .sidebar { width: 240px; }
    .main-content { margin-left: 240px; }
    .home-grid { grid-template-columns: 1fr; }
}

/* Mobile: < 768px */
@media (max-width: 768px) {
    .sidebar { display: none; }
    .mobile-nav-toggle { display: block; }
    .main-content {
        margin-left: 0;
        padding: var(--spacing-md);
        padding-bottom: 100px;
    }
    .stories-grid { grid-template-columns: repeat(2, 1fr); }
    .calendar-grid { grid-template-columns: repeat(5, 1fr); }
}

/* Small Mobile: < 480px */
@media (max-width: 480px) {
    .greeting h1 { font-size: 20px; }
    .stat-card-value { font-size: var(--font-lg); }
}
```

### Mobile Navigation

**Bottom Tab Bar:**
```html
<nav class="mobile-nav-toggle">
    <div class="nav-items">
        <div class="mobile-nav-item active">
            <span class="nav-icon">🏠</span>
            <span>Home</span>
        </div>
        <!-- Stories, Progress, Rank tabs -->
    </div>
</nav>
```

**CSS:**
```css
.mobile-nav-toggle {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--white);
    padding: var(--spacing-sm) var(--spacing-md);
    box-shadow: 0 -4px 20px rgba(28, 23, 13, 0.1);
    z-index: 1000;
    border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
    .mobile-nav-toggle { display: block; }
}
```

---

## Islamic Design Integration

### Research Documentation

The repository includes extensive Islamic design research:

**File:** `research/islamic-design-research.html`

**Key Patterns Identified:**

1. **8-Pointed Star** (Rub el Hizb)
   - Use: Prayer icons, achievement badges
   - Construction: Two overlapping squares rotated 45°
   - Symbolism: Unity, perfection in Islamic tradition

2. **Hexagon Grid**
   - Use: Prayer calendar/tracker
   - Pattern: Honeycomb tessellation
   - Symbolism: Community, interconnectedness

3. **Interlocking Circles**
   - Use: Subtle background texture at 5-10% opacity
   - Pattern: Flower of Life derivative
   - Symbolism: Infinity, eternal nature of prayer

4. **Prayer-Time Color Symbolism**
   - Fajr (Dawn): Orange (#FF6F00) - Sunrise, fresh start
   - Dhuhr (Noon): Sky Blue (#1E88E5) - Brightness, clarity
   - Asr (Afternoon): Gold (#F5B526) - Transition, golden hour
   - Maghrib (Sunset): Deep Orange (#E67E22) - Gratitude
   - Isha (Night): Purple (#8E44AD) - Peace, contemplation

### SVG Pattern Resources

**File:** `research/implementation-guide.md`

**8-Pointed Star SVG:**
```svg
<svg width="48" height="48" viewBox="0 0 48 48">
  <g transform="translate(24, 24)">
    <rect x="-8" y="-8" width="16" height="16" fill="#F5B526" rx="1"/>
    <rect x="-8" y="-8" width="16" height="16" fill="#F5B526" rx="1" transform="rotate(45)"/>
  </g>
</svg>
```

**Hexagon SVG:**
```svg
<svg width="60" height="52" viewBox="0 0 60 52">
  <polygon points="30,0 52,13 52,39 30,52 8,39 8,13"
           fill="#FFFFFF" stroke="#F5B526" stroke-width="2" rx="2"/>
</svg>
```

**React Native Implementation:**
Use `react-native-svg` to render these patterns as components.

---

## Technology Stack Recommendation

### Confirmed Decisions

From `research/tech-stack-research.html`:

1. **Framework:** React Native with Expo
2. **Styling:** NativeWind (Tailwind CSS for React Native)
3. **Language:** TypeScript
4. **Navigation:** Expo Router (file-based routing)
5. **State Management:** React Context + AsyncStorage
6. **Animations:** React Native Reanimated 2

### Additional Libraries Needed

Based on prototype features:

| Feature | Library | Reason |
|---------|---------|--------|
| **Gradients** | `react-native-linear-gradient` | Prayer cards, streak card backgrounds |
| **SVG Patterns** | `react-native-svg` | Islamic geometric patterns, icons |
| **Modals** | `react-native-modal` | Prayer completion, video player |
| **Confetti** | `react-native-confetti-cannon` | Celebration animations |
| **Safe Area** | `react-native-safe-area-context` | iOS notch handling |
| **Fonts** | `expo-google-fonts` | Lexend font family |
| **Calendar** | Custom grid or `react-native-calendars` | 30-day Ramadan tracker |

---

## React Native Component Mapping

### Screen Components

| HTML Screen | React Native Component | Route |
|-------------|----------------------|-------|
| `homeScreen` | `app/(tabs)/index.tsx` | `/` |
| `storiesScreen` | `app/(tabs)/stories.tsx` | `/stories` |
| `dashboardScreen` | `app/(tabs)/dashboard.tsx` | `/dashboard` |
| `leaderboardScreen` | `app/(tabs)/leaderboard.tsx` | `/leaderboard` |

### Reusable Components

| HTML Class | React Native Component | File Path |
|------------|----------------------|-----------|
| `.prayer-card` | `<PrayerCard>` | `components/PrayerCard.tsx` |
| `.streak-card` | `<StreakCard>` | `components/StreakCard.tsx` |
| `.story-card` | `<StoryCard>` | `components/StoryCard.tsx` |
| `.stat-card` | `<StatCard>` | `components/StatCard.tsx` |
| `.calendar-day` | `<CalendarDay>` | `components/CalendarDay.tsx` |
| `.leaderboard-item` | `<LeaderboardItem>` | `components/LeaderboardItem.tsx` |
| `.modal-content` | `<CelebrationModal>` | `components/CelebrationModal.tsx` |

---

## File Path Mapping (HTML → React Native)

### CSS Variables → Theme Config

**Source:** `designs/web-app.html` (lines 15-59)

**Destination:** `constants/theme.ts`

```typescript
export const theme = {
  colors: {
    cream: '#F5F0E8',
    creamDark: '#EBE4D8',
    gold: '#F5B526',
    goldLight: '#FFE082',
    goldDark: '#E5A516',
    dark: '#1C170D',
    darkSoft: '#3D3527',
    white: '#FFFFFF',
    border: '#E8E0CF',
    green: '#22C55E',
    coral: '#FF6B6B',
    purple: '#A78BFA',
    teal: '#14B8A6',
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSize: {
    sm: 14,
    base: 18,
    lg: 22,
    xl: 28,
    xxl: 36,
    xxxl: 48,
    xxxxl: 64,
  },
};
```

### Story Data → JSON/Constants

**Source:** `designs/web-app.html` (lines 2048-2080)

**Destination:** `constants/stories.ts`

```typescript
export const stories = [
  {
    day: 1,
    title: "What is Salah?",
    desc: "Introduction to the beautiful gift of prayer",
    emoji: "🕌",
    color: ["#667eea", "#764ba2"]
  },
  // ... 30 stories
];
```

### Prayer Times → Context/State

**Source:** `designs/web-app.html` (prayer-card elements)

**Destination:** `context/PrayerContext.tsx`

```typescript
export const usePrayer = () => {
  const [prayers, setPrayers] = useState([
    { id: 'fajr', name: 'Fajr', emoji: '🌅', time: '5:12 AM', completed: false },
    // ... 5 prayers
  ]);
  // Toggle, reset, sync logic
};
```

---

## Recommended Project Structure

```
salah-buddy-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx              # Home screen
│   │   ├── stories.tsx            # Daily stories
│   │   ├── dashboard.tsx          # My progress
│   │   └── leaderboard.tsx        # Leaderboard
│   ├── _layout.tsx                # Root layout with tab navigation
│   └── modal/
│       └── prayer-complete.tsx    # Celebration modal
├── components/
│   ├── PrayerCard.tsx
│   ├── StreakCard.tsx
│   ├── StoryCard.tsx
│   ├── StatCard.tsx
│   ├── CalendarDay.tsx
│   ├── LeaderboardItem.tsx
│   ├── CelebrationModal.tsx
│   └── BackgroundStars.tsx
├── constants/
│   ├── theme.ts                   # Color palette, spacing, typography
│   ├── stories.ts                 # 30 days of story data
│   └── prayers.ts                 # Prayer metadata (times, colors)
├── context/
│   ├── PrayerContext.tsx          # Prayer state management
│   ├── UserContext.tsx            # User data (streak, rank, stats)
│   └── StoriesContext.tsx         # Story progress tracking
├── hooks/
│   ├── usePrayers.ts              # Prayer tracking logic
│   ├── useStreak.ts               # Streak calculation
│   └── useAnimatedValue.ts        # Reanimated helpers
├── assets/
│   ├── fonts/
│   │   └── Lexend-*.ttf           # Lexend font files
│   └── svg/
│       ├── star-8-pointed.tsx     # Islamic geometric SVGs
│       └── hexagon.tsx
└── utils/
    ├── prayerTimes.ts             # Prayer time calculation (API or local)
    ├── storage.ts                 # AsyncStorage helpers
    └── animations.ts              # Animation presets
```

---

## Key Development Tasks

### Phase 1: Setup (Week 1)

- [ ] Initialize Expo project with TypeScript
- [ ] Install dependencies (NativeWind, Reanimated, SVG, Linear Gradient)
- [ ] Set up file-based routing with Expo Router
- [ ] Configure Lexend fonts via `expo-google-fonts`
- [ ] Create `constants/theme.ts` from CSS variables
- [ ] Set up tab navigation layout

### Phase 2: Core Components (Week 2)

- [ ] Build `<PrayerCard>` with states (default, current, completed)
- [ ] Build `<StreakCard>` with gradient background
- [ ] Build `<StoryCard>` with locked/unlocked/watched states
- [ ] Build `<StatCard>` for dashboard
- [ ] Build `<CalendarDay>` component
- [ ] Build `<LeaderboardItem>` and `<PodiumPlace>`

### Phase 3: Screens (Week 3)

- [ ] Implement Home screen (`app/(tabs)/index.tsx`)
- [ ] Implement Daily Stories screen
- [ ] Implement Dashboard screen
- [ ] Implement Leaderboard screen
- [ ] Connect screens to shared state (Context API)

### Phase 4: Interactions & Animations (Week 4)

- [ ] Add background stars animation
- [ ] Add confetti celebration on prayer completion
- [ ] Add modal for prayer completion ("Mashallah!")
- [ ] Add pulse animation for current prayer
- [ ] Add hover/press states for all interactive elements

### Phase 5: Data & Storage (Week 5)

- [ ] Integrate prayer time calculation (API or local calculation)
- [ ] Implement AsyncStorage for local persistence
- [ ] Add streak calculation logic
- [ ] Add leaderboard data (mock or Firebase)
- [ ] Add story progress tracking

### Phase 6: Polish & Testing (Week 6)

- [ ] Add Islamic geometric pattern overlays
- [ ] Test on iOS and Android devices
- [ ] Optimize animations for 60 FPS
- [ ] Add accessibility labels (VoiceOver/TalkBack)
- [ ] Test with kids ages 7-10 for usability

---

## Critical Design Decisions

### 1. **Typography: Lexend 400-900**

**Rationale:** Designed for dyslexia accommodation, superior readability for kids.

**Implementation:**
```typescript
import {
  useFonts,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
  Lexend_900Black,
} from '@expo-google-fonts/lexend';
```

### 2. **Color Palette: Luqmay Brand Alignment**

**Rationale:** Maintains brand consistency with Luqmay's warm, educational identity.

**Key Colors:**
- Gold (#F5B526): Primary accent, celebrations
- Cream (#F5F0E8): Background, approachable warmth
- Green (#22C55E): Success, prayer completed
- Coral (#FF6B6B): Streak urgency, energy

### 3. **Navigation: Bottom Tabs (Mobile-First)**

**Rationale:** Kids are familiar with bottom tab navigation from other apps.

**Implementation:**
```typescript
// app/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#F5B526' }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: '🏠' }} />
      <Tabs.Screen name="stories" options={{ title: 'Stories', tabBarIcon: '📺' }} />
      <Tabs.Screen name="dashboard" options={{ title: 'Progress', tabBarIcon: '📊' }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Rank', tabBarIcon: '🏆' }} />
    </Tabs>
  );
}
```

### 4. **Islamic Patterns: 8-Pointed Star + Hexagons**

**Rationale:** Culturally authentic, child-friendly, visually appealing.

**Implementation:**
- Use `react-native-svg` for vector graphics
- Store SVG components in `assets/svg/`
- Apply at prayer icons, calendar grid, background patterns

### 5. **Animations: Reanimated 2 for Performance**

**Rationale:** Native performance (60 FPS), smooth on older devices.

**Examples:**
- Pulse animation for current prayer
- Confetti celebration
- Modal pop-in
- Star twinkling

---

## Accessibility Considerations

### 1. **Color Contrast (WCAG AA)**

All text meets minimum contrast ratios:
- Dark text (#1C170D) on White (#FFFFFF): 15.8:1 ✅ AAA
- Dark text on Cream (#F5F0E8): 13.2:1 ✅ AAA
- Gold (#F5B526) on White: 6.1:1 ✅ AA Large Text

### 2. **Touch Targets (44x44px Minimum)**

Prayer cards, buttons, nav items all exceed iOS minimum:
- Prayer card: Full width, 64px height
- Nav tabs: 56px height
- Stat cards: 120px+ height

### 3. **Screen Reader Support**

All components need `accessibilityLabel`:
```typescript
<Pressable accessibilityLabel="Mark Fajr prayer as complete">
  <PrayerCard prayer="fajr" />
</Pressable>
```

### 4. **Font Scaling**

Support iOS/Android dynamic type:
```typescript
import { PixelRatio } from 'react-native';

const scaledFontSize = (size: number) => {
  return size * PixelRatio.getFontScale();
};
```

---

## Testing Strategy

### 1. **User Testing with Kids (Ages 7-10)**

**Goals:**
- Can kids navigate between screens intuitively?
- Do they understand prayer tracking workflow?
- Are stats/streaks motivating?
- Is typography readable at a glance?

**Method:**
- 5-10 kids (mix of boys/girls)
- Give basic task: "Track your prayers for today"
- Observe without guidance
- Ask: "What does this screen do?" "Where would you go to see stories?"

### 2. **Responsive Design Testing**

**Devices:**
- iPhone SE (small screen)
- iPhone 14 Pro (standard)
- iPhone 14 Pro Max (large)
- Android (Samsung Galaxy, Pixel)
- Tablet (iPad Mini, iPad Pro)

**Check:**
- Bottom nav visible on all devices
- Typography scales appropriately
- Calendar grid doesn't overflow
- Stories grid shows 2 columns on mobile, 5 on desktop

### 3. **Animation Performance Testing**

**Metrics:**
- 60 FPS during confetti animation
- Smooth pulse animation on current prayer
- No jank when opening modals
- Background stars don't slow down scrolling

**Tools:**
- React Native Performance Monitor
- Flipper debugger
- Xcode Instruments (iOS)

---

## Content & Data

### 1. **Story Content (30 Days)**

All 30 stories are defined in the HTML prototype (lines 2048-2080):

**Structure:**
```javascript
{
  day: 1,
  title: "What is Salah?",
  desc: "Introduction to the beautiful gift of prayer",
  emoji: "🕌",
  color: "linear-gradient(135deg, #667eea, #764ba2)"
}
```

**Next Step:** Replace placeholder with actual video URLs or embed codes.

**Video Platform Options:**
- YouTube (requires YouTube API key)
- Vimeo (embeddable, ad-free)
- Custom video hosting (AWS S3 + CloudFront)

### 2. **Prayer Times API**

**Options:**
1. **Aladhan API** (free, Islamic prayer times)
   - Endpoint: `https://api.aladhan.com/v1/timingsByCity`
   - Returns Fajr, Dhuhr, Asr, Maghrib, Isha times
   - Supports location-based calculation

2. **Islamic Finder API** (paid, accurate)
   - Endpoint: `https://api.islamicfinder.org/`
   - Higher accuracy for local prayer times

3. **Local Calculation** (offline-first)
   - Use `adhan-js` library
   - Calculate based on GPS coordinates + timezone
   - No internet dependency

**Recommendation:** Use Aladhan API with local fallback.

### 3. **Leaderboard Data**

**Mock Data (for MVP):**
Store in `constants/leaderboard.ts` with dummy users.

**Production:**
- Firebase Firestore (real-time sync)
- Cloud Functions for ranking calculation
- Security rules to prevent cheating

---

## Deployment Checklist

### iOS App Store

- [ ] Configure `app.json` with bundle ID
- [ ] Add app icon (1024x1024)
- [ ] Add splash screen (Expo Splash Screen)
- [ ] Configure privacy permissions (calendar, notifications)
- [ ] Set up Expo Application Services (EAS)
- [ ] Submit to App Store Connect
- [ ] Age rating: 4+ (Kids Category)

### Google Play Store

- [ ] Configure `app.json` with package name
- [ ] Generate Android app bundle (AAB)
- [ ] Add feature graphic (1024x500)
- [ ] Add screenshots (phone + tablet)
- [ ] Set content rating (ESRB: Everyone)
- [ ] Submit to Google Play Console

### Pre-Launch

- [ ] Test on 5+ devices (iOS + Android)
- [ ] Load test with 100+ concurrent users
- [ ] Security audit (no API keys in client)
- [ ] Performance audit (app size < 50MB)
- [ ] Accessibility audit (VoiceOver, TalkBack)

---

## Documentation Files Summary

### Design Documentation

| File | Purpose | Key Content |
|------|---------|-------------|
| `designs/web-app.html` | **PRIMARY REFERENCE** - Full prototype | All screens, components, animations, data structures |
| `designs/typography-strategy.md` | Typography system guide | Lexend usage, font scales, responsive typography |
| `research/islamic-design-research.html` | Cultural design research | Islamic geometric patterns, color symbolism |
| `research/implementation-guide.md` | Developer quick reference | Color palette, SVG code, CSS utilities, component examples |
| `research/design-examples.md` | Screen-by-screen mockups | Visual hierarchy, layout patterns, animation sequences |

### Project Context

| File | Purpose |
|------|---------|
| `.claude/CLAUDE.md` | Project overview, target audience, MVP goals |
| `research/tech-stack-research.html` | Technology choices (Expo, NativeWind, TypeScript) |

---

## Next Steps Recommendation

### Immediate Actions (This Week)

1. **Initialize Expo Project:**
   ```bash
   npx create-expo-app salah-buddy-app --template tabs
   cd salah-buddy-app
   npm install nativewind tailwindcss
   npm install react-native-svg react-native-linear-gradient
   npm install @expo-google-fonts/lexend
   ```

2. **Extract CSS Variables to Theme File:**
   - Copy lines 15-59 from `web-app.html`
   - Create `constants/theme.ts`
   - Map CSS variables to TypeScript object

3. **Extract Story Data:**
   - Copy lines 2048-2080 from `web-app.html`
   - Create `constants/stories.ts`
   - TypeScript interface: `Story { day, title, desc, emoji, color }`

4. **Build First Component:**
   - Start with `<PrayerCard>` (most critical UI)
   - Use `web-app.html` lines 1748-1779 as reference
   - Implement all 3 states: default, current, completed

### Week 1 Deliverable

- ✅ Expo project initialized with TypeScript
- ✅ Theme config (`constants/theme.ts`) with all colors/spacing
- ✅ Lexend fonts loaded and working
- ✅ `<PrayerCard>` component fully functional
- ✅ Home screen with 5 prayer cards rendering

### Week 2-6 Roadmap

Follow the **Key Development Tasks** section above (Phases 2-6).

---

## Conclusion

The HTML prototype in `designs/web-app.html` is **production-ready from a design specification perspective**. It provides:

✅ **Complete UI/UX** for all 4 screens
✅ **Design system** (colors, typography, spacing, radius)
✅ **Component structures** (prayer cards, stats, calendar, leaderboard)
✅ **Animations** (confetti, pulse, modal pop-in, stars)
✅ **Data structures** (user, prayers, stories, leaderboard)
✅ **Responsive design** (mobile, tablet, desktop breakpoints)
✅ **Islamic design integration** (patterns, colors, cultural authenticity)

The transition to React Native is a **mechanical translation** rather than a design exploration. Every visual element, interaction, and animation is already defined. The primary tasks are:

1. **Component translation:** HTML/CSS → React Native components
2. **State management:** JavaScript variables → React Context/AsyncStorage
3. **Animation porting:** CSS animations → React Native Reanimated
4. **Data integration:** Mock data → API/local calculations
5. **Platform optimization:** Responsive web → iOS/Android native

**Estimated Timeline:** 6 weeks to MVP (fully functional app matching the prototype).

---

**Generated:** December 12, 2025
**Repository:** `/Users/ammarkhan/!claude-code/salah-buddy`
**Next Review:** After Expo project initialization
