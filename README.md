# LLM Chatbot Web App

## Description
LLM Chatbot is a web-based application that utilizes the StableBeluga model [stabilityai/StableBeluga-7B](https://huggingface.co/stabilityai/StableBeluga-7B) from Hugging Face's Transformers library to provide conversational responses to user input. The chatbot assists users by answering questions, engaging in dialogue, and providing assistance based on the prompts it receives.

https://github.com/mattavallone/llm-chatbot/assets/17806421/5b15435e-2c6e-426b-aee3-d7fb639be777

(Video Speed 4x)
## Features
- Interactive chat interface where users can type messages and receive responses from the chatbot.
- The chatbot's responses are generated using the StableBeluga model, providing intelligent and contextually relevant answers.
- Responses are limited to a maximum of 1000 characters to ensure concise and relevant interactions.
- Smarter truncation logic is implemented to avoid cutting off responses mid-sentence.
- Real-time updating of the chat window with user input and chatbot responses.
- Throbber animation indicates to the user that the chatbot is processing their input.

## Usage
1. Access the application through a web browser.
2. Type a message in the input field and press "Send" or press the Enter key to send the message to the chatbot.
3. The chatbot processes the input and generates a response.
4. The response is displayed in the chat window.
5. The user can continue the conversation by sending more messages.

## Installation
1. Clone the repository from GitHub: `git clone https://github.com/mattavallone/llm-chatbot.git`
2. Navigate to the project directory: `cd llm-chatbot`
3. Install the required dependencies: `pip install -r requirements.txt`
4. Set up the environment variables, including the Hugging Face token, in a `.env` file.
5. Run the Flask application: `python3 app.py`
6. Access the application in a web browser at `http://localhost:5000`.

## Dependencies
- Flask
- Transformers
- Torch

## Contributing
Contributions to the LLM Chatbot project are welcome! Feel free to submit bug reports, feature requests, or pull requests via GitHub.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
