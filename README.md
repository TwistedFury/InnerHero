# InnerHero

InnerHero is a mobile-first wellness app that guides users through small, reflective quests at their own pace. Quests combine short written reflections, mood check-ins, and sliders to support practical self-guided growth.

## Features

- Guided quest chains with prerequisites and repeatable activities
- Text, slider, and mood-based quest steps
- Progress tracking stored locally on the device
- Home dashboard with next-quest and milestone views
- Profile customization and local data deletion
- Android, iOS, and web support through Expo

## Tech stack

- Expo SDK 57
- React Native 0.86
- Expo Router
- TypeScript
- Zustand
- Async Storage
- Lucide React Native

## Getting started

### Prerequisites

- Node.js
- npm
- Expo-compatible development environment

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm start
```

Then use the Expo CLI to open the app in Expo Go or a development build.

## Available scripts

```bash
npm start        # Start Expo
npm run android  # Build and run the Android app
npm run ios      # Build and run the iOS app
npm run web      # Start the web version
npm run lint     # Run ESLint
npx tsc --noEmit # Run the TypeScript checker
```

## Project structure

```text
app/       Expo Router screens and navigators
src/
  components/ Reusable UI components
  data/       Quest and milestone content
  helper/     Quest and application utilities
  storage/    Local Zustand persistence
  styling/    Theme values and fonts
  types/      Shared TypeScript types
assets/    App icons and images
```

## Data and privacy

User profile data and quest progress are stored locally on the device. The profile screen includes an option to delete saved app data.

## Development notes

The app uses Expo Router, so screens live under `app/`. Native Android and iOS behavior should be configured through Expo configuration and supported config plugins where possible.

