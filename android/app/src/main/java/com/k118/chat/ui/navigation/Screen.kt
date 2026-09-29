package com.k118.chat.ui.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Login : Screen("login")
    object ChatList : Screen("chat_list")
    object Friends : Screen("friends")
    object Profile : Screen("profile")
    object ChatDetail : Screen("chat_detail/{chatRoomId}/{friendId}") {
        fun createRoute(chatRoomId: String, friendId: String) = "chat_detail/$chatRoomId/$friendId"
    }
}
