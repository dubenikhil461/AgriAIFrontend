import os
import random
import shutil
import stat
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models
from PIL import Image
import matplotlib.pyplot as plt

# -------------------------------
# 1️⃣ Dataset path
# -------------------------------
DATASET_DIR = "Datasets/Soil-Classification-Dataset/CyAUG-Dataset"

if not os.path.exists(DATASET_DIR):
    raise FileNotFoundError(f"Dataset not found at: {DATASET_DIR}")

print(f"✅ Dataset found at: {DATASET_DIR}")

# -------------------------------
# 2️⃣ Output directories
# -------------------------------
BASE_DIR = "dataset"  # backend/dataset/
TRAIN_DIR = os.path.join(BASE_DIR, "train")
VAL_DIR = os.path.join(BASE_DIR, "val")
VAL_SPLIT = 0.2  # 20% validation

# Robust folder deletion for Windows
def remove_folder_safe(folder):
    """Recursively delete folder, even with read-only files."""
    if not os.path.exists(folder):
        return

    def handle_remove_error(func, path, exc_info):
        os.chmod(path, stat.S_IWRITE)
        func(path)

    shutil.rmtree(folder, onerror=handle_remove_error)
    print(f"✅ Folder '{folder}' deleted successfully (or already removed).")

# Delete previous dataset folder safely
if os.path.exists(BASE_DIR):
    remove_folder_safe(BASE_DIR)

# -------------------------------
# 3️⃣ Create train/val folders
# -------------------------------
soil_types = [d for d in os.listdir(DATASET_DIR) if os.path.isdir(os.path.join(DATASET_DIR, d))]
if not soil_types:
    raise Exception("No soil folders found in dataset!")

for soil in soil_types:
    os.makedirs(os.path.join(TRAIN_DIR, soil), exist_ok=True)
    os.makedirs(os.path.join(VAL_DIR, soil), exist_ok=True)

print(f"✅ Train/Val directories created at {BASE_DIR}/")

# -------------------------------
# 4️⃣ Split images into train/val
# -------------------------------
for soil in soil_types:
    soil_path = os.path.join(DATASET_DIR, soil)
    imgs = [f for f in os.listdir(soil_path) if os.path.isfile(os.path.join(soil_path, f)) and f.lower().endswith(('.jpg', '.jpeg', '.png'))]

    random.shuffle(imgs)
    n_val = int(len(imgs) * VAL_SPLIT)
    val_imgs = imgs[:n_val]
    train_imgs = imgs[n_val:]

    for img in train_imgs:
        shutil.copy(os.path.join(soil_path, img), os.path.join(TRAIN_DIR, soil, img))
    for img in val_imgs:
        shutil.copy(os.path.join(soil_path, img), os.path.join(VAL_DIR, soil, img))

print("✅ Train/Validation split done!")

print(f"Soil types detected: {soil_types} (Total: {len(soil_types)})")

# -------------------------------
# 5️⃣ Data Generators
# -------------------------------
train_gen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True
).flow_from_directory(
    TRAIN_DIR, target_size=(224,224), batch_size=32, class_mode='categorical'
)

val_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
    VAL_DIR, target_size=(224,224), batch_size=32, class_mode='categorical'
)

# -------------------------------
# 6️⃣ Build CNN Model
# -------------------------------
model = models.Sequential([
    layers.Input(shape=(224,224,3)),  # Recommended way
    layers.Conv2D(32, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),
    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),
    layers.Conv2D(128, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(len(soil_types), activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# -------------------------------
# 7️⃣ Train the model
# -------------------------------
EPOCHS = 10
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS
)

# -------------------------------
# 8️⃣ Save the model
# -------------------------------
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)
model_path = os.path.join(MODEL_DIR, "soil_model.keras")  # Native Keras format
model.save(model_path)
print(f"✅ Model saved at: {model_path}")

# -------------------------------
# 9️⃣ Plot accuracy/loss
# -------------------------------
plt.plot(history.history['accuracy'], label='train_acc')
plt.plot(history.history['val_accuracy'], label='val_acc')
plt.title("Model Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.legend()
plt.show()

plt.plot(history.history['loss'], label='train_loss')
plt.plot(history.history['val_loss'], label='val_loss')
plt.title("Model Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.legend()
plt.show()
