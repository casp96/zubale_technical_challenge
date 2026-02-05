# Zubale Marketplace - Technical Challenge 🛒✨

An exclusive, high-performance marketplace application built with **React Native** and **Expo**. This project features a fluid Pinterest-style masonry layout, advanced scroll animations, and a robust state management system.

## 🚀 Main Features

- **Pinterest-Style Masonry Layout**: Custom-built virtualized masonry grid with optimized image loading.
- **Dynamic Animated Header**: Smoothly collapsing header using GPU-accelerated transforms (`react-native-reanimated`).
- **High-Fidelity Cart System**: Support for multiple items, quantity grouping, and persistence.
- **User Authentication (Mock)**: Persistent login session and profile personalization.
- **Premium Checkout flow**: Custom designed success modal and step-by-step checkout summary.
- **Favorites System**: Save your favorite products with local persistence.
- **Responsive Design**: Fully optimized for different screen sizes and safe areas (notches, home indicators).
- **Dark Theme native**: Sleek dark mode implementation with vibrant primary accents.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 51)
- **Core**: React Native
- **Navigation**: Expo Router (File-based routing)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: Expo Vector Icons (FontAwesome)
- **Images**: Expo Image (Cached & Optimized)
- **Persistence**: AsyncStorage
- **Safe Area**: React Native Safe Area Context

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/expo-go) app on your physical device (iOS/Android) or a configured simulator.

## 🏗️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd zubale_technical_challenge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Run on your device**:
   - Scan the QR code with the **Expo Go** app (Android) or **Camera** app (iOS).
   - Alternatively, press `a` for Android Emulator or `i` for iOS Simulator.

## 📦 Project Structure

```text
├── app/                  # Expo Router directory (screens & layouts)
│   ├── (tabs)/           # Tab navigation screens (Home, Favorites, Profile)
│   ├── _layout.tsx       # Root layout & providers
│   ├── checkout.tsx      # Checkout flow
│   └── detail/[id].tsx   # Dynamic product detail screen
├── components/           # Reusable UI components
│   └── marketplace/      # Core marketplace components (Header, Masonry, Cart)
├── constants/            # Theme, Colors, and global constants
├── store/                # Zustand store & state logic
├── types/                # TypeScript interfaces and types
├── utils/                # Helper functions & persistence logic
└── assets/               # Local images and fonts
```

## ⚙️ Build Process

The project is configured for **EAS Build**. Configuration can be found in `eas.json`.

To trigger a preview build (Android):
```bash
eas build -p android --profile preview
```

## 📄 License

This project was developed for the Zubale Technical Challenge.
