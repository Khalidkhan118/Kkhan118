package com.k118.chat.data.model

import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.ServerTimestamp
import java.util.Date

data class Message(
    @DocumentId
    val id: String = "",
    val chatRoomId: String = "",
    val senderId: String = "",
    val senderName: String = "",
    val senderPhoto: String = "",
    val recipientId: String = "",
    val text: String = "",
    val mediaUrl: String? = null,
    val mediaType: String = "text", // "text", "image", "audio"
    val read: Boolean = false,
    @ServerTimestamp
    val timestamp: Date? = null
)
