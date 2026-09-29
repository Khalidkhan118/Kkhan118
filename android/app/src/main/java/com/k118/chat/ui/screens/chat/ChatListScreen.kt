package com.k118.chat.ui.screens.chat

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
import androidx.compose.ui.text.style.TextOverflow
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
    var searchQuery by remember { mutableStateOf("") }

    val filteredFriends = remember(uiState.friends, searchQuery) {
        if (searchQuery.isBlank()) uiState.friends
        else uiState.friends.filter {
            it.displayName.contains(searchQuery, ignoreCase = true) ||
            it.email.contains(searchQuery, ignoreCase = true)
        }
    }

    val onlineFriends = remember(uiState.friends) {
        uiState.friends.filter { it.isOnline }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(K118PurplePrimary),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("K", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "K118",
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp,
                            color = Color.White
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onProfileClicked) {
                        Box {
                            if (currentUser.photoURL.isNotBlank()) {
                                AsyncImage(
                                    model = currentUser.photoURL,
                                    contentDescription = "My Profile",
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(CircleShape)
                                )
                            } else {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(CircleShape)
                                        .background(K118PurpleDark),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Person,
                                        contentDescription = null,
                                        tint = Color.White,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                            // Online indicator on user profile
                            Box(
                                modifier = Modifier
                                    .size(10.dp)
                                    .clip(CircleShape)
                                    .background(K118OnlineGreen)
                                    .align(Alignment.BottomEnd)
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = K118DarkBackground
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onNewChatClicked,
                containerColor = K118PurplePrimary,
                contentColor = Color.White,
                shape = CircleShape
            ) {
                Icon(imageVector = Icons.Default.AddComment, contentDescription = "New Chat")
            }
        },
        containerColor = K118DarkBackground,
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Search Input
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search friends or messages...", color = K118TextMuted, fontSize = 14.sp) },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Search, contentDescription = "Search", tint = K118TextSecondary)
                },
                singleLine = true,
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = K118PurplePrimary,
                    unfocusedBorderColor = K118DarkBorder,
                    focusedContainerColor = K118DarkSurface,
                    unfocusedContainerColor = K118DarkSurface,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Online Friends Horizontal Tray
            if (onlineFriends.isNotEmpty()) {
                Text(
                    text = "ONLINE NOW (${onlineFriends.size})",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = K118OnlineGreen,
                    letterSpacing = 1.sp,
                    modifier = Modifier.padding(start = 16.dp, top = 8.dp, bottom = 8.dp)
                )

                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(14.dp),
                    modifier = Modifier.padding(bottom = 12.dp)
                ) {
                    items(onlineFriends) { friend ->
                        OnlineFriendAvatar(friend = friend, onClick = { onFriendClicked(friend) })
                    }
                }
            }

            // Chat Conversations / Friends List
            Text(
                text = "CONVERSATIONS",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = K118TextMuted,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(start = 16.dp, top = 8.dp, bottom = 8.dp)
            )

            if (filteredFriends.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (searchQuery.isBlank()) "No friends found yet.\nInvite or add friends to start chatting!" else "No users match '$searchQuery'",
                        color = K118TextMuted,
                        fontSize = 14.sp,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f)
                ) {
                    items(filteredFriends) { friend ->
                        FriendChatItem(
                            friend = friend,
                            onClick = { onFriendClicked(friend) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun OnlineFriendAvatar(friend: User, onClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clickable(onClick = onClick)
            .width(62.dp)
    ) {
        Box {
            if (friend.photoURL.isNotBlank()) {
                AsyncImage(
                    model = friend.photoURL,
                    contentDescription = friend.displayName,
                    modifier = Modifier
                        .size(54.dp)
                        .clip(CircleShape)
                )
            } else {
                Box(
                    modifier = Modifier
                        .size(54.dp)
                        .clip(CircleShape)
                        .background(K118PurpleDark),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = friend.displayName.take(1).uppercase(),
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                }
            }

            // Green online indicator
            Box(
                modifier = Modifier
                    .size(14.dp)
                    .clip(CircleShape)
                    .background(K118OnlineGreen)
                    .align(Alignment.BottomEnd)
            )
        }

        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = friend.displayName.split(" ").firstOrNull() ?: friend.displayName,
            fontSize = 12.sp,
            color = K118TextPrimary,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
fun FriendChatItem(friend: User, onClick: () -> Unit) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        Box {
            if (friend.photoURL.isNotBlank()) {
                AsyncImage(
                    model = friend.photoURL,
                    contentDescription = friend.displayName,
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                )
            } else {
                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(K118PurpleDark),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = friend.displayName.take(1).uppercase(),
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp
                    )
                }
            }

            // Live status dot
            Box(
                modifier = Modifier
                    .size(12.dp)
                    .clip(CircleShape)
                    .background(if (friend.isOnline) K118OnlineGreen else K118OfflineGray)
                    .align(Alignment.BottomEnd)
            )
        }

        Spacer(modifier = Modifier.width(14.dp))

        Column(modifier = Modifier.weight(1f)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = friend.displayName,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 16.sp,
                    color = Color.White,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = if (friend.isOnline) "Active" else "Offline",
                    fontSize = 12.sp,
                    color = if (friend.isOnline) K118OnlineGreen else K118TextMuted
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = friend.bio,
                fontSize = 14.sp,
                color = K118TextSecondary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}
