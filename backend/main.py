from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import os
import requests
import pickle
from dotenv import load_dotenv

# ----------------------------
# Load environment variables
# ----------------------------
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")  # Google Gemini API key

# ----------------------------
# FastAPI Setup
# ----------------------------
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Soil Model & Data
# ----------------------------
soil_model = load_model("models/soil_model.keras")

soil_classes = [
    "Alluvial_Soil", "Arid_Soil", "Black_Soil", "Laterite_Soil",
    "Mountain_Soil", "Red_Soil", "Yellow_Soil"
]

soil_properties = {
    "Alluvial_Soil": {"N": 0.2, "P": 0.15, "K": 0.25, "pH": 6.8, "acidity": "Neutral", "organic_matter": "Medium"},
    "Arid_Soil": {"N": 0.1, "P": 0.05, "K": 0.15, "pH": 7.5, "acidity": "Slightly Alkaline", "organic_matter": "Low"},
    "Black_Soil": {"N": 0.3, "P": 0.2, "K": 0.4, "pH": 7.0, "acidity": "Neutral", "organic_matter": "High"},
    "Laterite_Soil": {"N": 0.15, "P": 0.1, "K": 0.2, "pH": 5.5, "acidity": "Slightly Acidic", "organic_matter": "Low"},
    "Mountain_Soil": {"N": 0.25, "P": 0.2, "K": 0.3, "pH": 6.5, "acidity": "Neutral", "organic_matter": "Medium"},
    "Red_Soil": {"N": 0.15, "P": 0.1, "K": 0.2, "pH": 6.0, "acidity": "Slightly Acidic", "organic_matter": "Low"},
    "Yellow_Soil": {"N": 0.2, "P": 0.15, "K": 0.25, "pH": 6.5, "acidity": "Neutral", "organic_matter": "Medium"}
}

def preprocess_image(image: Image.Image):
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# ----------------------------
# Soil Prediction Endpoint
# ----------------------------
@app.post("/predict-soil")
async def predict_soil(
    file: UploadFile = File(...),
    N: float = Form(None),
    P: float = Form(None),
    K: float = Form(None),
    ph: float = Form(None)
):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    img_array = preprocess_image(image)

    predictions = soil_model.predict(img_array)
    predicted_class = soil_classes[np.argmax(predictions)]

    props = soil_properties[predicted_class]
    props["N"] = N if N is not None else props["N"]
    props["P"] = P if P is not None else props["P"]
    props["K"] = K if K is not None else props["K"]
    props["pH"] = ph if ph is not None else props["pH"]

    return {
        "soil_type": predicted_class,
        "confidence": float(np.max(predictions)),
        "N": props["N"],
        "P": props["P"],
        "K": props["K"],
        "pH": props["pH"],
        "acidity": props["acidity"],
        "organic_matter": props["organic_matter"]
    }

# ----------------------------
# Crop Recommendation Endpoint
# ----------------------------
# Load Random Forest model, scaler, and label encoder
import joblib

with open("models/crop_scaler.pkl", "rb") as f:
    scaler = joblib.load(f)

with open("models/crop_labelencoder.pkl", "rb") as f:
    label_encoder = joblib.load(f)

with open("models/crop_rf_model.pkl", "rb") as f:
    crop_model = joblib.load(f)


class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

@app.post("/recommend-crop")
async def recommend_crop(data: CropInput):
    features = np.array([[data.N, data.P, data.K, data.temperature, data.humidity, data.ph, data.rainfall]])
    features_scaled = scaler.transform(features)
    prediction = crop_model.predict(features_scaled)
    crop_name = label_encoder.inverse_transform(prediction)[0]

    return {
        "recommended_crop": crop_name
    }

# ----------------------------
# Chatbot Endpoint (Hybrid AI + Rule)
# ----------------------------
class ChatRequest(BaseModel):
    message: str

faq_responses = {
    "wheat": "Wheat grows well in loamy soil with good drainage.",
    "rice": "Rice grows best in soil with pH 6–7 and requires standing water.",
    "fertility": "Add organic compost and rotate crops to maintain fertility.",
}

@app.post("/chatbot")
async def chatbot(request: ChatRequest):
    user_message = request.message.lower()

    # 1️⃣ Rule-based check
    for key in faq_responses:
        if key in user_message:
            return {"reply": faq_responses[key]}

    # 2️⃣ AI fallback using Google Gemini API
    try:
        url = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GOOGLE_API_KEY}",
        }
        payload = {
            "prompt": user_message,
            "temperature": 0.7,
            "candidateCount": 1,
            "maxOutputTokens": 200
        }
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()
        if response.status_code == 200:
            ai_reply = data["candidates"][0]["output"]
            return {"reply": ai_reply}
        else:
            return {"reply": f"Error: {data.get('error', {}).get('message', 'Unknown error')}"}
    except Exception as e:
        print("Google Gemini API Error:", e)
        return {"reply": f"Error: {str(e)}"}

# ----------------------------
# Root Endpoint
# ----------------------------
@app.get("/")
async def root():
    return {"message": "Soil Classification, Crop Recommendation & Chatbot API is running 🚀"}
