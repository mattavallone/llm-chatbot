document.addEventListener('DOMContentLoaded', function () {
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
                var taskId = response.task_id;
                pollForResponse(taskId);
            }
        };
        xhr.send(JSON.stringify({ message: message }));
        showThrobber(); // Show throbber when message is sent
    }

    // Function to poll for the response
    function pollForResponse(taskId) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", `/get_response/${taskId}`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                var response = JSON.parse(xhr.responseText);
                if (response.state === "SUCCESS") {
                    displayMessage(response.result, false); // Display server response
                    hideThrobber(); // Hide throbber when response is received
                } else if (response.state === "PENDING") {
                    setTimeout(function () {
                        pollForResponse(taskId);
                    }, 1000); // Poll every second
                }
            }
        };
        xhr.send();
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
        // Dynamically adjust width based on message length
        var messageWidth = Math.min(message.length * 10, messagesDiv.offsetWidth * 0.5);
        messageDiv.style.maxWidth = messageWidth + "px";
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Automatically scroll to bottom
    }

    // Function to clear chat history
    function clearChat() {
        var messagesDiv = document.getElementById("messages");
        messagesDiv.innerHTML = ""; // Clear all messages
    }

    // Show throbber
    function showThrobber() {
        var throbber = document.getElementById("throbber");
        throbber.style.display = "block";
    }

    // Hide throbber
    function hideThrobber() {
        var throbber = document.getElementById("throbber");
        throbber.style.display = "none";
    }

    // Function to handle sending message when Enter key is pressed
    document.getElementById("message-input").addEventListener("keypress", function (event) {
        if (event.keyCode === 13) { // 13 is the keycode for Enter key
            sendMessage();
        }
    });

    // Attach clearChat function to the clear button
    document.querySelector('.clear-chat').addEventListener('click', clearChat);
});
