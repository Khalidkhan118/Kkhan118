package com.k118.chat.data.repository

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions
import com.k118.chat.data.model.User
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import java.util.Date

class AuthRepository(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance(),
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    val currentUser: FirebaseUser?
        get() = auth.currentUser

    val currentUserId: String?
        get() = auth.currentUser?.uid

    fun authStateFlow(): Flow<FirebaseUser?> = callbackFlow {
        val listener = FirebaseAuth.AuthStateListener { firebaseAuth ->
            trySend(firebaseAuth.currentUser)
        }
        auth.addAuthStateListener(listener)
        awaitClose { auth.removeAuthStateListener(listener) }
    }

    suspend fun syncUserProfile(user: FirebaseUser, status: String = "online") {
        val userDoc = firestore.collection("users").document(user.uid)
        val snapshot = userDoc.get().await()

        val existingBio = snapshot.getString("bio") ?: "Hey there! I am using K118 Chat."
        val userProfile = User(
            uid = user.uid,
            displayName = user.displayName ?: "K118 User",
            email = user.email ?: "",
            photoURL = user.photoUrl?.toString() ?: "",
            status = status,
            bio = existingBio,
            lastSeen = Date()
        )

        userDoc.set(userProfile, SetOptions.merge()).await()
    }

    suspend fun updatePresence(status: String) {
        val uid = currentUserId ?: return
        firestore.collection("users").document(uid).update(
            mapOf(
                "status" to status,
                "lastSeen" to Date()
            )
        ).await()
    }

    suspend fun updateBio(newBio: String) {
        val uid = currentUserId ?: return
        firestore.collection("users").document(uid).update("bio", newBio).await()
    }

    suspend fun updateDisplayName(name: String) {
        val uid = currentUserId ?: return
        firestore.collection("users").document(uid).update("displayName", name).await()
    }

    fun getUserProfile(userId: String): Flow<User?> = callbackFlow {
        val docRef = firestore.collection("users").document(userId)
        val subscription = docRef.addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            if (snapshot != null && snapshot.exists()) {
                val user = snapshot.toObject(User::class.java)
                trySend(user)
            } else {
                trySend(null)
            }
        }
        awaitClose { subscription.remove() }
    }

    fun signOut() {
        auth.signOut()
    }
}
