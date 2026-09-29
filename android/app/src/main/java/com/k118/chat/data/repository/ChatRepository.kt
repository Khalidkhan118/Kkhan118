package com.k118.chat.data.repository

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
        return if (userId1 < userId2) "${userId1}_${userId2}" else "${userId2}_${userId1}"
    }

    fun getAllUsers(currentUserId: String): Flow<List<User>> = callbackFlow {
        val query = firestore.collection("users")
            .whereNotEqualTo("uid", currentUserId)
            .limit(50)

        val subscription = query.addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            val users = snapshot?.documents?.mapNotNull { it.toObject(User::class.java) } ?: emptyList()
            trySend(users)
        }
        awaitClose { subscription.remove() }
    }

    fun getChatRoomsForUser(currentUserId: String): Flow<List<ChatRoom>> = callbackFlow {
        val query = firestore.collection("chats")
            .whereArrayContains("participants", currentUserId)
            .orderBy("updatedAt", Query.Direction.DESCENDING)

        val subscription = query.addSnapshotListener { snapshot, error ->
            if (error != null) {
                // If index is building or empty fallback
                trySend(emptyList())
                return@addSnapshotListener
            }
            val chats = snapshot?.documents?.mapNotNull { it.toObject(ChatRoom::class.java) } ?: emptyList()
            trySend(chats)
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
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            val messages = snapshot?.documents?.mapNotNull { it.toObject(Message::class.java) } ?: emptyList()
            trySend(messages)
        }
        awaitClose { subscription.remove() }
    }

    suspend fun sendMessage(
        sender: User,
        recipientId: String,
        text: String,
        mediaUrl: String? = null,
        mediaType: String = "text"
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
            mediaType = mediaType,
            read = false,
            timestamp = Date()
        )

        // Write message
        newMessageDoc.set(message).await()

        // Update chat room summary
        val chatRoomRef = firestore.collection("chats").document(chatRoomId)
        chatRoomRef.set(
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

    suspend fun markMessagesAsRead(chatRoomId: String, currentUserId: String) {
        val unreadQuery = firestore.collection("chats")
            .document(chatRoomId)
            .collection("messages")
            .whereEqualTo("recipientId", currentUserId)
            .whereEqualTo("read", false)
            .get()
            .await()

        for (doc in unreadQuery.documents) {
            doc.reference.update("read", true).await()
        }
    }
}
