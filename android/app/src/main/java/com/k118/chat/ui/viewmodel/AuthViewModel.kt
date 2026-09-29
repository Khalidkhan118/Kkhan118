package com.k118.chat.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseUser
import com.k118.chat.data.model.User
import com.k118.chat.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class AuthUiState {
    object Initial : AuthUiState()
    object Loading : AuthUiState()
    data class Authenticated(val firebaseUser: FirebaseUser, val profile: User?) : AuthUiState()
    object Unauthenticated : AuthUiState()
    data class Error(val message: String) : AuthUiState()
}

class AuthViewModel(
    private val authRepository: AuthRepository = AuthRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow<AuthUiState>(AuthUiState.Initial)
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    init {
        checkAuthState()
    }

    private fun checkAuthState() {
        viewModelScope.launch {
            authRepository.authStateFlow().collect { user ->
                if (user != null) {
                    authRepository.syncUserProfile(user, status = "online")
                    authRepository.getUserProfile(user.uid).collect { profile ->
                        _uiState.value = AuthUiState.Authenticated(user, profile)
                    }
                } else {
                    _uiState.value = AuthUiState.Unauthenticated
                }
            }
        }
    }

    fun onGoogleSignInSuccess(user: FirebaseUser) {
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading
            try {
                authRepository.syncUserProfile(user, status = "online")
            } catch (e: Exception) {
                _uiState.value = AuthUiState.Error(e.message ?: "Authentication sync failed")
            }
        }
    }

    fun setPresence(status: String) {
        viewModelScope.launch {
            authRepository.updatePresence(status)
        }
    }

    fun signOut() {
        viewModelScope.launch {
            authRepository.updatePresence("offline")
            authRepository.signOut()
            _uiState.value = AuthUiState.Unauthenticated
        }
    }
}
