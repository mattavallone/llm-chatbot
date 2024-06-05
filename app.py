from flask import Flask, jsonify, render_template, request, json
import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from dotenv import load_dotenv

app = Flask(__name__)

def initialize_tokenizer():
	tk = AutoTokenizer.from_pretrained("stabilityai/StableBeluga-7B", use_fast=False)

	return tk

def initialize_model():
	llm = AutoModelForCausalLM.from_pretrained("stabilityai/StableBeluga-7B", torch_dtype=torch.float16, low_cpu_mem_usage=True, device_map="auto")

	return llm

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
	# recieve message from the user
	data = request.get_json()

	# ensure message is converted to json if it was recieved as str
	if isinstance(data, str):
		data = json.loads(data)
	
	# extract text of the message
	message = data['message']
	prompt = f"{system_prompt}### User: {message}\n\n### Assistant:\n"
	inputs = tokenizer(prompt, return_tensors="pt")
	output = llm.generate(**inputs, do_sample=True, top_p=0.95, top_k=0, max_new_tokens=256)

	# invoke beluga llm
	response = {'message': tokenizer.decode(output[0], skip_special_tokens=True)}
	
	return jsonify(response)


if __name__ == "__main__":
	# load huggingface token
	load_dotenv()
	HF_TOKEN = os.getenv('HF_TOKEN')

	# initialize models
	system_prompt = "### System:\nYou are StableBeluga, an AI that follows instructions extremely well. Help as much as you can. Remember, be safe, and don't do anything illegal.\n\n"
	tokenizer = initialize_tokenizer()
	llm = initialize_model()

	app.run()