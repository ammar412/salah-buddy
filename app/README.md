# Salah Buddy - React Native App

A Ramadan prayer tracking app for kids (ages 7-10), built with Expo and React Native.

## Features

- **Home Screen**: Track daily prayers with visual progress ring
- **Daily Stories**: 30 days of Ramadan story videos with progressive unlock
- **My Progress**: Calendar view showing prayer and story completion
- **Leaderboard**: Compete with friends and family

## Tech Stack

- **Framework**: Expo SDK 54 + React Native
- **Navigation**: Expo Router (file-based)
- **State Management**: Zustand with MMKV persistence
- **Prayer Times**: adhan.js for offline calculation
- **Styling**: Lexend font, Luqmay brand colors

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
app/
├── src/
│   ├── app/                 # Expo Router screens
│   │   ├── (tabs)/          # Tab navigation
│   │   │   ├── index.tsx    # Home screen
│   │   │   ├── stories.tsx  # Daily Stories
│   │   │   ├── progress.tsx # My Progress
│   │   │   └── leaderboard.tsx
│   │   └── _layout.tsx      # Root layout
│   ├── components/          # Reusable components
│   │   ├── home/
│   │   ├── stories/
│   │   ├── progress/
│   │   └── leaderboard/
│   ├── constants/           # Design tokens
│   │   ├── colors.ts
│   │   └── theme.ts
│   ├── services/            # Business logic
│   │   └── prayerTimes.ts
│   ├── store/               # State management
│   │   ├── storage.ts
│   │   └── useStore.ts
│   └── types/               # TypeScript types
├── assets/                  # Images, fonts
├── app.json                 # Expo config
└── package.json
```

## Design System

### Colors (Luqmay Brand)
- **Cream**: `#F5F0E8` - Background
- **Gold**: `#F5B526` - Primary accent
- **Success**: `#4CAF50` - Completed states

### Typography
- **Font**: Lexend (Google Fonts)
- Weights: Regular, Medium, SemiBold, Bold

## License

MIT
