package com.k118.chat.data.model

import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.ServerTimestamp
import java.util.Date

data class User(
    @DocumentId
    val uid: String = "",
    val displayName: String = "",
    val email: String = "",
    val photoURL: String = "",
    val status: String = "online", // "online", "offline", "away"
    val bio: String = "Hey there! I am using K118 Chat.",
    val lastSeen: Date? = null,
    @ServerTimestamp
    val createdAt: Date? = null,
    @ServerTimestamp
    val updatedAt: Date? = null
) {
    val isOnline: Boolean
        get() = status.equals("online", ignoreCase = true)
}
