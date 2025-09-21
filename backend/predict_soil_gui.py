import tkinter as tk
from tkinter import filedialog
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model

# ----------------------------
# Load the trained model
# ----------------------------
model = load_model("models/soil_model.keras")  # or your original model

# Soil class names
soil_types = ['Alluvial_Soil', 'Arid_Soil', 'Black_Soil', 'Laterite_Soil', 'Mountain_Soil', 'Red_Soil', 'Yellow_Soil']

# ----------------------------
# Function to preprocess and predict an image
# ----------------------------
def predict_soil(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    pred = model.predict(img_array)
    pred_class_index = np.argmax(pred)
    pred_class = soil_types[pred_class_index]
    return img, pred_class

# ----------------------------
# GUI to select images
# ----------------------------
root = tk.Tk()
root.withdraw()  # hide main window

file_paths = filedialog.askopenfilenames(title="Select images to predict")  # select multiple images

# ----------------------------
# Display images with predictions
# ----------------------------
for file_path in file_paths:
    img, pred_class = predict_soil(file_path)
    plt.imshow(img)
    plt.title(f"Predicted: {pred_class}")
    plt.axis('off')
    plt.show()
