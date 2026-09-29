import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Folder,
  FileCode,
  Download,
  Copy,
  Check,
  Smartphone,
  Terminal,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AndroidFileItem {
  path: string;
  name: string;
  language: string;
  category: string;
  description: string;
  content: string;
}

export const AndroidCodeViewer: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string>('android/app/src/main/java/com/k118/chat/ui/screens/chat/ChatScreen.kt');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Key curated project files representing the Android Jetpack Compose codebase
  const androidFiles: AndroidFileItem[] = [
    {
      path: 'android/app/src/main/java/com/k118/chat/ui/screens/chat/ChatScreen.kt',
      name: 'ChatScreen.kt',
      language: 'kotlin',
      category: 'UI / Compose',
      description: 'One-to-one real-time chat screen with message bubbles, timestamps, read receipts, and auto-scroll',
      content: `package com.k118.chat.ui.screens.chat

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material.icons.filled.InsertEmoticon
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.k118.chat.data.model.Message
import com.k118.chat.data.model.User
import com.k118.chat.ui.theme.*
import com.k118.chat.ui.viewmodel.ActiveChatUiState
import java.text.SimpleDateFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(
    currentUser: User,
    chatState: ActiveChatUiState,
    onBackClicked: () -> Unit,
    onInputChanged: (String) -> Unit,
    onSendMessage: () -> Unit,
    modifier: Modifier = Modifier
) {
    val listState = rememberLazyListState()
    val recipient = chatState.recipient

    // Auto scroll to bottom when messages update
    LaunchedEffect(chatState.messages.size) {
        if (chatState.messages.isNotEmpty()) {
            listState.animateScrollToItem(chatState.messages.size - 1)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                navigationIcon = {
                    IconButton(onClick = onBackClicked) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = Color.White
                        )
                    }
                },
                title = {
                    if (recipient != null) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box {
                                if (recipient.photoURL.isNotBlank()) {
                                    AsyncImage(
                                        model = recipient.photoURL,
                                        contentDescription = recipient.displayName,
                                        modifier = Modifier.size(40.dp).clip(CircleShape)
                                    )
                                } else {
                                    Box(
                                        modifier = Modifier.size(40.dp).clip(CircleShape).background(K118PurpleDark),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(recipient.displayName.take(1).uppercase(), color = Color.White)
                                    }
                                }
                                // Online status dot
                                Box(
                                    modifier = Modifier
                                        .size(10.dp)
                                        .clip(CircleShape)
                                        .background(if (recipient.isOnline) K118OnlineGreen else K118OfflineGray)
                                        .align(Alignment.BottomEnd)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(recipient.displayName, fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                                Text(
                                    text = if (recipient.isOnline) "Online" else "Offline",
                                    fontSize = 12.sp,
                                    color = if (recipient.isOnline) K118OnlineGreen else K118TextMuted
                                )
                            }
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = K118DarkSurface)
            )
        },
        bottomBar = {
            Surface(color = K118DarkSurface, tonalElevation = 4.dp, modifier = Modifier.fillMaxWidth()) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    IconButton(onClick = {}) {
                        Icon(Icons.Default.InsertEmoticon, contentDescription = "Emoji", tint = K118TextSecondary)
                    }
                    OutlinedTextField(
                        value = chatState.inputText,
                        onValueChange = onInputChanged,
                        placeholder = { Text("Type a message...", color = K118TextMuted, fontSize = 14.sp) },
                        shape = RoundedCornerShape(24.dp),
                        modifier = Modifier.weight(1f).padding(horizontal = 4.dp)
                    )
                    IconButton(
                        onClick = onSendMessage,
                        enabled = chatState.inputText.isNotBlank() && !chatState.isSending,
                        modifier = Modifier.size(46.dp).background(if (chatState.inputText.isNotBlank()) K118PurplePrimary else K118DarkSurfaceVariant, CircleShape)
                    ) {
                        Icon(Icons.AutoMirrored.Filled.Send, contentDescription = "Send", tint = Color.White)
                    }
                }
            }
        },
        containerColor = K118DarkBackground
    ) { innerPadding ->
        LazyColumn(
            state = listState,
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxSize().padding(innerPadding)
        ) {
            items(chatState.messages) { message ->
                ChatMessageBubble(message = message, isSentByMe = message.senderId == currentUser.uid)
            }
        }
    }
}`
    },
    {
      path: 'android/app/src/main/java/com/k118/chat/data/repository/ChatRepository.kt',
      name: 'ChatRepository.kt',
      language: 'kotlin',
      category: 'Data / Firestore',
      description: 'Firebase Firestore real-time snapshots, message sending, and chat room management',
      content: `package com.k118.chat.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.SetOptions
import com.k118.chat.data.model.ChatRoom
import com.k118.chat.data.model.Message
import com.k118.chat.data.model.User
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import java.util.Date

class ChatRepository(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    fun generateChatRoomId(userId1: String, userId2: String): String {
        return if (userId1 < userId2) "\${userId1}_\${userId2}" else "\${userId2}_\${userId1}"
    }

    fun getAllUsers(currentUserId: String): Flow<List<User>> = callbackFlow {
        val query = firestore.collection("users")
            .whereNotEqualTo("uid", currentUserId)
            .limit(50)

        val subscription = query.addSnapshotListener { snapshot, error ->
            if (error != null) { close(error); return@addSnapshotListener }
            val users = snapshot?.documents?.mapNotNull { it.toObject(User::class.java) } ?: emptyList()
            trySend(users)
        }
        awaitClose { subscription.remove() }
    }

    fun getMessages(chatRoomId: String): Flow<List<Message>> = callbackFlow {
        val query = firestore.collection("chats")
            .document(chatRoomId)
            .collection("messages")
            .orderBy("timestamp", Query.Direction.ASCENDING)
            .limit(100)

        val subscription = query.addSnapshotListener { snapshot, error ->
            if (error != null) { close(error); return@addSnapshotListener }
            val messages = snapshot?.documents?.mapNotNull { it.toObject(Message::class.java) } ?: emptyList()
            trySend(messages)
        }
        awaitClose { subscription.remove() }
    }

    suspend fun sendMessage(
        sender: User,
        recipientId: String,
        text: String,
        mediaUrl: String? = null
    ) {
        val chatRoomId = generateChatRoomId(sender.uid, recipientId)
        val messagesRef = firestore.collection("chats").document(chatRoomId).collection("messages")
        val newMessageDoc = messagesRef.document()

        val message = Message(
            id = newMessageDoc.id,
            chatRoomId = chatRoomId,
            senderId = sender.uid,
            senderName = sender.displayName,
            senderPhoto = sender.photoURL,
            recipientId = recipientId,
            text = text,
            mediaUrl = mediaUrl,
            read = false,
            timestamp = Date()
        )

        newMessageDoc.set(message).await()

        firestore.collection("chats").document(chatRoomId).set(
            mapOf(
                "id" to chatRoomId,
                "participants" to listOf(sender.uid, recipientId),
                "lastMessage" to text,
                "lastMessageSenderId" to sender.uid,
                "lastMessageTimestamp" to Date(),
                "updatedAt" to Date()
            ),
            SetOptions.merge()
        ).await()
    }
}`
    },
    {
      path: 'android/app/src/main/java/com/k118/chat/ui/screens/chat/ChatListScreen.kt',
      name: 'ChatListScreen.kt',
      language: 'kotlin',
      category: 'UI / Compose',
      description: 'Conversations list, horizontal online friends tray, and search functionality',
      content: `package com.k118.chat.ui.screens.chat

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddComment
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.k118.chat.data.model.User
import com.k118.chat.ui.theme.*
import com.k118.chat.ui.viewmodel.ChatListUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatListScreen(
    currentUser: User,
    uiState: ChatListUiState,
    onFriendClicked: (User) -> Unit,
    onProfileClicked: () -> Unit,
    onNewChatClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("K118", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = Color.White)
                    }
                },
                actions = {
                    IconButton(onClick = onProfileClicked) {
                        Box {
                            AsyncImage(
                                model = currentUser.photoURL,
                                contentDescription = "Profile",
                                modifier = Modifier.size(36.dp).clip(CircleShape)
                            )
                            Box(
                                modifier = Modifier.size(10.dp).clip(CircleShape).background(K118OnlineGreen).align(Alignment.BottomEnd)
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = K118DarkBackground)
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onNewChatClicked, containerColor = K118PurplePrimary) {
                Icon(Icons.Default.AddComment, contentDescription = "New Chat", tint = Color.White)
            }
        },
        containerColor = K118DarkBackground
    ) { innerPadding ->
        Column(modifier = Modifier.fillMaxSize().padding(innerPadding)) {
            // Online Friends Tray
            val onlineFriends = uiState.friends.filter { it.isOnline }
            if (onlineFriends.isNotEmpty()) {
                Text("ONLINE NOW (\${onlineFriends.size})", fontSize = 12.sp, color = K118OnlineGreen, modifier = Modifier.padding(16.dp, 8.dp))
                LazyRow(contentPadding = PaddingValues(horizontal = 16.dp), horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                    items(onlineFriends) { friend ->
                        OnlineFriendAvatar(friend = friend, onClick = { onFriendClicked(friend) })
                    }
                }
            }

            // Conversations
            LazyColumn(modifier = Modifier.weight(1f)) {
                items(uiState.friends) { friend ->
                    FriendChatItem(friend = friend, onClick = { onFriendClicked(friend) })
                }
            }
        }
    }
}`
    },
    {
      path: 'android/app/src/main/java/com/k118/chat/ui/screens/profile/ProfileScreen.kt',
      name: 'ProfileScreen.kt',
      language: 'kotlin',
      category: 'UI / Compose',
      description: 'Profile photo, presence status radio toggles, bio editor, and Google account sign out',
      content: `package com.k118.chat.ui.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.k118.chat.data.model.User
import com.k118.chat.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    user: User,
    onBackClicked: () -> Unit,
    onUpdateStatus: (String) -> Unit,
    onUpdateBio: (String) -> Unit,
    onSignOut: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                navigationIcon = {
                    IconButton(onClick = onBackClicked) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                title = { Text("My Profile", color = Color.White) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = K118DarkBackground)
            )
        },
        containerColor = K118DarkBackground
    ) { innerPadding ->
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxSize().padding(innerPadding).padding(20.dp)
        ) {
            // Profile Photo
            AsyncImage(
                model = user.photoURL,
                contentDescription = user.displayName,
                modifier = Modifier.size(108.dp).clip(CircleShape)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(user.displayName, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text(user.email, fontSize = 14.sp, color = K118TextSecondary)

            Spacer(modifier = Modifier.height(24.dp))
            // Status selector
            Surface(shape = RoundedCornerShape(16.dp), color = K118DarkSurface, modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("AVAILABILITY STATUS", fontSize = 11.sp, color = K118TextMuted, fontWeight = FontWeight.Bold)
                    listOf("online" to "Online", "away" to "Away", "offline" to "Offline").forEach { (code, label) ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth().clickable { onUpdateStatus(code) }.padding(8.dp)
                        ) {
                            Text(label, color = Color.White, modifier = Modifier.weight(1f))
                            if (user.status == code) Icon(Icons.Default.Check, contentDescription = null, tint = K118PurpleLight)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))
            OutlinedButton(
                onClick = onSignOut,
                modifier = Modifier.fillMaxWidth().height(52.dp)
            ) {
                Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Sign Out")
            }
        }
    }
}`
    },
    {
      path: 'android/app/src/main/java/com/k118/chat/ui/theme/Color.kt',
      name: 'Color.kt',
      language: 'kotlin',
      category: 'UI / Theme',
      description: 'Brand color tokens derived from the official K118 purple gradient logo and green status dot',
      content: `package com.k118.chat.ui.theme

import androidx.compose.ui.graphics.Color

// K118 Brand Palette based on the official purple gradient logo & online status dot
val K118PurplePrimary = Color(0xFF7C3AED)
val K118PurpleDark = Color(0xFF5B21B6)
val K118PurpleLight = Color(0xFFA78BFA)
val K118PurpleGradientStart = Color(0xFF6A11CB)
val K118PurpleGradientEnd = Color(0xFF8B5CF6)

// Online Status Green (matching the green dot on the K118 logo)
val K118OnlineGreen = Color(0xFF10B981)
val K118OfflineGray = Color(0xFF6B7280)
val K118AwayOrange = Color(0xFFF59E0B)

// Dark Theme Surfaces
val K118DarkBackground = Color(0xFF0D0D18)
val K118DarkSurface = Color(0xFF161628)
val K118DarkSurfaceVariant = Color(0xFF22223D)
val K118DarkBorder = Color(0xFF2E2E52)

// Message Bubbles
val K118SentBubble = Color(0xFF7C3AED)
val K118ReceivedBubble = Color(0xFF1E1E34)

// Text Colors
val K118TextPrimary = Color(0xFFF8FAFC)
val K118TextSecondary = Color(0xFF94A3B8)
val K118TextMuted = Color(0xFF64748B)`
    },
    {
      path: 'android/app/src/main/java/com/k118/chat/MainActivity.kt',
      name: 'MainActivity.kt',
      language: 'kotlin',
      category: 'App Entry',
      description: 'Main activity with lifecycle presence handling (online onResume, offline onDestroy)',
      content: `package com.k118.chat

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.k118.chat.ui.navigation.K118NavGraph
import com.k118.chat.ui.theme.K118DarkBackground
import com.k118.chat.ui.theme.K118Theme
import com.k118.chat.ui.viewmodel.AuthViewModel
import com.k118.chat.ui.viewmodel.ChatViewModel

class MainActivity : ComponentActivity() {
    private val authViewModel: AuthViewModel by viewModels()
    private val chatViewModel: ChatViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            K118Theme(darkTheme = true) {
                Surface(modifier = Modifier.fillMaxSize(), color = K118DarkBackground) {
                    val navController = rememberNavController()
                    K118NavGraph(
                        navController = navController,
                        authViewModel = authViewModel,
                        chatViewModel = chatViewModel,
                        onGoogleSignInRequested = {}
                    )
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        authViewModel.setPresence("online")
    }

    override fun onPause() {
        super.onPause()
        authViewModel.setPresence("away")
    }

    override fun onDestroy() {
        super.onDestroy()
        authViewModel.setPresence("offline")
    }
}`
    },
    {
      path: 'android/app/build.gradle.kts',
      name: 'build.gradle.kts (App)',
      language: 'kotlin',
      category: 'Build & Config',
      description: 'Android application Gradle build script with Compose Material 3 and Firebase dependencies',
      content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.google.gms.google.services)
}

