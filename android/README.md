# K118 - Android Online Chat Application

A high-performance, real-time one-to-one online chat application for Android, built with **Kotlin**, **Jetpack Compose (Material 3)**, **Firebase Authentication (Google Sign-In)**, and **Cloud Firestore**.

![K118 App](https://img.shields.io/badge/Platform-Android-green)
![Kotlin](https://img.shields.io/badge/Kotlin-2.0.21-purple)
![Compose](https://img.shields.io/badge/Jetpack_Compose-Material_3-blue)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-orange)

---

## Features
- **Google Sign-In**: One-tap secure authentication with Firebase Auth.
- **User Profile**: Custom avatar photo, display name, editable bio, and account details.
- **Online/Offline Status**: Real-time presence detection with glowing indicator (Online, Away, Busy, Offline).
- **Friend List & Discovery**: Instant user search with live status indicators and avatar initials.
- **1-on-1 Real-Time Chat**: Sub-second message delivery via Firestore `onSnapshot` streaming.
- **Message Timestamps & Read Receipts**: Precise message delivery timestamps and double-check read indicators.
- **Modern Jetpack Compose UI**: Custom K118 violet theme based on official brand logo, smooth animations, auto-scrolling message stream, and clean dark mode.

---

## Android Project Structure

```
android/
├── build.gradle.kts                # Top-level Gradle configuration
├── settings.gradle.kts             # Gradle settings & repository management
├── gradle.properties               # JVM & AndroidX memory options
├── gradle/
│   └── libs.versions.toml          # Centralized version catalog
└── app/
    ├── build.gradle.kts            # App module plugins & dependencies
    ├── google-services.json        # Firebase credentials config
    └── src/
        └── main/
            ├── AndroidManifest.xml # App permissions & activity declaration
            └── java/com/k118/chat/
                ├── K118Application.kt          # Firebase initialization
                ├── MainActivity.kt             # Activity & lifecycle presence handler
                ├── data/
                │   ├── model/
                │   │   ├── User.kt             # User profile data class
                │   │   ├── Message.kt          # Chat message data class
                │   │   └── ChatRoom.kt         # 1-to-1 conversation room model
                │   └── repository/
                │       ├── AuthRepository.kt   # Firebase Auth & presence sync
                │       └── ChatRepository.kt   # Firestore chat streams & message write
                └── ui/
                    ├── theme/
                    │   ├── Color.kt            # K118 violet & green palette
                    │   ├── Theme.kt            # Material 3 dark/light schemes
                    │   └── Type.kt             # Typography
                    ├── navigation/
                    │   ├── Screen.kt           # Navigation routes
                    │   └── NavGraph.kt         # Jetpack Navigation host
                    ├── screens/
                    │   ├── auth/LoginScreen.kt # Google sign-in & branding
                    │   ├── chat/ChatListScreen.kt # Conversations & online tray
                    │   ├── chat/ChatScreen.kt  # 1-on-1 real-time chat room
                    │   ├── friends/FriendsScreen.kt # Friend search & add
                    │   └── profile/ProfileScreen.kt # Profile & status selector
                    └── viewmodel/
                        ├── AuthViewModel.kt
                        └── ChatViewModel.kt
```

---

## How to Run in Android Studio

1. Open **Android Studio** (Ladybug / Koala or newer recommended).
2. Select **Open** and choose the `android` folder in this repository.
3. Android Studio will automatically sync the Gradle project using `libs.versions.toml`.
4. Ensure `google-services.json` is located in `android/app/`.
5. Connect an Android device (via USB with USB debugging enabled) or start an Android Virtual Device (AVD) running Android 8.0 (API 26) or higher.
6. Click **Run 'app'** (Shift + F10).
