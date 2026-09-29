package com.k118.chat.ui.screens.chat

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
                                        modifier = Modifier
                                            .size(40.dp)
                                            .clip(CircleShape)
                                    )
                                } else {
                                    Box(
                                        modifier = Modifier
                                            .size(40.dp)
                                            .clip(CircleShape)
                                            .background(K118PurpleDark),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = recipient.displayName.take(1).uppercase(),
                                            color = Color.White,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 16.sp
                                        )
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
                                Text(
                                    text = recipient.displayName,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color.White
                                )
                                Text(
                                    text = if (recipient.isOnline) "Online" else "Offline",
                                    fontSize = 12.sp,
                                    color = if (recipient.isOnline) K118OnlineGreen else K118TextMuted
                                )
                            }
                        }
                    }
                },
                actions = {
                    IconButton(onClick = {}) {
                        Icon(
                            imageVector = Icons.Default.MoreVert,
                            contentDescription = "More Options",
                            tint = Color.White
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = K118DarkSurface
                )
            )
        },
        bottomBar = {
            // Message Input Bar
            Surface(
                color = K118DarkSurface,
                tonalElevation = 4.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    IconButton(onClick = {}) {
                        Icon(
                            imageVector = Icons.Default.InsertEmoticon,
                            contentDescription = "Emoji",
                            tint = K118TextSecondary
                        )
                    }

                    OutlinedTextField(
                        value = chatState.inputText,
                        onValueChange = onInputChanged,
                        placeholder = { Text("Type a message...", color = K118TextMuted, fontSize = 14.sp) },
                        maxLines = 4,
                        shape = RoundedCornerShape(24.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = K118PurplePrimary,
                            unfocusedBorderColor = K118DarkBorder,
                            focusedContainerColor = K118DarkSurfaceVariant,
                            unfocusedContainerColor = K118DarkSurfaceVariant,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 4.dp)
                    )

                    IconButton(
                        onClick = onSendMessage,
                        enabled = chatState.inputText.isNotBlank() && !chatState.isSending,
                        modifier = Modifier
                            .size(46.dp)
                            .background(
                                if (chatState.inputText.isNotBlank()) K118PurplePrimary else K118DarkSurfaceVariant,
                                CircleShape
                            )
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.Send,
                            contentDescription = "Send",
                            tint = if (chatState.inputText.isNotBlank()) Color.White else K118TextMuted,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        },
        containerColor = K118DarkBackground,
        modifier = modifier
    ) { innerPadding ->
        LazyColumn(
            state = listState,
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            items(chatState.messages) { message ->
                val isSentByMe = message.senderId == currentUser.uid
                ChatMessageBubble(
                    message = message,
                    isSentByMe = isSentByMe
                )
            }
        }
    }
}

@Composable
fun ChatMessageBubble(
    message: Message,
    isSentByMe: Boolean
) {
    val timeFormat = remember { SimpleDateFormat("h:mm a", Locale.getDefault()) }
    val formattedTime = remember(message.timestamp) {
        message.timestamp?.let { timeFormat.format(it) } ?: ""
    }

    Box(
        modifier = Modifier.fillMaxWidth(),
        contentAlignment = if (isSentByMe) Alignment.CenterEnd else Alignment.CenterStart
    ) {
        Column(
            horizontalAlignment = if (isSentByMe) Alignment.End else Alignment.Start,
            modifier = Modifier.widthIn(max = 290.dp)
        ) {
            Surface(
                shape = RoundedCornerShape(
                    topStart = 16.dp,
                    topEnd = 16.dp,
                    bottomStart = if (isSentByMe) 16.dp else 4.dp,
                    bottomEnd = if (isSentByMe) 4.dp else 16.dp
                ),
                color = if (isSentByMe) K118SentBubble else K118ReceivedBubble,
                tonalElevation = 2.dp
            ) {
                Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)) {
                    Text(
                        text = message.text,
                        color = Color.White,
                        fontSize = 15.sp,
                        lineHeight = 20.sp
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.End,
                        modifier = Modifier.align(Alignment.End)
                    ) {
                        if (formattedTime.isNotBlank()) {
                            Text(
                                text = formattedTime,
                                fontSize = 11.sp,
                                color = if (isSentByMe) Color.White.copy(alpha = 0.7f) else K118TextMuted
                            )
                        }

                        if (isSentByMe) {
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(
                                imageVector = Icons.Default.DoneAll,
                                contentDescription = "Read",
                                tint = if (message.read) Color(0xFF67E8F9) else Color.White.copy(alpha = 0.6f),
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}
