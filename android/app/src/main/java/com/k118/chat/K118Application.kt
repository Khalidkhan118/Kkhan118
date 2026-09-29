package com.k118.chat

import android.app.Application
import com.google.firebase.FirebaseApp

class K118Application : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize Firebase
        FirebaseApp.initializeApp(this)
    }
}
