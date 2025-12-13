# Salah Buddy - Ramadan Platform for Kids

## Project Overview

Salah Buddy is a free Ramadan mobile app for kids featuring:
- User authentication (kids/family accounts with PIN protection)
- Salah (prayer) tracking with gamification
- Ramadan story videos (30 days)
- Personal dashboard with stars and streaks
- Family leaderboard

## Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Backend**: Firebase (Auth, Firestore)
- **State**: Zustand with MMKV persistence
- **Validation**: Zod
- **Navigation**: Expo Router (file-based)

## Current Status

**Branch**: `fix/code-review-issues`
**Last Commit**: `ec6680e` - fix: Address code review issues

### Completed Work (Dec 2024)

All code review issues have been addressed:

#### Security
- [x] Firestore security rules (`firestore.rules`)
- [x] PIN hashing with SHA-256 (`src/utils/crypto.ts`)
- [x] Firebase config in environment variables
- [x] Rate limiting for PIN attempts (`src/utils/rateLimiter.ts`)

#### Data Integrity
- [x] Firestore transactions for atomic prayer/stats updates
- [x] Rollback logic for failed optimistic updates
- [x] Duplicate streak bonus prevention

#### Performance
- [x] Memory leak fix in auth subscription
- [x] React.memo on animation components

#### Code Quality
- [x] Zod validation schemas (`src/utils/validation.ts`)
- [x] Centralized date helpers (`src/utils/date.ts`)
- [x] Dead code removal

### Next Steps

1. **Merge to main** - Review and merge `fix/code-review-issues` branch
2. **Deploy Firestore rules** - Run `firebase deploy --only firestore:rules`
3. **Create .env file** - Copy `.env.example` and add real Firebase credentials
4. **Test on device** - Verify all fixes work in Expo Go
5. **Consider adding**:
   - Unit tests for crypto/validation utilities
   - E2E tests for prayer tracking flow
   - Error boundary components

## Key Files

- `firestore.rules` - Firestore security rules
- `app/.env.example` - Environment variable template
- `app/src/utils/` - Crypto, date, validation, rate limiting utilities
- `app/src/services/auth.ts` - Auth with PIN hashing
- `app/src/services/firestore.ts` - Firestore with transactions
- `app/src/store/useStore.ts` - State with rollback logic
- `app/src/store/useAuthStore.ts` - Auth state with cleanup

## Research

Technical stack research is in `/research/tech-stack-research.html`
