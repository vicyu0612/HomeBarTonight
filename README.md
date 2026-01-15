# HomeBarTonight 🍹

A modern cocktail recipe app built with React, TypeScript, and Capacitor. Discover classic cocktails, create your own bar inventory, and find recipes you can make with what you have.

## Features

- 📚 **Extensive Recipe Library**: Browse classic cocktails and convenience store (CVS) cocktails
- 🏠 **My Bar**: Track your ingredient inventory and discover what you can make
- ⭐ **Favorites**: Save your favorite recipes
- 🌍 **Bilingual**: Full support for English and Traditional Chinese (繁體中文)
- 📱 **Native iOS App**: Built with Capacitor for native performance
- 🔐 **User Accounts**: Sign in with Google or Apple ID
- 💎 **Premium Features**: Unlock exclusive recipes with subscription

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Mobile**: Capacitor 8 (iOS)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Subscriptions**: RevenueCat
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Xcode (for iOS development)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd HomeBarTonight
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_REVENUECAT_API_KEY_IOS=your_revenuecat_key
```

4. Run the development server
```bash
npm run dev
```

### Building for iOS

```bash
npm run build:ios
```

Then open the iOS project in Xcode:
```bash
npx cap open ios
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Subscription, etc.)
├── data/          # Static data (recipes, collections)
├── hooks/         # Custom React hooks
├── pages/         # Main page components
├── utils/         # Utility functions
└── App.tsx        # Main application component
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:ios` - Build and sync with iOS
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

This is a personal project, but suggestions and bug reports are welcome!

## License

All rights reserved.

## Contact

For questions or support, please contact [your-email]
