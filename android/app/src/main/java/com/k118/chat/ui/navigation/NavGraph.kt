package com.k118.chat.ui.navigation

import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.k118.chat.data.model.User
import com.k118.chat.ui.screens.auth.LoginScreen
import com.k118.chat.ui.screens.chat.ChatListScreen
import com.k118.chat.ui.screens.chat.ChatScreen
import com.k118.chat.ui.screens.friends.FriendsScreen
import com.k118.chat.ui.screens.profile.ProfileScreen
import com.k118.chat.ui.viewmodel.*

@Composable
fun K118NavGraph(
    navController: NavHostController,
    authViewModel: AuthViewModel,
    chatViewModel: ChatViewModel,
    onGoogleSignInRequested: () -> Unit
) {
    val authState by authViewModel.uiState.collectAsState()
    val listState by chatViewModel.listState.collectAsState()
    val activeChatState by chatViewModel.activeChatState.collectAsState()

    val currentUser = (authState as? AuthUiState.Authenticated)?.profile

    val startDestination = if (authState is AuthUiState.Authenticated) {
        Screen.ChatList.route
    } else {
        Screen.Login.route
    }

    LaunchedEffect(currentUser?.uid) {
        currentUser?.uid?.let { uid ->
            chatViewModel.loadData(uid)
        }
    }

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onGoogleSignInClicked = onGoogleSignInRequested
            )
        }

        composable(Screen.ChatList.route) {
            if (currentUser != null) {
                ChatListScreen(
                    currentUser = currentUser,
                    uiState = listState,
                    onFriendClicked = { friend ->
                        chatViewModel.openChat(currentUser, friend)
                        navController.navigate(Screen.ChatDetail.createRoute("chat", friend.uid))
                    },
                    onProfileClicked = {
                        navController.navigate(Screen.Profile.route)
                    },
                    onNewChatClicked = {
                        navController.navigate(Screen.Friends.route)
                    }
                )
            }
        }

        composable(Screen.ChatDetail.route) {
            if (currentUser != null) {
                ChatScreen(
                    currentUser = currentUser,
                    chatState = activeChatState,
                    onBackClicked = { navController.popBackStack() },
                    onInputChanged = { chatViewModel.updateInputText(it) },
                    onSendMessage = { chatViewModel.sendMessage(currentUser) }
                )
            }
        }

        composable(Screen.Friends.route) {
            FriendsScreen(
                friends = listState.friends,
                onFriendSelected = { friend ->
                    if (currentUser != null) {
                        chatViewModel.openChat(currentUser, friend)
                        navController.navigate(Screen.ChatDetail.createRoute("chat", friend.uid)) {
                            popUpTo(Screen.Friends.route) { inclusive = true }
                        }
                    }
                },
                onBackClicked = { navController.popBackStack() }
            )
        }

        composable(Screen.Profile.route) {
            if (currentUser != null) {
                ProfileScreen(
                    user = currentUser,
                    onBackClicked = { navController.popBackStack() },
                    onUpdateStatus = { authViewModel.setPresence(it) },
                    onUpdateBio = { /* update in repo */ },
                    onSignOut = {
                        authViewModel.signOut()
                        navController.navigate(Screen.Login.route) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}
