import os
from openai import OpenAI

# Load API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    print("❌ OPENAI_API_KEY not found. Please set it first.")
else:
    print("✅ API key loaded.")

# Initialize client
client = OpenAI(api_key=api_key)

try:
    # Simple test call
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello, just to confirm the API works."}
        ],
        max_tokens=20
    )

    print("✅ OpenAI API is working!")
    print("Response:", response.choices[0].message.content)

except Exception as e:
    print("❌ Error:", e)
