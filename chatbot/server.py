from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import wikipedia
import datetime

app = Flask(__name__)

model_name = "microsoft/DialoGPT-small"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data['message']

    if "time" in user_input.lower():
        reply = f"The current time is {datetime.datetime.now().strftime('%H:%M:%S')}"
    elif "date" in user_input.lower():
        reply = f"Today's date is {datetime.datetime.now().strftime('%Y-%m-%d')}"
    elif "donation" in user_input.lower():
        reply = "Donations help us provide education, resources, and digital skills to the youth in South Africa through the K&L Foundation."
    elif "who is" in user_input.lower() or "what is" in user_input.lower():
        try:
            summary = wikipedia.summary(user_input, sentences=2)
            reply = summary
        except Exception:
            reply = "I couldn’t find much about that topic."
    else:
        input_ids = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors='pt')
        output_ids = model.generate(input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id)
        reply = tokenizer.decode(output_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True)

    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(port=5000)
