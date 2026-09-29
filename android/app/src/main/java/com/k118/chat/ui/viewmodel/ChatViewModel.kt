package com.k118.chat.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.k118.chat.data.model.ChatRoom
import com.k118.chat.data.model.Message
import com.k118.chat.data.model.User
import com.k118.chat.data.repository.ChatRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ChatListUiState(
    val isLoading: Boolean = true,
    val chatRooms: List<ChatRoom> = emptyList(),
    val friends: List<User> = emptyList(),
    val errorMessage: String? = null
)

data class ActiveChatUiState(
    val chatRoomId: String = "",
    val recipient: User? = null,
    val messages: List<Message> = emptyList(),
    val isSending: Boolean = false,
    val inputText: String = ""
)

class ChatViewModel(
    private val chatRepository: ChatRepository = ChatRepository()
) : ViewModel() {

    private val _listState = MutableStateFlow(ChatListUiState())
    val listState: StateFlow<ChatListUiState> = _listState.asStateFlow()

    private val _activeChatState = MutableStateFlow(ActiveChatUiState())
    val activeChatState: StateFlow<ActiveChatUiState> = _activeChatState.asStateFlow()

    fun loadData(currentUserId: String) {
        viewModelScope.launch {
            _listState.value = _listState.value.copy(isLoading = true)

            // Listen to friends
            launch {
                chatRepository.getAllUsers(currentUserId).collect { userList ->
                    _listState.value = _listState.value.copy(
                        friends = userList,
                        isLoading = false
                    )
                }
            }

            // Listen to active conversations
            launch {
                chatRepository.getChatRoomsForUser(currentUserId).collect { roomList ->
                    _listState.value = _listState.value.copy(chatRooms = roomList)
                }
            }
        }
    }

    fun openChat(currentUser: User, friend: User) {
        val roomId = chatRepository.generateChatRoomId(currentUser.uid, friend.uid)
        _activeChatState.value = ActiveChatUiState(
            chatRoomId = roomId,
            recipient = friend,
            messages = emptyList()
        )

        viewModelScope.launch {
            chatRepository.markMessagesAsRead(roomId, currentUser.uid)
            chatRepository.getMessages(roomId).collect { msgList ->
                _activeChatState.value = _activeChatState.value.copy(messages = msgList)
            }
        }
    }

    fun updateInputText(newText: String) {
        _activeChatState.value = _activeChatState.value.copy(inputText = newText)
    }

    fun sendMessage(sender: User) {
        val state = _activeChatState.value
        val text = state.inputText.trim()
        val recipient = state.recipient ?: return
        if (text.isEmpty()) return

        _activeChatState.value = _activeChatState.value.copy(inputText = "", isSending = true)

        viewModelScope.launch {
            try {
                chatRepository.sendMessage(
                    sender = sender,
                    recipientId = recipient.uid,
                    text = text
                )
            } finally {
                _activeChatState.value = _activeChatState.value.copy(isSending = false)
            }
        }
    }
}