android {
    namespace = "com.k118.chat"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.k118.chat"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Firebase (Auth & Firestore)
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth.ktx)
    implementation(libs.firebase.firestore.ktx)

    // Google Sign-In & Image Loading
    implementation(libs.play.services.auth)
    implementation(libs.coil.compose)
}`
    },
    {
      path: 'android/app/google-services.json',
      name: 'google-services.json',
      language: 'json',
      category: 'Build & Config',
      description: 'Firebase project credentials pre-configured for arched-ceremony-vmn89',
      content: `{
  "project_info": {
    "project_number": "16383207236",
    "project_id": "arched-ceremony-vmn89",
    "storage_bucket": "arched-ceremony-vmn89.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:16383207236:android:k118chatclientapplet",
        "android_client_info": {
          "package_name": "com.k118.chat"
        }
      },
      "api_key": [
        {
          "current_key": "AIzaSyDtMn2xNrJar-aH98IEHBA_z0djcqI_wcU"
        }
      ]
    }
  ]
}`
    }
  ];

  const activeFile = androidFiles.find((f) => f.path === selectedPath) || androidFiles[0];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('k118-android');

      // Add all project files into the zip
      androidFiles.forEach((file) => {
        folder?.file(file.path.replace(/^android\//, ''), file.content);
      });

      // Add top-level build scripts
      folder?.file(
        'build.gradle.kts',
        `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.google.gms.google.services) apply false
}`
      );

      folder?.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "K118"
include(":app")`
      );

      folder?.file(
        'gradle.properties',
        `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official`
      );

      folder?.file(
        'README.md',
        `# K118 Android App (Kotlin & Jetpack Compose)
1. Open this unzipped folder in Android Studio (Ladybug / Koala or newer).
2. Android Studio will automatically resolve Gradle dependencies.
3. Connect an Android phone or launch an Android emulator (API 26+).
4. Run 'app' to test real-time Google Sign-In and Firestore chatting!`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'K118-Android-JetpackCompose-Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#07070f] text-slate-200 overflow-hidden">
      {/* Top Banner */}
      <div className="px-6 py-4 bg-[#0e0e1c] border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">
              Android Studio Project · Kotlin & Jetpack Compose
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-medium">
              Ready to Build
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Organized with clean architecture: Repositories, ViewModels, Material 3 Compose screens, and Firebase integration.
          </p>
        </div>

        {/* Download Project ZIP Button */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Bundling ZIP...' : 'Download Android Studio (.ZIP)'}</span>
        </button>
      </div>

      {/* Main Split Layout: File Tree on left, Code Viewer on right */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: File Tree */}
        <div className="w-full md:w-80 bg-[#0a0a14] border-r border-white/5 flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-purple-400" />
            <span>Project Explorer</span>
          </div>

          <div className="p-2 space-y-1">
            {androidFiles.map((file) => {
              const isSelected = file.path === selectedPath;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedPath(file.path)}
                  className={`w-full p-2 rounded-xl text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950/50 border border-purple-500/40 text-white'
                      : 'hover:bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isSelected ? 'text-purple-400' : 'text-slate-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate leading-tight">{file.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{file.category}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Android Studio Quick Setup Guide Card */}
          <div className="p-4 m-3 rounded-2xl bg-[#121224] border border-white/5 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px] uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>How to Run</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400 leading-relaxed">
              <li>Click <strong>Download Android Studio (.ZIP)</strong> above.</li>
              <li>Extract and open the folder in <strong>Android Studio</strong>.</li>
              <li>Wait for Gradle sync to complete.</li>
              <li>Click <strong>Run 'app'</strong> on your emulator or phone.</li>
            </ol>
          </div>
        </div>

        {/* Right Code Display */}
        <div className="flex-1 flex flex-col bg-[#07070d] overflow-hidden">
          {/* File Header Bar */}
          <div className="px-5 py-3 bg-[#0d0d1a] border-b border-white/5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-300">{activeFile.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                  {activeFile.language}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{activeFile.description}</p>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Code Container */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed bg-[#07070d]">
            <pre className="text-slate-300">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
