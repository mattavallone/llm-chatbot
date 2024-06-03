// Function to send a message
function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var message = messageInput.value.trim();
    if (message !== "") {
        sendMessageToServer(message);
        displayMessage(message, true); // Display user message
        messageInput.value = ""; // Clear input field after sending message
    }
}

// Function to send message to the server
function sendMessageToServer(message) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/send_message", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            displayMessage(response.response, false); // Display server response
        }
    };
    xhr.send(JSON.stringify({ message: message }));
}

// Function to display a message
function displayMessage(message, isUserMessage) {
    var messagesDiv = document.getElementById("messages");
    var messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.classList.add("chat-message");
    if (isUserMessage) {
        messageDiv.classList.add("user-message");
    } else {
        messageDiv.classList.add("server-message");
    }
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Automatically scroll to bottom
}

// Function to handle sending message when Enter key is pressed
document.getElementById("message-input").addEventListener("keypress", function(event) {
    if (event.keyCode === 13) { // 13 is the keycode for Enter key
        sendMessage();
    }
});

// Function to clear the chat history
function clearChat() {
    var messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = ""; // Clear all messages
}
