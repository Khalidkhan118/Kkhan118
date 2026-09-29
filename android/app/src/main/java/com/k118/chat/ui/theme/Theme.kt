package com.k118.chat.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = K118PurplePrimary,
    onPrimary = Color.White,
    primaryContainer = K118PurpleDark,
    onPrimaryContainer = Color.White,
    secondary = K118OnlineGreen,
    onSecondary = Color.Black,
    background = K118DarkBackground,
    onBackground = K118TextPrimary,
    surface = K118DarkSurface,
    onSurface = K118TextPrimary,
    surfaceVariant = K118DarkSurfaceVariant,
    onSurfaceVariant = K118TextSecondary
)

private val LightColorScheme = lightColorScheme(
    primary = K118PurplePrimary,
    onPrimary = Color.White,
    secondary = K118OnlineGreen,
    background = Color(0xFFF8FAFC),
    onBackground = Color(0xFF0F172A),
    surface = Color.White,
    onSurface = Color(0xFF0F172A),
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = Color(0xFF475569)
)

@Composable
fun K118Theme(
    darkTheme: Boolean = true, // Default to sleek dark mode matching modern chat apps
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
