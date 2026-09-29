package com.k118.chat

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.k118.chat.ui.navigation.K118NavGraph
import com.k118.chat.ui.theme.K118DarkBackground
import com.k118.chat.ui.theme.K118Theme
import com.k118.chat.ui.viewmodel.AuthViewModel
import com.k118.chat.ui.viewmodel.ChatViewModel

class MainActivity : ComponentActivity() {

    private val authViewModel: AuthViewModel by viewModels()
    private val chatViewModel: ChatViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            K118Theme(darkTheme = true) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = K118DarkBackground
                ) {
                    val navController = rememberNavController()

                    K118NavGraph(
                        navController = navController,
                        authViewModel = authViewModel,
                        chatViewModel = chatViewModel,
                        onGoogleSignInRequested = {
                            // Initiates Google Sign In via CredentialManager or GoogleSignInClient
                            Toast.makeText(
                                this@MainActivity,
                                "Connecting to Google Sign-In...",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    )
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        // Update presence to online when app is in foreground
        authViewModel.setPresence("online")
    }

    override fun onPause() {
        super.onPause()
        // Update presence to away when app is paused
        authViewModel.setPresence("away")
    }

    override fun onDestroy() {
        super.onDestroy()
        // Update presence to offline when app closes
        authViewModel.setPresence("offline")
    }
}
