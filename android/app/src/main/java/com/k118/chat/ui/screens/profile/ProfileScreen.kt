package com.k118.chat.ui.screens.profile

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
    onSignOut: () -> Unit,
    modifier: Modifier = Modifier
) {
    var isEditingBio by remember { mutableStateOf(false) }
    var currentBio by remember { mutableStateOf(user.bio) }

    val statusOptions = listOf(
        "online" to "Online",
        "away" to "Away",
        "busy" to "Do Not Disturb",
        "offline" to "Appear Offline"
    )

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
                    Text(
                        text = "My Profile",
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        fontSize = 18.sp
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = K118DarkBackground
                )
            )
        },
        containerColor = K118DarkBackground,
        modifier = modifier
    ) { innerPadding ->
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            // Profile Photo with Camera edit badge
            Box(contentAlignment = Alignment.BottomEnd) {
                if (user.photoURL.isNotBlank()) {
                    AsyncImage(
                        model = user.photoURL,
                        contentDescription = "Profile Photo",
                        modifier = Modifier
                            .size(108.dp)
                            .clip(CircleShape)
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .size(108.dp)
                            .clip(CircleShape)
                            .background(K118PurpleDark),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = user.displayName.take(1).uppercase(),
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 40.sp
                        )
                    }
                }

                // Camera overlay button
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(K118PurplePrimary)
                        .clickable { /* Photo Picker */ },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.CameraAlt,
                        contentDescription = "Change Photo",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = user.displayName,
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )

            Text(
                text = user.email,
                fontSize = 14.sp,
                color = K118TextSecondary
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Presence Status Selection Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = K118DarkSurface,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "AVAILABILITY STATUS",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = K118TextMuted,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    statusOptions.forEach { (statusCode, label) ->
                        val isSelected = user.status.equals(statusCode, ignoreCase = true)
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(10.dp))
                                .clickable { onUpdateStatus(statusCode) }
                                .padding(vertical = 10.dp, horizontal = 8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(12.dp)
                                    .clip(CircleShape)
                                    .background(
                                        when (statusCode) {
                                            "online" -> K118OnlineGreen
                                            "away" -> K118AwayOrange
                                            "busy" -> Color(0xFFEF4444)
                                            else -> K118OfflineGray
                                        }
                                    )
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(
                                text = label,
                                fontSize = 15.sp,
                                color = if (isSelected) Color.White else K118TextSecondary,
                                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                                modifier = Modifier.weight(1f)
                            )
                            if (isSelected) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = "Selected",
                                    tint = K118PurpleLight,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Bio Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = K118DarkSurface,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "STATUS MESSAGE / BIO",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = K118TextMuted,
                            letterSpacing = 1.sp
                        )
                        IconButton(
                            onClick = {
                                if (isEditingBio) {
                                    onUpdateBio(currentBio)
                                    isEditingBio = false
                                } else {
                                    isEditingBio = true
                                }
                            },
                            modifier = Modifier.size(24.dp)
                        ) {
                            Icon(
                                imageVector = if (isEditingBio) Icons.Default.Check else Icons.Default.Edit,
                                contentDescription = "Edit Bio",
                                tint = K118PurpleLight,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    if (isEditingBio) {
                        OutlinedTextField(
                            value = currentBio,
                            onValueChange = { currentBio = it },
                            maxLines = 3,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White
                            ),
                            modifier = Modifier.fillMaxWidth()
                        )
                    } else {
                        Text(
                            text = user.bio,
                            fontSize = 14.sp,
                            color = K118TextPrimary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Sign Out Button
            OutlinedButton(
                onClick = onSignOut,
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = Color(0xFFF87171)
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.Logout,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Sign Out",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}
