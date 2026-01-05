# Murmur App

A modern social media mobile application built with React Native and Expo, featuring a Twitter-like microblogging experience. Create short posts called "murmurs", follow users, like posts, and receive real-time notifications.

## 🚀 Features

### Core Features
- **Authentication**: Secure user registration and login with JWT tokens
- **Timeline**: Real-time feed of murmurs from users you follow
- **Create Murmurs**: Post short messages (up to 280 characters)
- **Reply System**: Threaded conversations and replies to murmurs
- **Like/Unlike**: Show appreciation for murmur posts
- **Follow/Unfollow**: Connect with other users
- **User Profiles**: View and edit your profile, including avatar, bio, and stats
- **Search Users**: Find and connect with people by username or display name
- **Notifications**: Real-time notifications for likes, follows, and replies
- **User Profiles**: View other users' profiles, their murmurs, and follower counts

### Technical Features
- **State Management**: Redux Toolkit for efficient state management
- **Data Persistence**: Redux Persist for offline capability
- **Navigation**: Expo Router for file-based routing
- **API Integration**: Axios for REST API communication
- **TypeScript**: Full type safety across the application
- **Responsive Design**: Works on iOS, Android, and Web
- **Auto-refresh**: Pull-to-refresh on timeline and notifications

## 📋 Tech Stack

### Frontend Framework
- **React Native**: Mobile framework for iOS and Android
- **Expo SDK 54**: Development platform for React Native
- **TypeScript**: Type-safe JavaScript

### Navigation
- **Expo Router**: File-based routing system
- **React Navigation**: Declarative navigation

### State Management
- **Redux Toolkit**: Modern state management
- **Redux Persist**: Persist Redux store to AsyncStorage
- **@react-native-async-storage/async-storage**: Local storage

### UI & Styling
- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Touch gestures
- **Expo Vector Icons**: Icon library
- **NativeWind**: Utility-first styling (Tailwind CSS for React Native)

### API & Networking
- **Axios**: HTTP client for API requests
- **@react-native-community/netinfo**: Network connectivity detection

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### For iOS Development (Mac only)
- **Xcode** (latest version)
- **CocoaPods** (`sudo gem install cocoapods`)

### For Android Development
- **Android Studio** with Android SDK
- **Java Development Kit (JDK) 11 or higher**

### For Physical Device Testing
- **Expo Go** app (available on App Store and Google Play)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mohammed-ahsan/MurmurApp.git
cd MurmurApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Backend

