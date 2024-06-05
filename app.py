from flask import Flask, jsonify, render_template, request, json
import os
import threading
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from dotenv import load_dotenv

app = Flask(__name__)

responses = {}

def initialize_tokenizer():
    tk = AutoTokenizer.from_pretrained("stabilityai/StableBeluga-7B", use_fast=False)
    return tk

def initialize_model():
    # Determine if GPU is available and set device accordingly
    device = "cuda" if torch.cuda.is_available() else "cpu"
    llm = AutoModelForCausalLM.from_pretrained("stabilityai/StableBeluga-7B", torch_dtype=torch.float16 if device == "cuda" else torch.float32, low_cpu_mem_usage=True)
    llm.to(device)  # Move the model to the appropriate device
    return llm, device

@app.route('/')
def index():
    return render_template('index.html')

def generate_response(task_id, message):
    prompt = f"{system_prompt}### User: {message}\n\n### Assistant:\n"
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    output = llm.generate(**inputs, do_sample=True, top_p=0.95, top_k=0, max_new_tokens=256)
    answer = tokenizer.decode(output[0], skip_special_tokens=True).split('### Assistant:\n ')[1]
    
    if len(answer) > 1000:
        truncated_answer = answer[:1000]
        # Find the last sentence-ending punctuation in the truncated part
        last_punctuation_index = max(truncated_answer.rfind('.'), truncated_answer.rfind('!'), truncated_answer.rfind('?'))
        if last_punctuation_index != -1:
            answer = truncated_answer[:last_punctuation_index + 1]
        else:
            answer = truncated_answer  # Fall back to simple truncation if no punctuation is found
    
    responses[task_id] = answer

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.get_json()

    if isinstance(data, str):
        data = json.loads(data)

    message = data['message']
    task_id = str(len(responses))  # Simple unique task_id generation
    threading.Thread(target=generate_response, args=(task_id, message)).start()
    
    return jsonify({'task_id': task_id})

@app.route('/get_response/<task_id>', methods=['GET'])
def get_response(task_id):
    if task_id in responses:
        response = {
            'state': 'SUCCESS',
            'result': responses[task_id]
        }
    else:
        response = {
            'state': 'PENDING',
            'status': 'Pending...'
        }

    return jsonify(response)

if __name__ == "__main__":
    # load huggingface token
    load_dotenv()
    HF_TOKEN = os.getenv('HF_TOKEN')

    # initialize models
    system_prompt = "### System:\nYou are StableBeluga, an AI that follows instructions extremely well. Help as much as you can. Remember, be safe, and don't do anything illegal.\n\n"
    tokenizer = initialize_tokenizer()
    llm, device = initialize_model()

    app.run()