This app requires the Murmur Backend API to be running. Follow the setup instructions here:
[MurmurApp-Backend](https://github.com/mohammed-ahsan/MurmurApp-Backend)

Make sure the backend is running on `http://localhost:3000`

### 4. Configure API URL

The API base URL is configured in `src/services/api.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'  // Android emulator
  : 'http://10.0.2.2:3000/api';
```

**Note**: 
- For Android emulator: Use `10.0.2.2` (special alias to host machine)
- For iOS simulator: Use `localhost` or `127.0.0.1`
- For physical device: Use your computer's local IP address (e.g., `192.168.1.100`)

## 🏃 Running the Application

### Option 1: Using Expo Go (Recommended for Testing)

1. Start the development server:
   ```bash
   npm start
   ```

2. Scan the QR code with the **Expo Go** app on your mobile device
   - Download Expo Go from [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

3. The app will load on your device

### Option 2: iOS Simulator (Mac only)

```bash
npm run ios
```

This will launch the iOS Simulator with the app.

### Option 3: Android Emulator

```bash
npm run android
```

This will build and run the app on the Android emulator.

### Option 4: Web Browser

```bash
npm run web
```

This will open the app in your default web browser.

## 📱 App Structure

```
MurmurApp/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication group
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/                   # Main tabs group
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Timeline (Home)
│   │   ├── search.tsx            # Search users
│   │   ├── notifications.tsx     # Notifications
│   │   └── profile.tsx           # User profile
│   ├── murmur/
│   │   └── [id].tsx              # Murmur detail page
│   ├── user/
│   │   └── [id].tsx              # User profile page
│   ├── _layout.tsx               # Root layout
│   └── modal.tsx                 # Modal screens
├── src/
│   ├── components/               # Reusable components
│   │   ├── common/              # Common UI components
│   │   ├── murmur/              # Murmur-related components
│   │   └── navigation/          # Navigation components
│   ├── screens/                 # Screen components
│   │   ├── auth/               # Authentication screens
│   │   ├── murmur/             # Murmur screens
│   │   ├── notifications/      # Notification screens
│   │   ├── profile/            # Profile screens
│   │   ├── search/             # Search screens
│   │   ├── timeline/           # Timeline screen
│   │   └── user/               # User profile screen
│   ├── services/               # API services
│   │   └── api.ts             # Axios API client
│   ├── store/                 # Redux store
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── slices/            # Redux slices
│   │       ├── authSlice.ts
│   │       ├── murmursSlice.ts
│   │       ├── notificationsSlice.ts
│   │       ├── usersSlice.ts
│   │       └── uiSlice.ts
│   └── types/                # TypeScript type definitions
│       └── index.ts
├── assets/                   # Static assets
│   ├── fonts/
│   └── images/
├── app.json                  # Expo app configuration
├── package.json
└── tsconfig.json
```

## 📚 Key Components & Screens

### Authentication
- **Login Screen**: User login with email/username and password
- **Register Screen**: New user registration with validation

### Main Tabs
- **Timeline**: Feed of murmurs from followed users with pull-to-refresh
- **Search**: Search users by username or display name
- **Notifications**: List of notifications with unread indicators
- **Profile**: User's own profile with stats and settings

### Features
- **Create Murmur**: Post new murmurs with character limit (280)
- **Murmur Detail**: View murmur with replies
- **Like System**: Like/unlike murmurs with real-time updates
- **Follow System**: Follow/unfollow users
- **User Profile**: View user's murmurs, followers, and following

## 🔐 Authentication Flow

1. User registers/logs in via API
2. JWT token is stored in AsyncStorage
3. Token is automatically included in all API requests via Axios interceptors
4. Redux manages user authentication state
5. On 401 errors, token is cleared and user is logged out

## 🌐 API Integration

The app uses a centralized API client (`src/services/api.ts`) with:

- **Axios Instance**: Pre-configured with base URL and timeout
- **Request Interceptor**: Automatically adds JWT token to headers
- **Response Interceptor**: Handles errors and automatic logout on 401
- **API Modules**: Organized by feature (auth, murmurs, users, notifications)

## 📱 Screenshots/Demo

Check out the live demo: [YouTube Demo](https://youtube.com/shorts/TfPk1MvzgJg?feature=share)

## 🛠️ Available Scripts

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

## 🔧 Configuration

### Environment Variables

While not strictly required, you can create a `.env` file in the root:

```env
# API Configuration
API_BASE_URL=http://10.0.2.2:3000/api

# (Optional) Other configuration
```

### Expo Configuration

App configuration is in `app.json`:
- App name and display name
- Bundle identifiers
- Version information
- Icon and splash screen
- Platform-specific settings

## 🐛 Troubleshooting

### Common Issues

#### API Connection Issues
- Make sure the backend server is running on `http://localhost:3000`
- Check the API URL in `src/services/api.ts`
- For physical devices, use your computer's local IP address instead of `10.0.2.2`

#### Metro Bundler Issues
```bash
# Clear cache
npm start -- --clear

# Reset cache completely
npx expo start -c
```

#### iOS Build Issues
```bash
# Reinstall pods
cd ios && pod install && cd ..

# Clean build folder in Xcode
# Product > Clean Build Folder
```

#### Android Build Issues
```bash
# Clean Gradle
cd android && ./gradlew clean && cd ..

# Rebuild
npm run android
```

#### Redux Persist Issues
```bash
# Clear AsyncStorage (in app)
# Use DevTools or reinstall app
```

## 📝 Development Tips

1. **Use Expo DevTools**: Access DevTools at `http://localhost:19002` for debugging
2. **React Native Debugger**: Use React Native Debugger for Redux DevTools
3. **Hot Reloading**: The app supports hot reloading during development
4. **Type Safety**: Leverage TypeScript for catching errors early
5. **Console Logging**: API calls are logged in development mode

## 🔗 Related Repositories

- **Backend API**: [MurmurApp-Backend](https://github.com/mohammed-ahsan/MurmurApp-Backend)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Author

**Mohammed Ahsan**
- GitHub: [@mohammed-ahsan](https://github.com/mohammed-ahsan)

## 🌐 Demo

Watch the live demo: [YouTube Short](https://youtube.com/shorts/TfPk1MvzgJg?feature=share)

## 🙏 Acknowledgments

- **Expo Team** - For the amazing Expo SDK
- **React Native Community** - For excellent libraries and tools
- **Redux Toolkit Team** - For modern state management

---

Made with ❤️ by Mohammed Ahsan
